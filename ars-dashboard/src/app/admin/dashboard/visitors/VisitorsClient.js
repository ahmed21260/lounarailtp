'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  Globe, 
  Monitor, 
  Smartphone, 
  Clock, 
  MapPin,
  Eye,
  TrendingUp,
  DeviceMobile,
  DeviceTablet,
  Monitor as DesktopIcon,
  BarChart2,
  ArrowLeft,
  ArrowRight,
  UserCheck,
  X,
  Building,
  Calendar,
  Hash,
  Globe2,
  Bot,
  Link as LinkIcon,
  Briefcase
} from 'lucide-react';
// import './visitors.css'; // Supprimé car le fichier est introuvable et bloque le build
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function VisitorsClient() {
  const [visitors, setVisitors] = useState([]);
  const [stats, setStats] = useState({ total: 0, unique: 0, avgTime: 'N/A', returnRate: '0%' });
  const [loading, setLoading] = useState(true);
  const [selectedVisitor, setSelectedVisitor] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVisitors = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/visitors?page=${page}&limit=10`);
      if (response.ok) {
        const data = await response.json();
        setVisitors(data.visitors);
        setStats({
          total: data.stats.totalVisitors,
          unique: data.stats.uniqueVisitors,
          avgTime: data.stats.avgVisitDuration,
          returnRate: data.stats.returnRate
        });
        setTotalPages(data.pagination.pages);
        setCurrentPage(data.pagination.page);
      }
    } catch (error) {
      console.error('Failed to fetch visitors:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVisitors(currentPage);
  }, [currentPage]);

  const StatCard = ({ icon, title, value, color }) => (
    <div className="stat-card">
      <div className="stat-icon" style={{ backgroundColor: color }}>{icon}</div>
      <div className="stat-info">
        <span className="stat-title">{title}</span>
        <span className="stat-value">{value}</span>
      </div>
    </div>
  );
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchVisitors(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      fetchVisitors(currentPage - 1);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'mobile': return <DeviceMobile className="w-4 h-4" />;
      case 'tablet': return <DeviceTablet className="w-4 h-4" />;
      case 'desktop': return <DesktopIcon className="w-4 h-4" />;
      default: return <Monitor className="w-4 h-4" />;
    }
  };

  return (
    <div className="visitors-container">
      <header className="visitors-header">
        <h1>Analytics Visiteurs</h1>
        <p>Suivi détaillé des visiteurs et de leur comportement</p>
      </header>

      <div className="stats-grid">
        <StatCard icon={<Users size={24} />} title="Total Visiteurs" value={stats.total} color="#4A90E2" />
        <StatCard icon={<UserCheck size={24} />} title="Visiteurs Uniques" value={stats.unique} color="#50E3C2" />
        <StatCard icon={<Clock size={24} />} title="Temps Moyen / Session" value={`${stats.avgTime || 0}s`} color="#F5A623" />
        <StatCard icon={<BarChart2 size={24} />} title="Taux de Retour" value={`${stats.returnRate || 0}%`} color="#BD10E0" />
      </div>

      <div className="visitors-table-container">
        <h2>Visiteurs Récents</h2>
        {loading ? (
           <div className="loading-spinner"></div>
        ) : (
          <>
            <table className="visitors-table">
              <thead>
                <tr>
                  <th>Visiteur</th>
                  <th>Localisation</th>
                  <th>Appareil</th>
                  <th>Pages Vues</th>
                  <th>Dernière Activité</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visitors.map(visitor => (
                  <tr key={visitor.id}>
                    <td>
                      <div className="visitor-info">
                        <span>{visitor.ipAddress}</span>
                        <span className={`visitor-tag ${visitor.isReturning ? 'returning' : 'new'}`}>
                          {visitor.isReturning ? 'Connu' : 'Nouveau'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="location-info">
                        <MapPin size={16} />
                        <span>{visitor.city || 'Inconnu'}, {visitor.country || 'Inconnu'}</span>
                      </div>
                    </td>
                    <td>
                      <div className="device-info">
                        {getDeviceIcon(visitor.deviceType)}
                        <span>{visitor.deviceType} ({visitor.browser})</span>
                      </div>
                    </td>
                    <td className="text-center">{visitor._count?.pageViews || 0}</td>
                    <td>{formatDate(visitor.lastActivity)}</td>
                    <td>
                      <button className="details-btn" onClick={() => setSelectedVisitor(visitor)}>
                        <Eye size={16} /> Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination-controls">
                <button onClick={handlePrevPage} disabled={currentPage === 1}><ArrowLeft size={16} /> Précédent</button>
                <span>Page {currentPage} sur {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>Suivant <ArrowRight size={16} /></button>
            </div>
          </>
        )}
      </div>

      {selectedVisitor && (
        <div className="modal-overlay" onClick={() => setSelectedVisitor(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Détails du Visiteur</h3>
              <button className="close-modal-btn" onClick={() => setSelectedVisitor(null)}><X /></button>
            </div>
            <div className="modal-body">
                <div className="detail-grid">
                    <div className="detail-item"><MapPin size={16}/><span>IP:</span> {selectedVisitor.ipAddress}</div>
                    <div className="detail-item"><Globe size={16}/><span>Pays:</span> {selectedVisitor.country}, {selectedVisitor.region}, {selectedVisitor.city}</div>
                    <div className="detail-item"><Monitor size={16}/><span>Appareil:</span> {selectedVisitor.deviceType} ({selectedVisitor.browser} sur {selectedVisitor.os})</div>
                    <div className="detail-item"><Clock size={16}/><span>Durée:</span> {selectedVisitor.visitDuration}s</div>
                    <div className="detail-item"><Calendar size={16}/><span>Activité:</span> {formatDate(selectedVisitor.lastActivity)}</div>
                    <div className="detail-item"><Hash size={16}/><span>Session ID:</span> {selectedVisitor.sessionId}</div>
                    <div className="detail-item"><Globe2 size={16}/><span>Fuseau:</span> {selectedVisitor.timezone}</div>
                    <div className="detail-item"><LinkIcon size={16}/><span>Referrer:</span> <a href={selectedVisitor.referrer} target="_blank" rel="noopener noreferrer">{selectedVisitor.referrer || 'Direct'}</a></div>
                </div>

                <h4>Pages Vues ({selectedVisitor._count.pageViews})</h4>
                <ul className="page-views-list">
                    {selectedVisitor.pageViews.map(pv => (
                        <li key={pv.id}>
                            <a href={pv.pageUrl} target="_blank" rel="noopener noreferrer">{pv.pageTitle || pv.pageUrl}</a>
                            <span>({new Date(pv.createdAt).toLocaleTimeString('fr-FR')})</span>
                        </li>
                    ))}
                </ul>

                <h4>Paramètres UTM</h4>
                <div className="detail-grid">
                    <div className="detail-item"><Briefcase size={16}/><span>Source:</span> {selectedVisitor.utmSource || 'N/A'}</div>
                    <div className="detail-item"><Briefcase size={16}/><span>Medium:</span> {selectedVisitor.utmMedium || 'N/A'}</div>
                    <div className="detail-item"><Briefcase size={16}/><span>Campaign:</span> {selectedVisitor.utmCampaign || 'N/A'}</div>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 