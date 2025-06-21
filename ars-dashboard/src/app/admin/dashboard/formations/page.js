'use client';
import Link from 'next/link';
import { useEffect } from 'react';

// Ce composant représente le contenu de la page des formations.
const FormationsModule = () => {
    // Données d'exemple pour les formations
    const formations = [
        { id: 1, title: "CACES R482 - Engins de Chantier", category: "Certification", duration: "5 jours", nextSession: "15/08/2024", registered: 8, capacity: 12 },
        { id: 2, title: "Habilitation Électrique H0B0", category: "Sécurité", duration: "2 jours", nextSession: "22/08/2024", registered: 10, capacity: 10 },
        { id: 3, title: "Conduite de Pelles Rail-Route", category: "Spécialisation", duration: "10 jours", nextSession: "02/09/2024", registered: 5, capacity: 8 },
        { id: 4, title: "Maintenance préventive des voies", category: "Technique", duration: "3 jours", nextSession: "10/09/2024", registered: 11, capacity: 12 },
    ];

    return (
        <>
            <style jsx>{`
                .formations-header {
                    margin-bottom: 40px;
                }
                .formations-header h1 {
                    font-size: 3em;
                    font-weight: 700;
                    color: #fbbf24;
                    margin-bottom: 5px;
                }
                .formations-header p {
                    font-size: 1.2em;
                    opacity: 0.8;
                }
                .formations-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 20px;
                }
                .formation-card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    padding: 25px;
                    transition: transform 0.3s, box-shadow 0.3s;
                }
                .formation-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.2);
                }
                .card-title {
                    font-size: 1.5em;
                    font-weight: 600;
                    color: #fbbf24;
                    margin-bottom: 15px;
                }
                .card-details p {
                    margin-bottom: 10px;
                    opacity: 0.9;
                }
                .card-details strong {
                    color: #fff;
                    font-weight: 600;
                }
                .progress-bar {
                    background: rgba(0,0,0,0.3);
                    border-radius: 8px;
                    height: 20px;
                    width: 100%;
                    overflow: hidden;
                    margin-top: 15px;
                }
                .progress-bar-fill {
                    height: 100%;
                    background: #fbbf24;
                    border-radius: 8px;
                    text-align: center;
                    color: #111827;
                    font-weight: bold;
                    line-height: 20px;
                }
            `}</style>

            <div className="formations-header">
                <h1>Gestion des Formations</h1>
                <p>Suivez les sessions, les inscriptions et la performance des formations.</p>
            </div>

            <div className="formations-grid">
                {formations.map(formation => (
                    <div key={formation.id} className="formation-card">
                        <h2 className="card-title">{formation.title}</h2>
                        <div className="card-details">
                            <p><strong>Catégorie:</strong> {formation.category}</p>
                            <p><strong>Durée:</strong> {formation.duration}</p>
                            <p><strong>Prochaine Session:</strong> {formation.nextSession}</p>
                        </div>
                        <div>
                            <p>Inscrits : {formation.registered} / {formation.capacity}</p>
                            <div className="progress-bar">
                                <div 
                                    className="progress-bar-fill"
                                    style={{ width: `${(formation.registered / formation.capacity) * 100}%` }}
                                >
                                    {`${Math.round((formation.registered / formation.capacity) * 100)}%`}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

// La page principale qui utilise ce composant
export default function FormationsPage() {
    useEffect(() => {
        document.title = 'Formations | Louna Rail TP';
    }, []);

    return (
        <div style={{ fontFamily: 'Manrope, sans-serif', background: '#0a0a0a', color: 'white', minHeight: '100vh', padding: '40px' }}>
            {/* Fil d'ariane */}
            <div style={{ marginBottom: '40px', fontSize: '0.9em', opacity: 0.8 }}>
                <Link href="/dashboard" style={{ color: '#fbbf24', textDecoration: 'none' }}>
                    Tour de Contrôle
                </Link>
                <span style={{ margin: '0 10px' }}>/</span>
                <span>Formations</span>
            </div>
            
            <FormationsModule />
        </div>
    );
}
