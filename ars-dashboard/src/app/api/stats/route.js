import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Nombre total d'utilisateurs
    const userCount = await prisma.user.count();
    
    // Liste des utilisateurs
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    // Projets Actifs (on compte les formations comme des projets)
    const projectCount = await prisma.formation.count();

    // Chiffre d'affaires (somme des prix des formations pour chaque inscription)
    const inscriptions = await prisma.inscription.findMany({
        include: {
            formation: true,
        }
    });
    const ytdSales = inscriptions.reduce((sum, inscription) => sum + inscription.formation.price, 0);

    // Taux de conformité (statique pour l'instant)
    const complianceRate = 99.8; 

    return NextResponse.json({ 
        userCount,
        users,
        projectCount,
        ytdSales,
        complianceRate,
    });

  } catch (error) {
    console.error("Erreur API Stats:", error);
    return new NextResponse(
      JSON.stringify({ message: "Impossible de récupérer les statistiques.", error: error.message }),
      { status: 500 }
    );
  }
} 