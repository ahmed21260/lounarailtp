/**
 * Configuration SEO Centralisée - Louna Rail TP
 * © 2025 Ahmed Chaira - Tous droits réservés
 */

export const seoConfig = {
  // Configuration de base
  site: {
    name: 'Louna Rail TP',
    url: 'https://lounarailtp.com',
    description: 'Expert en travaux ferroviaires, maintenance d\'infrastructure et formation professionnelle. Spécialiste en sécurité ferroviaire, formation conducteurs et services de maintenance.',
    keywords: [
      'travaux ferroviaires',
      'maintenance ferroviaire', 
      'formation conducteur train',
      'sécurité ferroviaire',
      'infrastructure ferroviaire',
      'maintenance voie ferrée',
      'formation professionnelle ferroviaire',
      'expertise ferroviaire',
      'services ferroviaires',
      'maintenance préventive',
      'formation sécurité',
      'travaux de voie',
      'maintenance signalisation',
      'formation continue',
      'expert ferroviaire',
      'SNCF',
      'RATP',
      'maintenance rail',
      'formation conducteur',
      'sécurité transport'
    ],
    author: 'Ahmed Chaira',
    publisher: 'Louna Rail TP',
    language: 'fr',
    country: 'FR',
    timezone: 'Europe/Paris',
    currency: 'EUR'
  },

  // Configuration Open Graph
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'Louna Rail TP',
    title: 'Louna Rail TP - Expert en Travaux Ferroviaires et Formation',
    description: 'Expert en travaux ferroviaires, maintenance d\'infrastructure et formation professionnelle. Spécialiste en sécurité ferroviaire et services de maintenance.',
    images: [
      {
        url: '/images/logo-lr-2.png',
        width: 1200,
        height: 630,
        alt: 'Louna Rail TP - Expert en Travaux Ferroviaires',
        type: 'image/png'
      }
    ]
  },

  // Configuration Twitter
  twitter: {
    card: 'summary_large_image',
    site: '@lounarailtp',
    creator: '@lounarailtp',
    title: 'Louna Rail TP - Expert en Travaux Ferroviaires et Formation',
    description: 'Expert en travaux ferroviaires, maintenance d\'infrastructure et formation professionnelle. Spécialiste en sécurité ferroviaire.',
    images: ['/images/logo-lr-2.png']
  },

  // Configuration des robots
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    }
  },

  // Configuration de vérification
  verification: {
    google: 'votre-code-verification-google',
    yandex: 'votre-code-verification-yandex',
    yahoo: 'votre-code-verification-yahoo',
    bing: 'votre-code-verification-bing'
  },

  // Configuration géographique
  geo: {
    region: 'FR',
    placename: 'France',
    position: '48.8566;2.3522',
    ICBM: '48.8566, 2.3522'
  },

  // Configuration des réseaux sociaux
  social: {
    facebook: 'https://www.facebook.com/lounarailtp',
    twitter: 'https://twitter.com/lounarailtp',
    linkedin: 'https://www.linkedin.com/company/louna-rail-tp',
    instagram: 'https://www.instagram.com/lounarailtp',
    youtube: 'https://www.youtube.com/@lounarailtp'
  },

  // Configuration des contacts
  contact: {
    email: 'contact@lounarailtp.com',
    phone: '+33-1-XX-XX-XX-XX',
    address: {
      street: 'Adresse de Louna Rail TP',
      city: 'Paris',
      postalCode: '75000',
      country: 'France'
    }
  },

  // Configuration des services
  services: [
    {
      name: 'Travaux Ferroviaires',
      description: 'Maintenance et réparation d\'infrastructure ferroviaire',
      url: '/services/travaux-ferroviaires',
      keywords: ['travaux ferroviaires', 'maintenance rail', 'infrastructure ferroviaire']
    },
    {
      name: 'Formation Professionnelle',
      description: 'Formation conducteurs et personnel ferroviaire',
      url: '/formations',
      keywords: ['formation conducteur', 'formation ferroviaire', 'formation sécurité']
    },
    {
      name: 'Sécurité Ferroviaire',
      description: 'Services de sécurité et maintenance préventive',
      url: '/services/securite-ferroviaire',
      keywords: ['sécurité ferroviaire', 'maintenance préventive', 'sécurité transport']
    }
  ],

  // Configuration des pages importantes
  pages: {
    home: {
      title: 'Louna Rail TP - Expert en Travaux Ferroviaires et Formation',
      description: 'Découvrez Louna Rail TP, expert en travaux ferroviaires, maintenance d\'infrastructure et formation professionnelle. Spécialiste en sécurité ferroviaire.',
      keywords: ['expert ferroviaire', 'travaux ferroviaires', 'formation conducteur'],
      priority: 1.0
    },
    services: {
      title: 'Services Ferroviaires - Louna Rail TP',
      description: 'Nos services complets de travaux ferroviaires, maintenance d\'infrastructure et sécurité ferroviaire.',
      keywords: ['services ferroviaires', 'maintenance ferroviaire', 'travaux rail'],
      priority: 0.9
    },
    formations: {
      title: 'Formations Ferroviaires - Louna Rail TP',
      description: 'Formations professionnelles pour conducteurs et personnel ferroviaire. Certifications et formations continues.',
      keywords: ['formation conducteur', 'formation ferroviaire', 'certification'],
      priority: 0.9
    },
    contact: {
      title: 'Contact - Louna Rail TP',
      description: 'Contactez Louna Rail TP pour vos projets ferroviaires. Devis gratuit et conseils d\'experts.',
      keywords: ['contact', 'devis', 'expertise ferroviaire'],
      priority: 0.8
    }
  },

  // Configuration des métadonnées Dublin Core
  dublinCore: {
    title: 'Louna Rail TP - Expert en Travaux Ferroviaires',
    creator: 'Ahmed Chaira',
    subject: 'Travaux Ferroviaires, Maintenance, Formation',
    description: 'Expert en travaux ferroviaires et formation professionnelle',
    publisher: 'Louna Rail TP',
    contributor: 'Ahmed Chaira',
    date: '2025-01-01',
    type: 'Text',
    format: 'text/html',
    identifier: 'https://lounarailtp.com',
    language: 'fr',
    coverage: 'France',
    rights: '© 2025 Louna Rail TP - Tous droits réservés'
  },

  // Configuration des données structurées
  structuredData: {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Louna Rail TP',
      url: 'https://lounarailtp.com',
      logo: 'https://lounarailtp.com/images/logo-lr-2.png',
      description: 'Expert en travaux ferroviaires, maintenance d\'infrastructure et formation professionnelle',
      foundingDate: '2020',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'FR',
        addressRegion: 'France'
      },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: 'contact@lounarailtp.com',
        availableLanguage: ['French', 'English']
      },
      sameAs: [
        'https://www.linkedin.com/company/louna-rail-tp',
        'https://www.facebook.com/lounarailtp'
      ]
    },
    localBusiness: {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'Louna Rail TP',
      image: 'https://lounarailtp.com/images/logo-lr-2.png',
      description: 'Expert en travaux ferroviaires et formation professionnelle',
      url: 'https://lounarailtp.com',
      telephone: '+33-1-XX-XX-XX-XX',
      email: 'contact@lounarailtp.com',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'FR',
        addressRegion: 'France'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 48.8566,
        longitude: 2.3522
      },
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '08:00',
        closes: '18:00'
      },
      priceRange: '€€',
      currenciesAccepted: 'EUR',
      paymentAccepted: 'Cash, Credit Card, Bank Transfer'
    }
  }
};

// Fonction pour générer les métadonnées d'une page
export function generatePageMetadata(page, customData = {}) {
  const baseConfig = seoConfig.pages[page] || seoConfig.pages.home;
  
  return {
    title: customData.title || baseConfig.title,
    description: customData.description || baseConfig.description,
    keywords: customData.keywords || baseConfig.keywords,
    priority: customData.priority || baseConfig.priority,
    openGraph: {
      ...seoConfig.openGraph,
      title: customData.title || baseConfig.title,
      description: customData.description || baseConfig.description,
      url: `${seoConfig.site.url}${customData.url || ''}`
    },
    twitter: {
      ...seoConfig.twitter,
      title: customData.title || baseConfig.title,
      description: customData.description || baseConfig.description
    }
  };
}

// Fonction pour générer les données structurées
export function generateStructuredData(type, customData = {}) {
  const baseData = seoConfig.structuredData[type];
  
  if (!baseData) {
    console.warn(`Type de données structurées non trouvé: ${type}`);
    return null;
  }
  
  return {
    ...baseData,
    ...customData
  };
}

export default seoConfig; 