// Test des notifications Telegram
// Usage: node test-notifications.js

const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000'; // Changé le port pour correspondre au serveur

async function testNotification(type, data) {
  try {
    console.log(`🧪 Test notification: ${type}`);
    
    const response = await fetch(`${BASE_URL}/api/notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: type,
        data: data,
        priority: type === 'security' ? 'high' : 'normal'
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ Notification ${type} envoyée avec succès`);
    } else {
      console.log(`❌ Erreur notification ${type}:`, result.message);
    }
    
    return result.success;
  } catch (error) {
    console.log(`❌ Erreur test ${type}:`, error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Démarrage des tests de notifications...\n');

  const tests = [
    {
      type: 'visitor',
      data: {
        country: 'France',
        city: 'Paris',
        page: '/test.html',
        device: 'Desktop',
        browser: 'Chrome',
        ip: '192.168.1.100'
      }
    },
    {
      type: 'security',
      data: {
        type: 'CLIC_DROIT',
        message: 'Test de clic droit',
        ip: '192.168.1.100',
        page: '/test.html'
      }
    },
    {
      type: 'form',
      data: {
        nom: 'Test User',
        email: 'test@example.com',
        telephone: '06 12 43 51 63',
        message: 'Ceci est un test de notification'
      }
    },
    {
      type: 'error',
      data: {
        type: 'API_ERROR',
        message: 'Test d\'erreur serveur',
        ip: '192.168.1.100'
      }
    }
  ];

  let successCount = 0;
  
  for (const test of tests) {
    const success = await testNotification(test.type, test.data);
    if (success) successCount++;
    
    // Pause entre les tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log(`\n📊 Résultats: ${successCount}/${tests.length} tests réussis`);
  
  if (successCount === tests.length) {
    console.log('🎉 Toutes les notifications fonctionnent parfaitement !');
  } else {
    console.log('⚠️ Certaines notifications ont échoué. Vérifie la configuration.');
  }
}

// Vérifier que le serveur est démarré
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL}/api/visitors`);
    if (response.ok) {
      console.log('✅ Serveur accessible');
      return true;
    }
  } catch (error) {
    console.log('❌ Serveur non accessible. Assure-toi qu\'il est démarré sur le bon port.');
    return false;
  }
}

// Main
async function main() {
  const serverOk = await checkServer();
  if (serverOk) {
    await runTests();
  }
}

main().catch(console.error); 