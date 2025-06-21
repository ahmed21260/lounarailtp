'use client';
import { useState, useEffect } from 'react';

// Ce composant représente le contenu de la page de maintenance.
const MaintenanceModule = () => {
    // États pour simuler la réactivité
    const [apiStatus, setApiStatus] = useState({ status: 'unknown', message: 'API Backend' });
    const [errorLog, setErrorLog] = useState([]);

    const handleTestApi = async () => {
        setApiStatus({ status: 'running', message: 'Test en cours...' });
        try {
            // Simule un appel API, remplacez par votre vrai endpoint si besoin
            const response = await fetch('/api/index');
            if (!response.ok) throw new Error(`Erreur HTTP: ${response.status}`);
            const data = await response.json();
            // Supposons que l'API renvoie { status: 'OK' }
            setApiStatus({ status: 'ok', message: 'API et Base de données OK' });
        } catch (error) {
            setApiStatus({ status: 'error', message: 'API Inaccessible' });
            logError('Erreur de test API', error.message);
        }
    };

    const logError = (title, message) => {
        const newError = {
            title,
            message,
            timestamp: new Date().toLocaleString()
        };
        setErrorLog(currentLog => [newError, ...currentLog]);
    };

    const StatusIndicator = ({ status, message }) => {
        const statusClasses = {
            unknown: 'bg-gray-500',
            running: 'bg-blue-500 animate-pulse',
            ok: 'bg-green-500',
            error: 'bg-red-500',
        };
        return (
            <li className="flex items-center">
                <span className={`w-3 h-3 mr-3 rounded-full ${statusClasses[status]}`}></span>
                {message}
            </li>
        );
    };

    return (
        <>
            <style jsx>{`
                .grid-maintenance {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 20px;
                }
                .maintenance-card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    padding: 25px;
                }
                .card-title {
                    font-size: 1.5em;
                    font-weight: 600;
                    margin-bottom: 20px;
                    padding-bottom: 10px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
            `}</style>
            
            <div className="maintenance-header">
                 <h1 style={{ fontSize: '3em', fontWeight: 700, color: '#fbbf24', marginBottom: '5px' }}>Pack Maintenance AURA</h1>
                <p style={{ fontSize: '1.2em', opacity: 0.8 }}>Outils de diagnostic et actions rapides pour le système.</p>
            </div>

            <div className="grid-maintenance mt-10">
                {/* STATUT DU SYSTÈME */}
                <div className="maintenance-card">
                    <h2 className="card-title text-yellow-400">Statut du Système</h2>
                    <ul className="space-y-4">
                        <StatusIndicator status={apiStatus.status} message={apiStatus.message} />
                        {/* Remplacez par vos vrais tests de config si nécessaire */}
                        <StatusIndicator status="ok" message="Configuration Frontend chargée" />
                         <StatusIndicator status="ok" message="Variables d'environnement OK" />
                    </ul>
                     <button onClick={handleTestApi} className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition">
                        Lancer le test de connexion
                    </button>
                </div>

                {/* ACTIONS RAPIDES */}
                 <div className="maintenance-card">
                    <h2 className="card-title text-yellow-400">Actions Rapides</h2>
                    <div className="flex flex-col space-y-3">
                        <button onClick={() => alert("Fonctionnalité de backup à implémenter.")} className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-2 px-4 rounded transition">Sauvegarder la configuration</button>
                        <button onClick={() => setErrorLog([])} className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded transition">Effacer les logs d'erreurs</button>
                    </div>
                </div>

                {/* JOURNAL DES ERREURS */}
                <div className="maintenance-card md:col-span-2 lg:col-span-3">
                    <h2 className="card-title text-yellow-400">Journal des Erreurs</h2>
                    <div className="h-64 overflow-y-auto bg-black/50 rounded p-4 text-xs font-mono">
                        {errorLog.length === 0 ? (
                            <p className="text-gray-400">Aucune erreur détectée.</p>
                        ) : (
                            errorLog.map((err, index) => (
                                <div key={index} className="p-2 border-b border-gray-700">
                                    <p className="text-red-400 font-semibold">{err.title}</p>
                                    <p className="text-gray-300">{err.message}</p>
                                    <p className="text-gray-500 text-xs">{err.timestamp}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MaintenanceModule; 