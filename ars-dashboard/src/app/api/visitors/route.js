import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Fonction pour obtenir les informations de géolocalisation
async function getGeoLocation(ip) {
  try {
    // Utiliser ipapi.co pour la géolocalisation (gratuit)
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();
    
    return {
      country: data.country_name,
      city: data.city,
      region: data.region,
      timezone: data.timezone
    };
  } catch (error) {
    console.error('Erreur géolocalisation:', error);
    return {
      country: null,
      city: null,
      region: null,
      timezone: null
    };
  }
}

// Fonction pour détecter le type d'appareil
function detectDeviceType(userAgent) {
  if (!userAgent) return 'unknown';
  
  const mobile = /Mobile|Android|iPhone|iPad|Windows Phone/i;
  const tablet = /iPad|Android(?=.*\bMobile\b)(?=.*\bSafari\b)/i;
  
  if (tablet.test(userAgent)) return 'tablet';
  if (mobile.test(userAgent)) return 'mobile';
  return 'desktop';
}

// Fonction pour détecter le navigateur
function detectBrowser(userAgent) {
  if (!userAgent) return 'unknown';
  
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) return 'Safari';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  
  return 'unknown';
}

// Fonction pour détecter l'OS
function detectOS(userAgent) {
  if (!userAgent) return 'unknown';
  
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  
  return 'unknown';
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      pageUrl, 
      pageTitle, 
      sessionId, 
      screenResolution, 
      language,
      utmSource,
      utmMedium,
      utmCampaign,
      utmTerm,
      utmContent
    } = body;

    // Obtenir l'IP du visiteur
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
    
    const userAgent = request.headers.get('user-agent');
    const referrer = request.headers.get('referer');

    // Obtenir la géolocalisation
    const geoData = await getGeoLocation(ip);

    // Détecter les informations techniques
    const deviceType = detectDeviceType(userAgent);
    const browser = detectBrowser(userAgent);
    const os = detectOS(userAgent);

    // Vérifier si c'est un visiteur de retour
    const existingVisitor = await prisma.visitor.findFirst({
      where: {
        ipAddress: ip,
        sessionId: sessionId
      }
    });

    let visitor;
    
    if (existingVisitor) {
      // Mettre à jour le visiteur existant
      visitor = await prisma.visitor.update({
        where: { id: existingVisitor.id },
        data: {
          lastActivity: new Date(),
          isReturning: true,
          bounceRate: false
        }
      });
    } else {
      // Créer un nouveau visiteur
      visitor = await prisma.visitor.create({
        data: {
          ipAddress: ip,
          userAgent,
          referrer,
          pageUrl,
          sessionId,
          country: geoData.country,
          city: geoData.city,
          region: geoData.region,
          timezone: geoData.timezone,
          deviceType,
          browser,
          os,
          screenResolution,
          language,
          utmSource,
          utmMedium,
          utmCampaign,
          utmTerm,
          utmContent
        }
      });
    }

    // Créer une nouvelle page vue
    await prisma.pageView.create({
      data: {
        visitorId: visitor.id,
        pageUrl,
        pageTitle
      }
    });

    return NextResponse.json({ 
      success: true, 
      visitorId: visitor.id,
      isReturning: visitor.isReturning 
    });

  } catch (error) {
    console.error('Erreur tracking visiteur:', error);
    return NextResponse.json(
      { error: 'Erreur lors du tracking' },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 20;
    const skip = (page - 1) * limit;

    // Obtenir les visiteurs avec leurs statistiques
    const visitors = await prisma.visitor.findMany({
      include: {
        pageViews: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        _count: {
          select: { pageViews: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit
    });

    // Obtenir le total
    const total = await prisma.visitor.count();

    // Statistiques globales
    const stats = await prisma.visitor.aggregate({
      _count: { id: true },
      _avg: { visitDuration: true }
    });

    const uniqueVisitors = await prisma.visitor.groupBy({
      by: ['ipAddress'],
      _count: { id: true }
    });

    return NextResponse.json({
      visitors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: {
        totalVisitors: stats._count.id,
        uniqueVisitors: uniqueVisitors.length,
        avgVisitDuration: stats._avg.visitDuration
      }
    });

  } catch (error) {
    console.error('Erreur récupération visiteurs:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    );
  }
} 