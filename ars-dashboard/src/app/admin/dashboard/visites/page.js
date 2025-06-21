'use client';
import Link from 'next/link';
import { useEffect } from 'react';

// Ce composant représente le contenu de la page des visites/chantiers.
const VisitesModule = () => {
    // Données d'exemple basées sur prestation.html
    const chantiers = [
        { id: 1, name: "Chantier Grand Paris - Ligne 17", status: "En cours", responsable: "Alain Martin", progress: 60, nextMilestone: "Pose des voies section 3" },
        { id: 2, name: "Renouvellement Voie-Ballast (RVB) - Axe Atlantique", status: "Terminé", responsable: "Carole Dubois", progress: 100, nextMilestone: "Livré le 01/08/2024" },
        { id: 3, name: "Maintenance préventive - Dépôt de Lyon", status: "Planifié", responsable: "Marc Petit", progress: 10, nextMilestone: "Démarrage le 15/09/2024" },
        { id: 4, name: "Grutage et pose de caténaires - Nice", status: "En cours", responsable: "Sophie Lambert", progress: 85, nextMilestone: "Finalisation des tests" },
    ];

    const getStatusClass = (status) => {
        switch (status) {
            case 'En cours': return 'status-in-progress';
            case 'Terminé': return 'status-completed';
            case 'Planifié': return 'status-planned';
            default: return '';
        }
    };

    return (
        <>
            <style jsx>{`
                /* Styles spécifiques au module visites/chantiers */
                .chantiers-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                    gap: 20px;
                }
                .chantier-card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    padding: 25px;
                    display: flex;
                    flex-direction: column;
                }
                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 15px;
                }
                .card-title {
                    font-size: 1.4em;
                    font-weight: 600;
                    color: #fbbf24;
                    max-width: 80%;
                }
                .status-badge {
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-weight: 500;
                    font-size: 0.85em;
                    white-space: nowrap;
                }
                .status-in-progress { background-color: rgba(59, 130, 246, 0.2); color: #60a5fa; }
                .status-completed { background-color: rgba(74, 222, 128, 0.2); color: #4ade80; }
                .status-planned { background-color: rgba(156, 163, 175, 0.2); color: #9ca3af; }

                .card-body p {
                    opacity: 0.9;
                    margin-bottom: 10px;
                }
                .progress-container {
                    margin-top: auto; /* Pousse la barre de progression en bas */
                    padding-top: 15px;
                }
                 .progress-bar {
                    background: rgba(0,0,0,0.3);
                    border-radius: 8px;
                    height: 12px;
                    width: 100%;
                    overflow: hidden;
                }
                .progress-bar-fill {
                    height: 100%;
                    background: #fbbf24;
                }
                 .progress-label {
                    text-align: right;
                    font-size: 0.9em;
                    font-weight: 600;
                    margin-top: 5px;
                }
            `}</style>

            <div className="visites-header">
                <h1 style={{ fontSize: '3em', fontWeight: 700, color: '#fbbf24', marginBottom: '5px' }}>Gestion des Chantiers</h1>
                <p style={{ fontSize: '1.2em', opacity: 0.8 }}>Suivi de l'avancement, des responsables et des étapes clés des prestations.</p>
            </div>

            <div className="chantiers-grid" style={{ marginTop: '40px' }}>
                {chantiers.map(chantier => (
                    <div key={chantier.id} className="chantier-card">
                        <div className="card-header">
                            <h2 className="card-title">{chantier.name}</h2>
                            <span className={`status-badge ${getStatusClass(chantier.status)}`}>{chantier.status}</span>
                        </div>
                        <div className="card-body">
                            <p><strong>Responsable:</strong> {chantier.responsable}</p>
                            <p><strong>Prochaine étape:</strong> {chantier.nextMilestone}</p>
                        </div>
                         <div className="progress-container">
                            <div className="progress-bar">
                                <div className="progress-bar-fill" style={{ width: `${chantier.progress}%` }}></div>
                            </div>
                            <p className="progress-label">{chantier.progress}%</p>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default function VisitesPage() {
    useEffect(() => {
        document.title = 'Visites & Chantiers | Louna Rail TP';
    }, []);

    return (
        <div style={{ fontFamily: 'Manrope, sans-serif', background: '#0a0a0a', color: 'white', minHeight: '100vh', padding: '40px' }}>
             <div style={{ marginBottom: '40px', fontSize: '0.9em', opacity: 0.8 }}>
                <Link href="/dashboard" style={{ color: '#fbbf24', textDecoration: 'none' }}>
                    Tour de Contrôle
                </Link>
                <span style={{ margin: '0 10px' }}>/</span>
                <span>Visites & Chantiers</span>
            </div>
            <VisitesModule />
        </div>
    );
}