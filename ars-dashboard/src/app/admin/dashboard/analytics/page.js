import AnalyticsClient from './AnalyticsClient';

export const metadata = {
  title: 'Analyse de Trafic Web',
  description: 'Analyse détaillée des visiteurs, pages vues, et sources de trafic du site web.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AnalyticsPage() {
  return <AnalyticsClient />;
} 