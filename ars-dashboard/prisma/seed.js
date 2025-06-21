const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const fs = require('fs');

const prisma = new PrismaClient();

// Charger les variables d'environnement depuis config_surveillance.env
const envConfig = dotenv.parse(fs.readFileSync('../config_surveillance.env'));

const email = envConfig.SENDER_EMAIL || 'admin@louna.com';
const password = envConfig.SENDER_PASSWORD || 'password123';
const name = 'Admin Louna';

async function main() {
  const hashedPassword = await bcrypt.hash(password, 10);

  // Upsert pour éviter les doublons
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      name,
      role: 'ADMIN',
    },
    create: {
      email,
      password: hashedPassword,
      name,
      role: 'ADMIN',
    },
  });

  console.log(`Admin user ready: ${user.email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 