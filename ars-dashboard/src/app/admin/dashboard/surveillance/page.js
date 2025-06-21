'use client';
import Link from 'next/link';
import { useEffect } from 'react';

export default function SurveillancePage() {
    useEffect(() => {
        document.title = 'Surveillance | Louna Rail TP';
    }, []);

    return (
        <div style={{ fontFamily: 'Manrope, sans-serif' }}>
             <h1 style={{ fontSize: '3em', fontWeight: 700, color: '#fbbf24' }}>Module Surveillance</h1>
             {/* Je vais remplacer ce contenu par le composant SurveillanceModule une fois qu'il sera prêt */}
            <p style={{ opacity: 0.8, marginTop: '10px', fontSize: '1.2em' }}>Cette page est en cours de construction et affichera les données de surveillance en temps réel.</p>
        </div>
    );
} 