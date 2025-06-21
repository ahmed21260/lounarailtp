const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// Liste des utilisateurs à migrer (ajoutez vos utilisateurs ici)
const usersToMigrate = [
    {
        email: 'lounarailtp@gmail.com',
        password: 'password123', // Changez par votre vrai mot de passe
        name: 'Admin Louna',
        role: 'ADMIN'
    },
    // Ajoutez d'autres utilisateurs si nécessaire
    // {
    //     email: 'autre@email.com',
    //     password: 'motdepasse',
    //     name: 'Autre Utilisateur',
    //     role: 'USER'
    // }
];

async function migrateUsers() {
    console.log('🚀 Début de la migration des utilisateurs...');
    
    for (const userData of usersToMigrate) {
        try {
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            
            const user = await prisma.user.upsert({
                where: { email: userData.email },
                update: {
                    password: hashedPassword,
                    name: userData.name,
                    role: userData.role,
                },
                create: {
                    email: userData.email,
                    password: hashedPassword,
                    name: userData.name,
                    role: userData.role,
                },
            });
            
            console.log(`✅ Utilisateur migré: ${user.email} (${user.role})`);
        } catch (error) {
            console.error(`❌ Erreur lors de la migration de ${userData.email}:`, error);
        }
    }
    
    console.log('🎉 Migration terminée !');
}

migrateUsers()
    .catch((e) => {
        console.error('Erreur lors de la migration:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    }); 