import VisitorsClient from './VisitorsClient';

export const metadata = {
  title: 'Liste des Visiteurs',
  description: 'Journal des visiteurs du site web avec détails de session et informations techniques.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function VisitorsPage() {
  return <VisitorsClient />;
} 