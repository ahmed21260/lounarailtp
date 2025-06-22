'use client';

import React, { useState, useEffect, useRef } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Chart from 'chart.js/auto';
import { BarChart, Compass, DollarSign, FileText, Globe, LifeBuoy, LogOut, Settings, Users, Video, ShieldCheck, UserCheck, Search, Activity, List, LayoutDashboard, LineChart } from 'lucide-react';
import './MegaDashboard.css';

const MegaDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [stats, setStats] = useState({ userCount: 0, projectCount: 0, complianceRate: 0, ytdSales: 0, users: [] });
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const renderContent = () => {
        switch (activeTab) {
            case 'overview': return <OverviewTab stats={stats} />;
            case 'analytics': return <AnalyticsTab />;
            case 'users': return <UsersTab users={stats.users} />;
            case 'surveillance': return <SurveillanceTab />;
            case 'security': return <SecurityLogsTab />;
            default: return <OverviewTab stats={stats} />;
        }
    };
    
    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            try {
                const response = await fetch('/api/stats');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setStats(prevStats => ({...prevStats, ...data}));
            } catch (error) {
                console.error("Error fetching stats:", error);
            }
            setLoading(false);
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="loading-container"> <div className="loader"></div> </div>;
    }

    return (
        <div className="dashboard-layout">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="dashboard-main">
                <Header router={router} />
                <div className="dashboard-content">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

const Sidebar = ({ activeTab, setActiveTab }) => {
    const router = useRouter();
    return (
        <aside className="dashboard-sidebar">
            <div className="sidebar-header">
                <Compass size={40} className="logo-icon" />
                <h2>LounaRailTP</h2>
            </div>
            <nav className="sidebar-nav">
                <p className="nav-category">ANALYSE</p>
                <NavItem icon={<LayoutDashboard size={20} />} label="Vue d'ensemble" id="overview" activeTab={activeTab} setActiveTab={setActiveTab} />
                <NavItem icon={<LineChart size={20} />} label="Analytics Web" id="analytics" activeTab={activeTab} setActiveTab={setActiveTab} />
                
                <p className="nav-category">GESTION</p>
                <NavItem icon={<Users size={20} />} label="Candidats" id="users" activeTab={activeTab} setActiveTab={setActiveTab} />
                <NavItem icon={<FileText size={20} />} label="Formations" onClick={() => router.push('/admin/dashboard/formations')} />
                <NavItem icon={<DollarSign size={20} />} label="Finances" id="finance" activeTab={activeTab} setActiveTab={setActiveTab} />

                <p className="nav-category">SÉCURITÉ</p>
                <NavItem icon={<ShieldCheck size={20} />} label="Surveillance" id="surveillance" activeTab={activeTab} setActiveTab={setActiveTab} />
                <NavItem icon={<Activity size={20} />} label="Logs Sécurité" id="security" activeTab={activeTab} setActiveTab={setActiveTab} />
            </nav>
            <div className="sidebar-footer">
                <button onClick={() => signOut({ callbackUrl: '/admin/login' })} className="logout-btn">
                    <LogOut size={20} />
                    <span>Déconnexion</span>
                </button>
                <small className="text-xs text-gray-400 text-center block mt-4">
                  Site surveillé & protégé par un système de suivi technique et anti-copie intelligent.
                </small>
            </div>
        </aside>
    );
};

const NavItem = ({ icon, label, id, activeTab, setActiveTab, onClick }) => (
    <button className={`nav-item ${activeTab === id ? 'active' : ''}`} onClick={onClick ? onClick : () => setActiveTab(id)}>
        {icon}
        <span>{label}</span>
    </button>
);

const Header = ({ router }) => (
    <header className="dashboard-header">
        <div className="search-bar">
            <Search size={20} />
            <input type="text" placeholder="Rechercher..." />
        </div>
        <div className="header-actions">
            <button className="action-btn"><Settings size={20} /></button>
            <button className="action-btn"><LifeBuoy size={20} /></button>
            <div className="user-profile">
                <img src="/images/dashboard/user-avatar.png" alt="Avatar de l'administrateur connecté" />
                <div className="user-info">
                    <span className="user-name">Admin User</span>
                    <span className="user-role">Administrateur</span>
                </div>
            </div>
        </div>
    </header>
);

const OverviewTab = ({ stats }) => {
    const kpiData = [
        { title: "Chiffre d'Affaires (YTD)", value: `${(stats.ytdSales / 1000).toFixed(1)}k €`, trend: "+15.2%", positive: true, icon: <DollarSign /> },
        { title: "Formations Actives", value: stats.projectCount, trend: "Voir", positive: true, icon: <FileText /> },
        { title: "Taux Conformité Sécurité", value: `${stats.complianceRate}%`, trend: "-0.1%", positive: false, icon: <ShieldCheck /> },
        { title: "Total Inscrits", value: stats.userCount, trend: "Nouveaux", positive: true, icon: <Users /> },
    ];
    
    return (
        <div className="tab-content-inner">
            <div className="kpi-grid">
                {kpiData.map((kpi, index) => <KpiCard key={index} {...kpi} />)}
            </div>
            <div className="charts-grid-overview">
                <ChartContainer title="Performance par Secteur" chartId="sectorsChart" type="radar" />
                <ChartContainer title="Chiffre d'Affaires (k€)" chartId="caChart" type="line" />
            </div>
        </div>
    );
};

const AnalyticsTab = () => {
    const [period, setPeriod] = useState('7d');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/analytics?period=${period}`);
                if (!response.ok) throw new Error('Failed to fetch analytics');
                const result = await response.json();
                setData(result);
            } catch (error) {
                console.error("Error fetching analytics:", error);
            }
            setLoading(false);
        };
        fetchAnalytics();
    }, [period]);

    if (loading) return <div className="loading-container"><div className="loader"></div></div>;
    if (!data) return <p>Erreur de chargement des données.</p>;

    const analyticsKpiData = [
        { title: "Visiteurs Totaux", value: data.stats.totalVisitors, trend: `${data.stats.growthRate}%`, positive: data.stats.growthRate >= 0, icon: <Users /> },
        { title: "Visiteurs Uniques", value: data.stats.uniqueVisitors, icon: <UserCheck /> },
        { title: "Pages Vues", value: data.stats.totalPageViews, icon: <FileText /> },
        { title: "Taux de Rebond", value: `${data.stats.bounceRate}%`, trend: "Objectif < 40%", positive: data.stats.bounceRate < 40, icon: <BarChart /> },
    ];

    return (
        <div className="tab-content-inner">
             <div className="analytics-header">
                <h2>Données du Site Web</h2>
                <div className="period-selector">
                    <button onClick={() => setPeriod('7d')} className={period === '7d' ? 'active' : ''}>7 Jours</button>
                    <button onClick={() => setPeriod('30d')} className={period === '30d' ? 'active' : ''}>30 Jours</button>
                    <button onClick={() => setPeriod('90d')} className={period === '90d' ? 'active' : ''}>90 Jours</button>
                </div>
            </div>
            <div className="kpi-grid">
                {analyticsKpiData.map((kpi, index) => <KpiCard key={index} {...kpi} />)}
            </div>
            <div className="charts-grid-analytics">
                <ChartContainer title="Évolution des Visiteurs" chartId="visitorsChart" type="line" chartData={data.chartData.visitors} period={period} />
                <ChartContainer title="Répartition par Pays" chartId="countriesChart" type="doughnut" chartData={data.chartData.countries} period={period} />
                <ChartContainer title="Pages les plus vues" chartId="pagesChart" type="bar" chartData={data.chartData.pages} period={period} />
                <ChartContainer title="Répartition par Appareil" chartId="devicesChart" type="pie" chartData={data.chartData.devices} period={period} />
            </div>
        </div>
    );
};

const UsersTab = ({ users }) => (
    <div className="tab-content-inner">
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
                    {users.length > 0 ? (
                        users.map(user => (
                            <tr key={user.id}>
                                <td>{user.name || 'N/A'}</td>
                                <td>{user.email}</td>
                                <td><span className="role-badge">{user.role}</span></td>
                                <td>{new Date(user.createdAt).toLocaleDateString('fr-FR')}</td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan="4">Aucun utilisateur trouvé</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    </div>
);

const SurveillanceTab = () => {
    const router = useRouter();
    return (
        <div className="tab-content-inner">
            <h2>Surveillance & Sécurité</h2>
            <p>Le module de surveillance est accessible via le menu latéral ou en cliquant sur le bouton ci-dessous.</p>
            <button className="action-button" onClick={() => router.push('/admin/dashboard/surveillance')}>
                Aller à la Surveillance
            </button>
        </div>
    );
};

const SecurityLogsTab = () => {
    const [logs, setLogs] = useState([]);
    const [pagination, setPagination] = useState({});
    const [loading, setLoading] = useState(true);

    const fetchLogs = async (page = 1) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/security-logs?page=${page}&limit=10`);
            if (!response.ok) throw new Error('Failed to fetch security logs');
            const data = await response.json();
            setLogs(data.logs);
            setPagination(data.pagination);
        } catch (error) {
            console.error("Error fetching security logs:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLogs(1);
    }, []);

    if (loading) return <div className="loading-container"><div className="loader"></div></div>;

    return (
        <div className="tab-content-inner">
            <div className="data-table-container">
                <h3>Journal des Événements de Sécurité</h3>
                <p className="text-sm text-gray-400 mb-4">Suivi des violations et des tentatives d'accès non autorisées.</p>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Type d'Événement</th>
                            <th>Message</th>
                            <th>Adresse IP</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length > 0 ? (
                            logs.map(log => (
                                <tr key={log.id}>
                                    <td><span className="role-badge error">{log.type}</span></td>
                                    <td>{log.message}</td>
                                    <td>{log.ipAddress}</td>
                                    <td>{new Date(log.createdAt).toLocaleString('fr-FR')}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4">Aucun log de sécurité trouvé.</td></tr>
                        )}
                    </tbody>
                </table>
                <div className="pagination-controls">
                    <button onClick={() => fetchLogs(pagination.page - 1)} disabled={pagination.page <= 1}>
                        Précédent
                    </button>
                    <span>Page {pagination.page} sur {pagination.totalPages}</span>
                    <button onClick={() => fetchLogs(pagination.page + 1)} disabled={pagination.page >= pagination.totalPages}>
                        Suivant
                    </button>
                </div>
            </div>
        </div>
    );
};

const KpiCard = ({ title, value, trend, positive, icon }) => (
    <div className="kpi-card">
        <div className="kpi-icon-wrapper">{icon}</div>
        <div className="kpi-details">
            <span className="kpi-title">{title}</span>
            <span className="kpi-value">{value}</span>
        </div>
        {trend && (
             <span className={`kpi-trend ${positive ? 'positive' : 'negative'}`}>{trend}</span>
        )}
    </div>
);

const ChartContainer = ({ title, chartId, type, chartData, period }) => {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            let config;
            // Configs pour les graphiques de l'overview
            if (chartId === 'sectorsChart') {
                config = getRadarChartConfig();
            } else if (chartId === 'caChart') {
                config = getLineChartConfig();
            }
            // Configs pour les graphiques analytics
            else if (chartData) {
                 if (type === 'line') config = getVisitorsChartConfig(chartData);
                 else if (type === 'doughnut') config = getCountriesChartConfig(chartData);
                 else if (type === 'bar') config = getPagesChartConfig(chartData);
                 else if (type === 'pie') config = getDevicesChartConfig(chartData);
            }

            if(config) {
                const ctx = chartRef.current.getContext('2d');
                chartInstance.current = new Chart(ctx, config);
            }
        }
        
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [chartData, period]); // Re-render if data or period changes

    return (
        <div className="chart-container">
            <h4>{title}</h4>
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

// --- Chart Configurations ---
// Ces fonctions génèrent les configurations pour Chart.js
const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
        y: { ticks: { color: '#6c757d' }, grid: { color: '#e9ecef' } },
        x: { ticks: { color: '#6c757d' }, grid: { display: false } }
    }
};

const getLineChartConfig = () => ({
    type: 'line',
    data: {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul'],
        datasets: [{
            label: 'CA Mensuel',
            data: [180, 190, 210, 195, 220, 240, 230],
            borderColor: '#4A90E2', backgroundColor: 'rgba(74, 144, 226, 0.1)',
            fill: true, tension: 0.4
        }]
    },
    options: commonOptions
});

const getRadarChartConfig = () => ({
    type: 'radar',
    data: {
        labels: ['Prestations', 'Formations', 'Location', 'Maintenance', 'Conseil'],
        datasets: [{
            label: 'Performance',
            data: [95, 88, 92, 85, 78],
            borderColor: '#4A90E2', backgroundColor: 'rgba(74, 144, 226, 0.2)'
        }]
    },
    options: { ...commonOptions, scales: { r: { pointLabels: { font: { size: 14 } }, ticks: { display: false } } } }
});

const getVisitorsChartConfig = (data) => ({
    type: 'line',
    data: {
        labels: data.map(d => new Date(d.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })),
        datasets: [
            { label: 'Visiteurs', data: data.map(d => d.visitors), borderColor: '#4A90E2', tension: 0.3, fill: true, backgroundColor: 'rgba(74, 144, 226, 0.1)' },
            { label: 'Uniques', data: data.map(d => d.uniqueVisitors), borderColor: '#50E3C2', tension: 0.3, fill: true, backgroundColor: 'rgba(80, 227, 194, 0.1)' }
        ]
    },
    options: { ...commonOptions, plugins: { legend: { display: true, position: 'top' } } }
});

const getCountriesChartConfig = (data) => ({
    type: 'doughnut',
    data: {
        labels: data.map(d => d.country),
        datasets: [{ data: data.map(d => d.visitors), backgroundColor: ['#4A90E2', '#50E3C2', '#F5A623', '#BD10E0', '#7ED321'] }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' } } }
});

const getPagesChartConfig = (data) => ({
    type: 'bar',
    data: {
        labels: data.map(d => (d.url.length > 20 ? '...' + d.url.slice(-17) : d.url)),
        datasets: [{ label: 'Vues', data: data.map(d => d.views), backgroundColor: '#50E3C2' }]
    },
    options: { ...commonOptions, indexAxis: 'y' }
});

const getDevicesChartConfig = (data) => ({
    type: 'pie',
    data: {
        labels: data.map(d => d.device),
        datasets: [{ data: data.map(d => d.visitors), backgroundColor: ['#4A90E2', '#50E3C2', '#F5A623'] }]
    },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
});

export default MegaDashboard; 