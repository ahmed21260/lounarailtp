import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const { type, message } = body;
    
    // Récupérer l'adresse IP de la requête
    const ip = request.headers.get('x-forwarded-for') || request.ip;

    const log = await prisma.securityLog.create({
      data: {
        type: type || 'UNKNOWN_VIOLATION',
        message: message || 'No message provided',
        ipAddress: ip || 'Unknown IP',
      },
    });

    return NextResponse.json({ success: true, logId: log.id }, { status: 201 });
  } catch (error) {
    console.error('API Security Log Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to record security log' }, { status: 500 });
  }
} 