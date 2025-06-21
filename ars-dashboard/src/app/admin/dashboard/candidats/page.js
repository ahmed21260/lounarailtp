'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';

// Le Modal pour ajouter un candidat
const AddCandidatModal = ({ onClose, onAddCandidat }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const newCandidat = {
            id: Date.now(), // ID simple pour l'exemple
            name: formData.get('name'),
            formation: formData.get('formation'),
            status: 'Nouveau',
            progress: 10,
            lastActivity: "Aujourd'hui"
        };
        onAddCandidat(newCandidat);
        onClose();
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#1f2937', padding: '30px', borderRadius: '16px', width: '400px', border: '1px solid #fbbf24' }}>
                <h2 style={{ fontSize: '1.8em', color: '#fbbf24', marginBottom: '20px' }}>Ajouter un Candidat</h2>
                <form onSubmit={handleSubmit}>
                    {/* ... (champs du formulaire) ... */}
                    <button type="submit" style={{ /* ... styles ... */ }}>Ajouter</button>
                    <button type="button" onClick={onClose} style={{ /* ... styles ... */ }}>Annuler</button>
                </form>
            </div>
        </div>
    );
};


// Ce composant représente le contenu de la page des candidats.
const CandidatsModule = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [candidats, setCandidats] = useState([
        { id: 1, name: "Jean Dupont", formation: "CACES R482", status: "En cours", progress: 75, lastActivity: "Hier" },
        { id: 2, name: "Marie Curie", formation: "Habilitation Électrique", status: "Terminé", progress: 100, lastActivity: "02/08/2024" },
        { id: 3, name: "Paul Martin", formation: "Pelles Rail-Route", status: "Nouveau", progress: 10, lastActivity: "Aujourd'hui" },
        { id: 4, name: "Sophie Leroy", formation: "CACES R482", status: "En attente", progress: 0, lastActivity: "28/07/2024" },
        { id: 5, name: "Luc Durand", formation: "Maintenance préventive", status: "Terminé", progress: 100, lastActivity: "25/07/2024" },
    ]);

    const handleAddCandidat = (newCandidat) => {
        setCandidats(currentCandidats => [newCandidat, ...currentCandidats]);
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'En cours': return 'status-in-progress';
            case 'Terminé': return 'status-completed';
            case 'Nouveau': return 'status-new';
            case 'En attente': return 'status-pending';
            default: return '';
        }
    };

    return (
        <>
            <style jsx>{`
                /* Styles spécifiques au module candidats */
                .candidats-table {
                    width: 100%;
                    border-collapse: collapse;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    overflow: hidden;
                }
                .candidats-table th, .candidats-table td {
                    padding: 15px 20px;
                    text-align: left;
                }
                .candidats-table th {
                    background-color: rgba(255, 255, 255, 0.1);
                    color: #fbbf24;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .candidats-table tbody tr {
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                .candidats-table tbody tr:last-child {
                    border-bottom: none;
                }
                .candidats-table tbody tr:hover {
                    background-color: rgba(251, 191, 36, 0.1);
                }
                .status-badge {
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 0.85em;
                    font-weight: 500;
                    display: inline-block;
                }
                .status-in-progress { background-color: rgba(59, 130, 246, 0.2); color: #60a5fa; }
                .status-completed { background-color: rgba(74, 222, 128, 0.2); color: #4ade80; }
                .status-new { background-color: rgba(251, 191, 36, 0.2); color: #fbbf24; }
                .status-pending { background-color: rgba(156, 163, 175, 0.2); color: #9ca3af; }
                
                .progress-bar {
                    background: rgba(0,0,0,0.3);
                    border-radius: 8px;
                    height: 8px;
                    width: 100%;
                    overflow: hidden;
                }
                .progress-bar-fill {
                    height: 100%;
                    background: #fbbf24;
                }
            `}</style>

            {isModalOpen && <AddCandidatModal onClose={() => setIsModalOpen(false)} onAddCandidat={handleAddCandidat} />}

            <div className="candidats-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '3em', fontWeight: 700, color: '#fbbf24', marginBottom: '5px' }}>Suivi des Candidats</h1>
                    <p style={{ fontSize: '1.2em', opacity: 0.8 }}>Visualisez et gérez la progression de tous les candidats.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} style={{ background: '#fbbf24', color: '#111827', fontWeight: 'bold', padding: '12px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>
                    Ajouter un Candidat
                </button>
            </div>

            <div className="candidats-table-container" style={{ marginTop: '40px' }}>
                <table className="candidats-table">
                    <thead>
                        <tr>
                            <th>Nom du Candidat</th>
                            <th>Formation</th>
                            <th>Statut</th>
                            <th>Progression</th>
                            <th>Dernière Activité</th>
                        </tr>
                    </thead>
                    <tbody>
                        {candidats.map(candidat => (
                            <tr key={candidat.id}>
                                <td>{candidat.name}</td>
                                <td>{candidat.formation}</td>
                                <td><span className={`status-badge ${getStatusClass(candidat.status)}`}>{candidat.status}</span></td>
                                <td>
                                    <div className="progress-bar">
                                        <div className="progress-bar-fill" style={{ width: `${candidat.progress}%` }}></div>
                                    </div>
                                </td>
                                <td>{candidat.lastActivity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default function CandidatsPage() {
    useEffect(() => {
        document.title = 'Candidats | Louna Rail TP';
    }, []);

    return (
        <div style={{ fontFamily: 'Manrope, sans-serif', background: '#0a0a0a', color: 'white', minHeight: '100vh', padding: '40px' }}>
            <div style={{ marginBottom: '40px', fontSize: '0.9em', opacity: 0.8 }}>
                <Link href="/dashboard" style={{ color: '#fbbf24', textDecoration: 'none' }}>
                    Tour de Contrôle
                </Link>
                <span style={{ margin: '0 10px' }}>/</span>
                <span>Candidats</span>
            </div>
            <CandidatsModule />
        </div>
    );
} 