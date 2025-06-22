import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d'; // 7d, 30d, 90d

    // Calculer la date de début selon la période
    const now = new Date();
    let startDate;
    
    switch (period) {
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default: // 7d
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Statistiques globales
    const totalVisitors = await prisma.visitor.count({
      where: { createdAt: { gte: startDate } }
    });

    const uniqueVisitors = await prisma.visitor.groupBy({
      by: ['ipAddress'],
      where: { createdAt: { gte: startDate } },
      _count: { id: true }
    });

    const totalPageViews = await prisma.pageView.count({
      where: { createdAt: { gte: startDate } }
    });

    // Visiteurs par jour (pour graphique)
    const visitorsByDay = await prisma.$queryRaw`
      SELECT 
        CAST(created_at AS DATE) as date,
        COUNT(*) as visitors,
        COUNT(DISTINCT ip_address) as unique_visitors
      FROM "Visitor" 
      WHERE created_at >= ${startDate}
      GROUP BY CAST(created_at AS DATE)
      ORDER BY date ASC
    `;

    // Top pages visitées
    const topPages = await prisma.pageView.groupBy({
      by: ['pageUrl'],
      where: { createdAt: { gte: startDate } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10
    });

    // Top pays
    const topCountries = await prisma.visitor.groupBy({
      by: ['country'],
      where: { 
        createdAt: { gte: startDate },
        country: { not: null }
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10
    });

    // Top appareils
    const topDevices = await prisma.visitor.groupBy({
      by: ['deviceType'],
      where: { createdAt: { gte: startDate } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } }
    });

    // Top navigateurs
    const topBrowsers = await prisma.visitor.groupBy({
      by: ['browser'],
      where: { 
        createdAt: { gte: startDate },
        browser: { not: 'unknown' }
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5
    });

    // Taux de rebond
    const bounceRate = await prisma.visitor.aggregate({
      where: { 
        createdAt: { gte: startDate },
        bounceRate: true
      },
      _count: { id: true }
    });

    const totalBounce = bounceRate._count.id;
    const bounceRatePercentage = totalVisitors > 0 ? (totalBounce / totalVisitors * 100).toFixed(1) : 0;

    // Temps moyen de session
    const avgSessionTime = await prisma.visitor.aggregate({
      where: { 
        createdAt: { gte: startDate },
        visitDuration: { not: null }
      },
      _avg: { visitDuration: true }
    });

    // Sources de trafic
    const trafficSources = await prisma.visitor.groupBy({
      by: ['referrer'],
      where: { 
        createdAt: { gte: startDate },
        referrer: { not: null }
      },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 10
    });

    // Données pour graphiques
    const chartData = {
      visitors: visitorsByDay.map(day => ({
        date: day.date,
        visitors: Number(day.visitors),
        uniqueVisitors: Number(day.unique_visitors)
      })),
      pages: topPages.map(page => ({
        url: page.pageUrl,
        views: page._count.id
      })),
      countries: topCountries.map(country => ({
        country: country.country,
        visitors: country._count.id
      })),
      devices: topDevices.map(device => ({
        device: device.deviceType,
        visitors: device._count.id
      })),
      browsers: topBrowsers.map(browser => ({
        browser: browser.browser,
        visitors: browser._count.id
      }))
    };

    // Statistiques de croissance
    const previousPeriodStart = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
    const previousPeriodVisitors = await prisma.visitor.count({
      where: { 
        createdAt: { 
          gte: previousPeriodStart,
          lt: startDate
        }
      }
    });

    const growthRate = previousPeriodVisitors > 0 
      ? ((totalVisitors - previousPeriodVisitors) / previousPeriodVisitors * 100).toFixed(1)
      : 0;

    return NextResponse.json({
      period,
      stats: {
        totalVisitors,
        uniqueVisitors: uniqueVisitors.length,
        totalPageViews,
        bounceRate: parseFloat(bounceRatePercentage),
        avgSessionTime: Math.round(avgSessionTime._avg.visitDuration || 0),
        growthRate: parseFloat(growthRate)
      },
      chartData,
      topPages: chartData.pages,
      topCountries: chartData.countries,
      topDevices: chartData.devices,
      topBrowsers: chartData.browsers,
      trafficSources: trafficSources.map(source => ({
        source: source.referrer || 'Direct',
        visitors: source._count.id
      }))
    });

  } catch (error) {
    console.error('Erreur récupération analytics:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des analytics' },
      { status: 500 }
    );
  }
} 