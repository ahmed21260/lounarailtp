import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '15', 10);
    const offset = (page - 1) * limit;

    const logs = await prisma.securityLog.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const totalLogs = await prisma.securityLog.count();
    const totalPages = Math.ceil(totalLogs / limit);

    return NextResponse.json({
      logs,
      pagination: {
        page,
        limit,
        totalPages,
        totalLogs,
      },
    }, { status: 200 });
  } catch (error) {
    console.error('API Security Logs Fetch Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch security logs' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { type, message, ip, userAgent, page, severity, metadata } = await request.json();

    // Sauvegarder le log de sécurité
    const securityLog = await prisma.securityLog.create({
      data: {
        type: type,
        message: message,
        ip: ip,
        userAgent: userAgent,
        page: page,
        severity: severity,
        metadata: metadata
      }
    });

    // Envoyer une notification pour les alertes de sécurité importantes
    if (severity === 'high' || type === 'CLIC_DROIT' || type === 'INSPECTION' || type === 'ATTACK') {
      try {
        await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3001'}/api/notifications`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'security',
            data: {
              type: type,
              message: message,
              ip: ip,
              page: page,
              severity: severity
            },
            priority: 'high'
          })
        });
      } catch (error) {
        console.warn('Erreur envoi notification sécurité:', error);
      }
    }

    return NextResponse.json({ success: true, logId: securityLog.id });
  } catch (error) {
    console.error('API Security Logs Post Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create security log' }, { status: 500 });
  }
} 