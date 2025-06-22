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