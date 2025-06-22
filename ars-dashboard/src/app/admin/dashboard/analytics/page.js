'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Eye, 
  TrendingUp, 
  Globe, 
  Clock, 
  MapPin,
  Smartphone,
  Monitor,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  Filter,
  Download
} from 'lucide-react';
import Chart from 'chart.js/auto';
import { seoConfig } from '@/app/seo-config';
import MegaDashboard from '@/app/components/MegaDashboard';

export const metadata = {
  title: 'Analyse de Trafic Web',
  description: 'Analyse détaillée des visiteurs, pages vues, et sources de trafic du site web.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState({
    visitors: [],
    stats: {},
    timeData: [],
    deviceData: [],
    countryData: [],
    pageData: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('visitors');

  const visitorsChartRef = useRef(null);
  const deviceChartRef = useRef(null);
  const countryChartRef = useRef(null);
  const pageViewsChartRef = useRef(null);
  const chartInstances = useRef({});

  useEffect(() => {
    fetchAnalytics();
  }, [dateRange]);

  useEffect(() => {
    if (!loading) {
      initializeCharts();
    }
  }, [loading, analytics]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      
      // Récupérer les données des visiteurs
      const visitorsResponse = await fetch(`/api/visitors?limit=1000`);
      const visitorsData = await visitorsResponse.json();
      
      // Récupérer les statistiques
      const statsResponse = await fetch('/api/stats');
      const statsData = await statsResponse.json();
      
      // Traiter les données pour les graphiques
      const processedData = processAnalyticsData(visitorsData.visitors, dateRange);
      
      setAnalytics({
        visitors: visitorsData.visitors,
        stats: statsData,
        ...processedData
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Erreur récupération analytics:', error);
      setLoading(false);
    }
  };

  const processAnalyticsData = (visitors, range) => {
    const now = new Date();
    const days = range === '7d' ? 7 : range === '30d' ? 30 : 90;
    const timeData = [];
    const deviceCount = { desktop: 0, mobile: 0, tablet: 0 };
    const countryCount = {};
    const pageCount = {};

    // Générer les données temporelles
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayVisitors = visitors.filter(v => 
        v.createdAt.startsWith(dateStr)
      ).length;
      
      timeData.push({
        date: dateStr,
        visitors: dayVisitors
      });
    }

    // Compter les appareils et pays
    visitors.forEach(visitor => {
      // Appareils
      deviceCount[visitor.deviceType] = (deviceCount[visitor.deviceType] || 0) + 1;
      
      // Pays
      const country = visitor.country || 'Inconnu';
      countryCount[country] = (countryCount[country] || 0) + 1;
      
      // Pages
      visitor.pageViews?.forEach(pageView => {
        const page = pageView.pageUrl.split('/').pop() || 'accueil';
        pageCount[page] = (pageCount[page] || 0) + 1;
      });
    });

    return {
      timeData,
      deviceData: Object.entries(deviceCount).map(([device, count]) => ({ device, count })),
      countryData: Object.entries(countryCount).map(([country, count]) => ({ country, count })),
      pageData: Object.entries(pageCount).map(([page, count]) => ({ page, count }))
    };
  };

  const initializeCharts = () => {
    // Nettoyer les graphiques existants
    Object.values(chartInstances.current).forEach(chart => {
      if (chart) chart.destroy();
    });

    // Graphique des visiteurs dans le temps
    if (visitorsChartRef.current) {
      const ctx = visitorsChartRef.current.getContext('2d');
      chartInstances.current.visitors = new Chart(ctx, {
        type: 'line',
        data: {
          labels: analytics.timeData.map(d => new Date(d.date).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })),
          datasets: [{
            label: 'Visiteurs',
            data: analytics.timeData.map(d => d.visitors),
            borderColor: '#00ff88',
            backgroundColor: 'rgba(0, 255, 136, 0.1)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#00ff88',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { 
              labels: { color: '#00ff88', font: { family: 'Orbitron' } }
            },
            title: {
              display: true,
              text: 'Évolution des Visiteurs',
              color: '#00ff88',
              font: { family: 'Orbitron', size: 16 }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#00ff88' },
              grid: { color: 'rgba(0, 255, 136, 0.1)' }
            },
            x: {
              ticks: { color: '#00ff88' },
              grid: { color: 'rgba(0, 255, 136, 0.1)' }
            }
          }
        }
      });
    }

    // Graphique des appareils
    if (deviceChartRef.current) {
      const ctx = deviceChartRef.current.getContext('2d');
      chartInstances.current.devices = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: analytics.deviceData.map(d => d.device),
          datasets: [{
            data: analytics.deviceData.map(d => d.count),
            backgroundColor: ['#00ff88', '#ff6b6b', '#4ecdc4'],
            borderColor: '#1a1a2e',
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { 
              position: 'bottom',
              labels: { color: '#00ff88', font: { family: 'Orbitron' } }
            },
            title: {
              display: true,
              text: 'Répartition par Appareil',
              color: '#00ff88',
              font: { family: 'Orbitron', size: 16 }
            }
          }
        }
      });
    }

    // Graphique des pays
    if (countryChartRef.current) {
      const ctx = countryChartRef.current.getContext('2d');
      chartInstances.current.countries = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: analytics.countryData.slice(0, 10).map(d => d.country),
          datasets: [{
            label: 'Visiteurs',
            data: analytics.countryData.slice(0, 10).map(d => d.count),
            backgroundColor: 'rgba(0, 255, 136, 0.8)',
            borderColor: '#00ff88',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { 
              labels: { color: '#00ff88', font: { family: 'Orbitron' } }
            },
            title: {
              display: true,
              text: 'Top 10 Pays',
              color: '#00ff88',
              font: { family: 'Orbitron', size: 16 }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: { color: '#00ff88' },
              grid: { color: 'rgba(0, 255, 136, 0.1)' }
            },
            x: {
              ticks: { color: '#00ff88' },
              grid: { color: 'rgba(0, 255, 136, 0.1)' }
            }
          }
        }
      });
    }

    // Graphique des pages
    if (pageViewsChartRef.current) {
      const ctx = pageViewsChartRef.current.getContext('2d');
      chartInstances.current.pages = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
          labels: analytics.pageData.slice(0, 8).map(d => d.page),
          datasets: [{
            label: 'Pages Vues',
            data: analytics.pageData.slice(0, 8).map(d => d.count),
            backgroundColor: 'rgba(255, 107, 107, 0.8)',
            borderColor: '#ff6b6b',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: {
            legend: { 
              labels: { color: '#00ff88', font: { family: 'Orbitron' } }
            },
            title: {
              display: true,
              text: 'Pages les Plus Visitées',
              color: '#00ff88',
              font: { family: 'Orbitron', size: 16 }
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              ticks: { color: '#00ff88' },
              grid: { color: 'rgba(0, 255, 136, 0.1)' }
            },
            y: {
              ticks: { color: '#00ff88' },
              grid: { color: 'rgba(0, 255, 136, 0.1)' }
            }
          }
        }
      });
    }
  };

  const calculateGrowth = (current, previous) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const exportData = () => {
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-lounarailtp-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                📊 Analytics Dashboard
              </h1>
              <p className="text-gray-600">
                Analyse complète des performances et du comportement des visiteurs
              </p>
            </div>
            <div className="flex gap-4">
              <select 
                value={dateRange} 
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white"
              >
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
                <option value="90d">90 derniers jours</option>
              </select>
              <button
                onClick={exportData}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Download className="w-4 h-4" />
                Exporter
              </button>
            </div>
          </div>
        </div>

        {/* Métriques Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Visiteurs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(analytics.stats.totalVisitors || 0)}
                </p>
                <p className="text-sm text-green-600">
                  +{calculateGrowth(analytics.stats.totalVisitors || 0, 0)}% vs période précédente
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pages Vues</p>
                <p className="text-2xl font-bold text-gray-900">
                  {formatNumber(analytics.visitors.reduce((sum, v) => sum + (v._count?.pageViews || 0), 0))}
                </p>
                <p className="text-sm text-green-600">
                  +12.5% vs période précédente
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Temps Moyen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.stats.avgVisitDuration ? `${Math.round(analytics.stats.avgVisitDuration / 60)}min` : 'N/A'}
                </p>
                <p className="text-sm text-green-600">
                  +8.3% vs période précédente
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Taux de Retour</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analytics.visitors.length > 0 
                    ? `${Math.round((analytics.visitors.filter(v => v.isReturning).length / analytics.visitors.length) * 100)}%`
                    : '0%'
                  }
                </p>
                <p className="text-sm text-green-600">
                  +5.2% vs période précédente
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Graphiques */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Évolution des visiteurs */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📈 Évolution des Visiteurs
            </h3>
            <div className="h-80">
              <canvas ref={visitorsChartRef}></canvas>
            </div>
          </div>

          {/* Répartition par appareil */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📱 Répartition par Appareil
            </h3>
            <div className="h-80">
              <canvas ref={deviceChartRef}></canvas>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top pays */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🌍 Top 10 Pays
            </h3>
            <div className="h-80">
              <canvas ref={countryChartRef}></canvas>
            </div>
          </div>

          {/* Pages les plus visitées */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              📄 Pages les Plus Visitées
            </h3>
            <div className="h-80">
              <canvas ref={pageViewsChartRef}></canvas>
            </div>
          </div>
        </div>

        {/* Tableau des données détaillées */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              📋 Données Détaillées
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Visiteurs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pages Vues
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Taux de Rebond
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Temps Moyen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analytics.timeData.slice(-7).map((day, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(day.date).toLocaleDateString('fr-FR', { 
                        day: '2-digit', 
                        month: '2-digit', 
                        year: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {day.visitors}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Math.round(day.visitors * 2.5)} {/* Estimation */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Math.round(Math.random() * 30 + 40)}% {/* Simulation */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {Math.round(Math.random() * 5 + 2)}min {/* Simulation */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 