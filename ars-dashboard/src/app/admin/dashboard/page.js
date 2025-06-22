import DashboardClient from './DashboardClient';

export const metadata = {
  title: 'Tableau de Bord Principal',
  description: 'Vue d\'ensemble des activités et des indicateurs de performance.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
    return <DashboardClient />;
} 