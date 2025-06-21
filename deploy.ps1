# Script de déploiement Vercel pour Louna Rail TP
Write-Host "🚀 Déploiement Vercel - Louna Rail TP" -ForegroundColor Green

# Vérifier si Vercel CLI est installé
try {
    $vercelVersion = vercel --version
    Write-Host "✅ Vercel CLI détecté: $vercelVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Vercel CLI non trouvé. Installation..." -ForegroundColor Red
    npm install -g vercel
}

# Vérifier les fichiers nécessaires
$requiredFiles = @("vercel.json", "requirements.txt", "api/index.py", "server.py")
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ $file trouvé" -ForegroundColor Green
    } else {
        Write-Host "❌ $file manquant" -ForegroundColor Red
        exit 1
    }
}

# Vérifier si l'utilisateur est connecté à Vercel
Write-Host "🔐 Vérification de la connexion Vercel..." -ForegroundColor Yellow
vercel whoami

# Déploiement
Write-Host "📤 Déploiement en cours..." -ForegroundColor Yellow
vercel --prod

Write-Host "🎉 Déploiement terminé!" -ForegroundColor Green
Write-Host "📋 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "   1. Configurer les variables d'environnement dans Vercel Dashboard"
Write-Host "   2. Ajouter le domaine personnalisé lounarailtp.com"
Write-Host "   3. Tester toutes les fonctionnalités" 