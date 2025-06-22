'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import MegaDashboard from '@/app/components/MegaDashboard'; // On importe le nouveau MEGA dashboard

export const metadata = {
  title: 'Tableau de Bord Principal',
  description: 'Vue d\'ensemble des activités et des indicateurs de performance.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardPage() {
    const { status } = useSession()
    const router = useRouter()

    if (status === 'loading') {
        return (
            <div style={{
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh', 
                backgroundColor: '#0a0a0a', 
                color: '#00ff88',
                fontFamily: "'Orbitron', monospace",
                fontSize: '1.5em'
            }}>
                Chargement de la session...
            </div>
        )
    }

    if (status === 'unauthenticated') {
        router.push('/admin/login')
        return null
    }

    // On affiche directement le Mega Dashboard pour l'utilisateur authentifié
    return (
        <MegaDashboard />
    )
} 