import LoginClient from './LoginClient';

export const metadata = {
  title: 'Connexion Administrateur',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <LoginClient />;
} 