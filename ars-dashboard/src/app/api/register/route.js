import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Tous les champs sont requis' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Cet utilisateur existe déjà' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER', // Rôle par défaut pour les nouveaux inscrits
      },
    });

    // --- Envoi de l'email de bienvenue ---
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_SERVER,
        port: parseInt(process.env.SMTP_PORT, 10),
        secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASSWORD,
        },
    });

    await transporter.sendMail({
        from: `"Louna Rail TP" <${process.env.SENDER_EMAIL}>`,
        to: email,
        subject: 'Bienvenue chez Louna Rail TP !',
        html: `
            <h1>Bonjour ${name},</h1>
            <p>Nous vous souhaitons la bienvenue ! Votre inscription sur la plateforme Louna Rail TP a bien été enregistrée.</p>
            <p>Vous pouvez dès à présent explorer nos formations et nos services.</p>
            <p>À très bientôt,</p>
            <p><strong>L'équipe Louna Rail TP</strong></p>
        `,
    });
    
    return NextResponse.json({ message: 'Inscription réussie', user: { id: newUser.id, name: newUser.name, email: newUser.email } }, { status: 201 });

  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    return NextResponse.json({ message: 'Erreur interne du serveur' }, { status: 500 });
  }
} 