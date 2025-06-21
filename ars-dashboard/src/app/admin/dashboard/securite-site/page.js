'use client';
import Link from 'next/link';
import { useEffect } from 'react';

export default function SecuriteSitePage() {
    useEffect(() => {
        document.title = 'Sécurité Site | Louna Rail TP';
    }, []);
    return (
        <div style={{ fontFamily: 'Manrope, sans-serif' }}>
            <h1 style={{ fontSize: '3em', fontWeight: 700, color: '#fbbf24' }}>Module Sécurité du Site</h1>
            <p style={{ opacity: 0.8, marginTop: '10px', fontSize: '1.2em' }}>Cette page est en cours de construction et affichera les journaux de sécurité, les alertes et les configurations.</p>
        </div>
    );
} 