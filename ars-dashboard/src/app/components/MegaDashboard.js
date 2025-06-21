'use client';

import React, { useState, useEffect, useRef } from 'react';
import { signOut } from 'next-auth/react';
import Chart from 'chart.js/auto';
import './MegaDashboard.css'; // Importation du CSS

const MegaDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({
        userCount: 0,
        projectCount: 0,
        complianceRate: 0,
        ytdSales: 0,
        users: [], // Initialiser avec un tableau vide
    });

    const caChartRef = useRef(null);
    const sectorsChartRef = useRef(null);
    const chartInstances = useRef({});

    useEffect(() => {
        // --- Appel API pour les statistiques ---
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/stats');
                if (!response.ok) {
                    throw new Error('La réponse du réseau n\'était pas bonne');
                }
                const data = await response.json();
                setStats(prevStats => ({...prevStats, ...data}));
            } catch (error) {
                console.error("Erreur lors de la récupération des statistiques:", error);
            }
        };

        fetchStats();

        // --- Initialisation des graphiques ---
        const cleanupCharts = () => {
            if (chartInstances.current.ca) chartInstances.current.ca.destroy();
            if (chartInstances.current.sectors) chartInstances.current.sectors.destroy();
        };

        cleanupCharts();

        if (caChartRef.current) {
            const caCtx = caChartRef.current.getContext('2d');
            chartInstances.current.ca = new Chart(caCtx, {
                 type: 'line',
                data: {
                    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
                    datasets: [{
                        label: 'CA Mensuel (k€)',
                        data: [180, 190, 210, 195, 220, 240, 230, 245, 260, 250, 270, 240],
                        borderColor: '#00ff88',
                        backgroundColor: 'rgba(0, 255, 136, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { labels: { color: '#00ff88' } } },
                    scales: {
                        y: { ticks: { color: '#00ff88' }, grid: { color: 'rgba(0, 255, 136, 0.1)' } },
                        x: { ticks: { color: '#00ff88' }, grid: { color: 'rgba(0, 255, 136, 0.1)' } }
                    }
                }
            });
        }

        if (sectorsChartRef.current) {
            const sectorsCtx = sectorsChartRef.current.getContext('2d');
            chartInstances.current.sectors = new Chart(sectorsCtx, {
                 type: 'radar',
                data: {
                    labels: ['Prestations', 'Formations', 'Location', 'Maintenance', 'Conseil', 'Innovation'],
                    datasets: [{
                        label: 'Performance 2024',
                        data: [95, 88, 92, 85, 78, 82],
                        borderColor: '#00ff88',
                        backgroundColor: 'rgba(0, 255, 136, 0.2)',
                        pointBackgroundColor: '#00ff88',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#00ff88'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { labels: { color: '#00ff88' } } },
                    scales: {
                        r: {
                            ticks: { color: '#00ff88', backdropColor: 'transparent' },
                            grid: { color: 'rgba(0, 255, 136, 0.1)' },
                            pointLabels: { color: '#00ff88' }
                        }
                    }
                }
            });
        }
        
        return cleanupCharts;
    }, []);

    const kpiData = [
        { title: "Chiffre d'Affaires (YTD)", value: `${(stats.ytdSales / 1000).toFixed(1)}k €`, trend: "+15.2%", positive: true },
        { title: "Formations Actives", value: stats.projectCount, trend: "Voir", positive: true },
        { title: "Taux de Conformité Sécurité", value: `${stats.complianceRate}%`, trend: "-0.1%", positive: false },
        { title: "Total Inscrits", value: stats.userCount, trend: "Nouveaux", positive: true },
    ];
    
    const projectData = [
        { id: 'GP-2025', name: 'Grand Paris Express', client: 'SNCF Réseau', budget: '1.2M €', status: 'active' },
        { id: 'LGV-SUD', name: 'LGV Sud-Ouest', client: 'Eiffage Rail', budget: '850k €', status: 'active' },
        { id: 'MNT-A302', name: 'Pelle A-302', client: 'Interne', budget: '50k €', status: 'maintenance' },
        { id: 'R-NORD', name: 'Régénération Nord', client: 'Colas Rail', budget: '600k €', status: 'active' },
        { id: 'HUB-LYON', name: 'Hub Multimodal Lyon', client: 'Vinci Construction', budget: '1.5M €', status: 'offline' },
    ];

    const TabButton = ({ id, title }) => (
        <button
            className={`nav-tab ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
        >
            {title}
        </button>
    );

    return (
        <div className="mega-dashboard-container">
            <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="logout-btn">
                Déconnexion
            </button>
            <div className="header">
                <h1>MEGA DASHBOARD EXECUTIVE</h1>
                <p>Analyse Stratégique & Performance Globale - Louna Rail TP</p>
            </div>
            
            <nav className="nav-tabs">
                <TabButton id="overview" title="Vue d'Ensemble" />
                <TabButton id="finance" title="Finances" />
                <TabButton id="operations" title="Opérations" />
            </nav>

            <main>
                <div id="overview" className={`tab-content ${activeTab === 'overview' ? 'active' : ''}`}>
                    <div className="kpi-grid">
                        {kpiData.map(kpi => (
                            <div key={kpi.title} className="kpi-card">
                                <h3 className="kpi-title">{kpi.title}</h3>
                                <p className="kpi-value">{kpi.value}</p>
                                <div className={`kpi-trend ${kpi.positive ? 'positive' : 'negative'}`}>
                                    <svg fill="currentColor" viewBox="0 0 20 20">
                                        {kpi.positive ? <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L6.22 8.22a.75.75 0 01-1.06-1.06l4.25-4.25a.75.75 0 011.06 0l4.25 4.25a.75.75 0 01-1.06 1.06L10.75 5.612V16.25A.75.75 0 0110 17z" clipRule="evenodd" /> : <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.03-2.618a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0l-4.25-4.25a.75.75 0 111.06-1.06l3.03 2.618V3.75A.75.75 0 0110 3z" clipRule="evenodd" />}
                                    </svg>
                                    <span>{kpi.trend}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="charts-grid">
                        <div className="chart-container">
                            <h3>Performance par Secteur</h3>
                            <div className="h-96"><canvas ref={sectorsChartRef}></canvas></div>
                        </div>
                        <div className="chart-container">
                             <h3>Chiffre d'Affaires (k€)</h3>
                             <div className="h-96"><canvas ref={caChartRef}></canvas></div>
                        </div>
                    </div>
                </div>

                <div id="finance" className={`tab-content ${activeTab === 'finance' ? 'active' : ''}`}>
                    <div className="data-table-container">
                        <h3>Détails Financiers (Prochainement)</h3>
                    </div>
                </div>

                <div id="operations" className={`tab-content ${activeTab === 'operations' ? 'active' : ''}`}>
                     <div className="data-table-container">
                        <h3>Liste des Utilisateurs Inscrits</h3>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Email</th>
                                    <th>Rôle</th>
                                    <th>Date d'inscription</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.users.length > 0 ? (
                                    stats.users.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.name || 'N/A'}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`status-badge ${user.role === 'ADMIN' ? 'status-active' : 'status-maintenance'}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>Chargement des utilisateurs...</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MegaDashboard; 