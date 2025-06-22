'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import MegaDashboard from '@/app/components/MegaDashboard';

export default function DashboardClient() {
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