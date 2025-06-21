'use client';
import Link from 'next/link';
import { useEffect } from 'react';

// Ce composant représente le contenu de la page de sécurité.
const SecuriteModule = () => {
    // Données d'exemple basées sur securite-ferroviaire.html
    const kpis = [
        { label: "Jours sans accident", value: "365", trend: "+5%" },
        { label: "Audits de sécurité (Mois)", value: "12", trend: "0%" },
        { label: "Taux de conformité EPI", value: "99.2%", trend: "+0.2%" },
        { label: "Incidents signalés", value: "3", trend: "-25%" },
    ];

    const checklist = [
        { item: "Briefing de sécurité quotidien", status: "OK" },
        { item: "Vérification des EPI", status: "OK" },
        { item: "Contrôle des permis de travail", status: "OK" },
        { item: "Inspection des équipements", status: "Action Requise" },
        { item: "Signalisation des zones de travail", status: "OK" },
    ];

    return (
        <>
            <style jsx>{`
                /* Styles spécifiques au module sécurité */
                .kpi-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 40px;
                }
                .kpi-card {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    padding: 20px;
                    text-align: center;
                }
                .kpi-value {
                    font-size: 2.5em;
                    font-weight: 700;
                    color: #fbbf24;
                }
                .kpi-label {
                    font-size: 1em;
                    opacity: 0.8;
                    margin-bottom: 5px;
                }
                .kpi-trend {
                    font-size: 0.9em;
                    font-weight: 500;
                    color: #4ade80; /* Vert pour tendance positive */
                }
                .kpi-trend.negative {
                    color: #f87171; /* Rouge pour tendance négative */
                }

                .checklist-container {
                     background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    padding: 25px;
                }
                .checklist-title {
                    font-size: 1.8em;
                    font-weight: 600;
                    margin-bottom: 20px;
                }
                .checklist-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 0;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }
                 .checklist-item:last-child {
                    border-bottom: none;
                }
                .status-badge {
                    padding: 5px 12px;
                    border-radius: 20px;
                    font-weight: 600;
                    font-size: 0.9em;
                }
                .status-ok {
                    background-color: rgba(74, 222, 128, 0.2);
                    color: #4ade80;
                }
                .status-action {
                    background-color: rgba(251, 146, 60, 0.2);
                    color: #fb923c;
                }
            `}</style>

            <div className="securite-header">
                <h1 style={{ fontSize: '3em', fontWeight: 700, color: '#fbbf24', marginBottom: '5px' }}>Module Sécurité</h1>
                <p style={{ fontSize: '1.2em', opacity: 0.8 }}>Indicateurs clés, checklist et protocoles en temps réel.</p>
            </div>

            <div className="kpi-grid">
                {kpis.map(kpi => (
                    <div key={kpi.label} className="kpi-card">
                        <p className="kpi-label">{kpi.label}</p>
                        <p className="kpi-value">{kpi.value}</p>
                        <p className={`kpi-trend ${kpi.trend.startsWith('-') ? 'negative' : ''}`}>{kpi.trend}</p>
                    </div>
                ))}
            </div>

            <div className="checklist-container">
                <h2 className="checklist-title">Checklist de Sécurité Quotidienne</h2>
                {checklist.map(item => (
                    <div key={item.item} className="checklist-item">
                        <span>{item.item}</span>
                        <span className={`status-badge ${item.status === 'OK' ? 'status-ok' : 'status-action'}`}>
                            {item.status}
                        </span>
                    </div>
                ))}
            </div>
        </>
    );
};

export default function SecuritePage() {
    useEffect(() => {
        document.title = 'Sécurité | Louna Rail TP';
    }, []);
    
    return (
        <div style={{ fontFamily: 'Manrope, sans-serif', background: '#0a0a0a', color: 'white', minHeight: '100vh', padding: '40px' }}>
             <div style={{ marginBottom: '40px', fontSize: '0.9em', opacity: 0.8 }}>
                <Link href="/dashboard" style={{ color: '#fbbf24', textDecoration: 'none' }}>
                    Tour de Contrôle
                </Link>
                <span style={{ margin: '0 10px' }}>/</span>
                <span>Sécurité</span>
            </div>
            <SecuriteModule />
        </div>
    );
}