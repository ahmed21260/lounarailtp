// --- Fonctions d'authentification ---
function getToken() { return localStorage.getItem('jwt_token') || sessionStorage.getItem('jwt_token'); }

async function fetchWithAuth(url, options = {}) {
    const token = getToken();
    if (!token) { window.location.href = 'connexion.html'; return Promise.reject('No token'); }
    const headers = { ...options.headers, 'Authorization': `Bearer ${token}` };
    const response = await fetch(url, { ...options, headers });
    if (response.status === 401) { window.location.href = 'connexion.html'; return Promise.reject('Unauthorized'); }
    return response;
}

// --- Logique d'affichage ---
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetchWithAuth('/api/quiz-history');
        if (!response.ok) throw new Error('Failed to fetch history');
        
        const history = await response.json();
        
        if (history.length === 0) {
            displayEmptyState();
            return;
        }

        renderGlobalStats(history);
        renderCharts(history);
        renderHistoryList(history);
        
    } catch (error) {
        console.error("Erreur lors du chargement de l'historique:", error);
        displayErrorState();
    } finally {
        document.getElementById('loading-indicator').style.display = 'none';
    }
});

function renderGlobalStats(history) {
    const totalAttempts = history.length;
    const successfulAttempts = history.filter(h => h.passed).length;
    const successRate = totalAttempts > 0 ? Math.round((successfulAttempts / totalAttempts) * 100) : 0;
    const averageScore = totalAttempts > 0 ? Math.round(history.reduce((sum, h) => sum + h.score, 0) / totalAttempts) : 0;
    
    const statsContainer = document.getElementById('global-stats');
    statsContainer.innerHTML = `
        <div class="stat-card">
            <h3 class="text-gray-400 text-sm font-medium">Score Moyen</h3>
            <p class="text-3xl font-bold text-yellow-400">${averageScore}%</p>
        </div>
        <div class="stat-card">
            <h3 class="text-gray-400 text-sm font-medium">Taux de Réussite</h3>
            <p class="text-3xl font-bold text-green-400">${successRate}%</p>
        </div>
        <div class="stat-card">
            <h3 class="text-gray-400 text-sm font-medium">Quiz Tentés</h3>
            <p class="text-3xl font-bold text-white">${totalAttempts}</p>
        </div>
    `;
}

function renderCharts(history) {
    const chartsContainer = document.getElementById('charts-container');
    const groupedByQuiz = history.reduce((acc, h) => {
        acc[h.quiz_id] = acc[h.quiz_id] || [];
        acc[h.quiz_id].push(h);
        return acc;
    }, {});

    if (Object.keys(groupedByQuiz).length === 0) {
        chartsContainer.innerHTML = '<p class="text-gray-500 col-span-full text-center">Aucun graphique à afficher.</p>';
        return;
    }

    for (const quizId in groupedByQuiz) {
        const attempts = groupedByQuiz[quizId].sort((a, b) => new Date(a.attempt_date) - new Date(b.attempt_date));
        const quizInfo = db.quizzes.find(q => q._id === quizId);
        const quizTitle = quizInfo ? quizInfo.title : quizId;

        const chartWrapper = document.createElement('div');
        chartWrapper.className = 'chart-container';
        const canvas = document.createElement('canvas');
        chartWrapper.appendChild(canvas);
        chartsContainer.appendChild(chartWrapper);

        new Chart(canvas, {
            type: 'line',
            data: {
                labels: attempts.map(a => new Date(a.attempt_date)),
                datasets: [{
                    label: 'Score',
                    data: attempts.map(a => a.score),
                    borderColor: '#facc15',
                    backgroundColor: 'rgba(250, 204, 21, 0.2)',
                    fill: true,
                    tension: 0.2
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: { display: true, text: quizTitle, color: '#e5e7eb', font: { size: 16 } },
                    legend: { display: false }
                },
                scales: {
                    y: { min: 0, max: 100, ticks: { color: '#9ca3af' } },
                    x: { 
                        type: 'time',
                        time: { unit: 'day', displayFormats: { day: 'dd/MM/yy' } },
                        ticks: { color: '#9ca3af' }
                    }
                }
            }
        });
    }
}

function renderHistoryList(history) {
    const historyContainer = document.getElementById('history-container');
    const recentHistory = history.slice(0, 10); // 10 derniers
    
    if (recentHistory.length === 0) {
        historyContainer.innerHTML = '<p class="text-gray-500 text-center">Aucun historique de tentative.</p>';
        return;
    }

    historyContainer.innerHTML = recentHistory.map(h => {
        const quizInfo = db.quizzes.find(q => q._id === h.quiz_id);
        const quizTitle = quizInfo ? quizInfo.title : h.quiz_id;
        const formattedDate = new Date(h.attempt_date).toLocaleString('fr-FR');
        return `
            <div class="history-item flex justify-between items-center py-3 px-2">
                <div>
                    <p class="font-semibold text-white">${quizTitle}</p>
                    <p class="text-sm text-gray-400">${formattedDate}</p>
                </div>
                <div class="text-right">
                     <span class="font-bold text-lg ${h.passed ? 'text-green-400' : 'text-red-400'}">${h.score}%</span>
                     <p class="text-xs ${h.passed ? 'text-green-500' : 'text-red-500'}">${h.passed ? 'Réussi' : 'Échoué'}</p>
                </div>
            </div>
        `;
    }).join('');
}

function displayEmptyState() {
    document.querySelector('main').innerHTML = `
        <div class="text-center py-16">
            <h2 class="text-3xl font-bold text-yellow-400 mb-4">Commencez votre parcours !</h2>
            <p class="text-gray-400 mb-8">Vous n'avez pas encore tenté de quiz. Lancez-vous pour voir votre progression ici.</p>
            <a href="quiz-selection.html" class="px-6 py-3 bg-yellow-400 text-black font-semibold rounded-lg hover:bg-yellow-300 transition-colors">
                Choisir un Quiz
            </a>
        </div>
    `;
}

function displayErrorState() {
    document.querySelector('main').innerHTML = `
         <div class="text-center py-16">
            <h2 class="text-3xl font-bold text-red-500 mb-4">Erreur de chargement</h2>
            <p class="text-gray-400">Nous n'avons pas pu charger votre historique. Veuillez réessayer plus tard.</p>
        </div>
    `;
} 