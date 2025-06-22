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
import { seoConfig } from '../../../seo-config';
import MegaDashboard from '../../../components/MegaDashboard';

export default function AnalyticsClient() {
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
      
      const visitorsResponse = await fetch(`/api/visitors?limit=1000`);
      const visitorsData = await visitorsResponse.json();
      
      const statsResponse = await fetch('/api/stats');
      const statsData = await statsResponse.json();
      
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

    visitors.forEach(visitor => {
      deviceCount[visitor.deviceType] = (deviceCount[visitor.deviceType] || 0) + 1;
      
      const country = visitor.country || 'Inconnu';
      countryCount[country] = (countryCount[country] || 0) + 1;
      
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
    Object.values(chartInstances.current).forEach(chart => {
      if (chart) chart.destroy();
    });

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
          plugins: { legend: { labels: { color: '#00ff88', font: { family: 'Orbitron' } } }, title: { display: true, text: 'Évolution des Visiteurs', color: '#00ff88', font: { family: 'Orbitron', size: 16 } } },
          scales: { y: { beginAtZero: true, ticks: { color: '#00ff88' }, grid: { color: 'rgba(0, 255, 136, 0.1)' } }, x: { ticks: { color: '#00ff88' }, grid: { color: 'rgba(0, 255, 136, 0.1)' } } }
        }
      });
    }

    if (deviceChartRef.current) {
      const ctx = deviceChartRef.current.getContext('2d');
      chartInstances.current.devices = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: analytics.deviceData.map(d => d.device),
          datasets: [{ data: analytics.deviceData.map(d => d.count), backgroundColor: ['#00ff88', '#ff6b6b', '#4ecdc4'], borderColor: '#1a1a2e', borderWidth: 2 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { color: '#00ff88', font: { family: 'Orbitron' } } }, title: { display: true, text: 'Répartition par Appareil', color: '#00ff88', font: { family: 'Orbitron', size: 16 } } }
        }
      });
    }

    if (countryChartRef.current) {
      const ctx = countryChartRef.current.getContext('2d');
      chartInstances.current.countries = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: analytics.countryData.slice(0, 10).map(d => d.country),
          datasets: [{ label: 'Visiteurs', data: analytics.countryData.slice(0, 10).map(d => d.count), backgroundColor: 'rgba(0, 255, 136, 0.8)', borderColor: '#00ff88', borderWidth: 1 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { labels: { color: '#00ff88', font: { family: 'Orbitron' } } }, title: { display: true, text: 'Top 10 Pays', color: '#00ff88', font: { family: 'Orbitron', size: 16 } } },
          scales: { y: { beginAtZero: true, ticks: { color: '#00ff88' }, grid: { color: 'rgba(0, 255, 136, 0.1)' } }, x: { ticks: { color: '#00ff88' }, grid: { color: 'rgba(0, 255, 136, 0.1)' } } }
        }
      });
    }
  };

  const calculateGrowth = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fr-FR').format(num);
  };

  const exportData = () => {
    const dataToExport = JSON.stringify(analytics, null, 2);
    const blob = new Blob([dataToExport], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-lounarailtp-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-gray-900 text-cyan-400 font-mono">Chargement des données analytiques...</div>;
  }

  return (
    <MegaDashboard />
  );
} 