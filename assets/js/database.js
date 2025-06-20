// Fichier: assets/js/database.js
// Ce fichier centralise toutes les données de l'application Louna Rail TP.
// Il sert de source unique de vérité pour le contenu dynamique du site.

const db = {
  // =================================================================
  // COLLECTION: FORMATEURS
  // =================================================================
  trainers: [
    {
      _id: "trainer_1",
      firstName: "Ahmed",
      lastName: "Chaira",
      email: "ahmed.chaira.pro@lounarailtp.fr",
      specialties: ["Pelle Rail-Route", "Module Engcon", "Sécurité Ferroviaire", "Tinbin TC2"],
      bio: "Formateur expert avec 15 ans d'expérience sur les chantiers ferroviaires nationaux, certifié et passionné par la transmission du savoir-faire."
    }
  ],

  // =================================================================
  // COLLECTION: PRODUITS (Formations, Prestations, Location)
  // =================================================================
  products: [
    // --- CATÉGORIE: FORMATION ---
    {
      _id: "prod_1",
      name: "Pack Engcon",
      type: "MODULE_SPECIFIQUE",
      category: "Formation",
      tagline: "Tiltrotateur",
      image: "images/Pack Engcon.png",
      description: "Maîtrisez l'utilisation des tiltrotateurs Engcon sur engins rail-route et boostez votre productivité sur chantier.",
      longDescription: "Devenez un expert recherché grâce à une formation pratique, concrète et certifiante.",
      duration: { value: 16, unit: "heures" },
      price: { amount: 1400, currency: "EUR", per: "personne" },
      features: ["Prise en main pratique", "Sécurité d'utilisation", "Optimisation des chantiers"],
      value: "pack-engcon",
      isMainPack: true,
      isActive: true
    },
    {
      _id: "prod_2",
      name: "CACES R482/R483",
      type: "CERTIFICATION",
      category: "Formation",
      tagline: "Certification officielle",
      image: "images/Pelle Mecala 216 M.png",
      description: "Obtenez votre CACES et ouvrez-vous les portes des chantiers ferroviaires.",
      longDescription: "Formation intensive, accompagnement personnalisé et passage d'examen inclus pour garantir votre réussite.",
      duration: { value: 35, unit: "heures" },
      price: { amount: 2200, currency: "EUR", per: "personne" },
      features: ["Préparation intensive", "Examens blancs", "Passage CACES inclus"],
      value: "caces",
      isMainPack: true,
      isMostRequested: true,
      isActive: true
    },
    {
      _id: "prod_3",
      name: "Pack Montée en compétence",
      type: "FORMATION_CONTINUE",
      category: "Formation",
      tagline: "Perfectionnement",
      image: "images/CAT 323.png",
      description: "Progressez à votre rythme et atteignez un nouveau niveau d'expertise sur les engins rail-route.",
      longDescription: "Un parcours sur-mesure pour booster votre carrière et votre sécurité.",
      duration: { value: 24, unit: "heures" },
      price: { amount: 1800, currency: "EUR", per: "personne" },
      features: ["Diagnostic de niveau", "Modules adaptés", "Suivi individuel"],
      value: "perfectionnement",
      isMainPack: true,
      isActive: true
    },
    {
      _id: "prod_4",
      name: "Sécurité ferroviaire",
      type: "FORMATION_SPECIFIQUE",
      category: "Formation",
      tagline: "Sécurité & Protocoles",
      description: "Devenez acteur de la sécurité sur vos chantiers ferroviaires.",
      longDescription: "Apprenez à anticiper les risques, à mettre en place les bons protocoles et à protéger vos équipes.",
      features: ["Mise en place de protocoles", "Audits sécurité", "Accompagnement terrain"],
      value: "securite",
      link: "securite-ferroviaire.html",
      isActive: true
    },
    {
      _id: "prod_5",
      name: "Tinbin TC2",
      type: "MODULE_SPECIFIQUE",
      category: "Formation",
      tagline: "Aspirateur Ballast",
      image: "images/Tinbin TC.png",
      description: "Maîtrisez l'utilisation de l'aspirateur hydraulique Tinbin TC2 pour l'entretien du ballast ferroviaire.",
      longDescription: "Formation pratique, conseils d'experts et cas concrets pour une efficacité maximale.",
      duration: { value: 8, unit: "heures" },
      price: { amount: 800, currency: "EUR", per: "personne" },
      features: ["Prise en main machine", "Entretien ballast", "Sécurité d'utilisation"],
      value: "tinbin",
      isActive: true
    },

    // --- CATÉGORIE: PRESTATION ---
    {
        _id: "prod_10",
        category: "Prestation",
        name: "Interventions rail-route",
        description: "Opérations de maintenance, travaux de voie, assistance technique et location de chauffeurs qualifiés pour vos chantiers nationaux.",
        features: ["Maintenance préventive et corrective", "Travaux de voie (remplacement, nivellement)", "Support technique sur site", "Mise à disposition d'opérateurs expérimentés"]
    },
    {
        _id: "prod_11",
        category: "Prestation",
        name: "Manutention & Levage",
        description: "Solutions sécurisées pour tous types de charges en environnement ferroviaire, du matériel léger aux charges lourdes.",
        features: ["Opérations de levage complexes", "Manutention de matériel sensible", "Élingage et gestion des charges", "Respect des normes de sécurité ferroviaire"]
    },
    {
        _id: "prod_12",
        category: "Prestation",
        name: "Conseil & Expertise",
        description: "Accompagnement stratégique pour optimiser la sécurité et la performance de vos chantiers.",
        features: ["Audit de sécurité et recommandations", "Optimisation des processus de travail", "Accompagnement à la certification", "Aide à la formation interne"]
    },

    // --- CATÉGORIE: LOCATION ---
    {
        _id: "prod_20",
        category: "Location",
        name: "Engins rail-route",
        description: "Location de pelles rail-route modernes et entretenues, avec une gamme complète d'accessoires et d'équipements spécialisés.",
        features: ["Pelles rail-route de dernière génération", "Tiltrotateurs Engcon", "Godets et pinces variés", "Options avec ou sans opérateur"]
    },
    {
        _id: "prod_21",
        category: "Location",
        name: "Matériel de chantier",
        description: "Location de petits matériels, outillages et équipements spécifiques pour l'environnement ferroviaire.",
        features: ["Outils portatifs", "Équipements de signalisation", "Matériel de topographie", "Consommables de chantier"]
    },
    {
        _id: "prod_22",
        category: "Location",
        name: "Solutions flexibles & support",
        description: "Location courte ou longue durée, avec un support complet pour une prise en main efficace sur site.",
        features: ["Contrats de location flexibles", "Livraison sur chantier", "Mise en service et formation initiale", "Support technique et assistance 7j/7"]
    }
  ],
  
  // =================================================================
  // COLLECTION: REALISATIONS (Galerie)
  // =================================================================
  realisations: [
    {
      _id: "real_1",
      title: "Test de charge sur pont",
      subtitle: "160 tonnes d'acier",
      description: "Huit pelles rail-route de 20 tonnes chacune ont pris place sur le tablier pour tester la résistance d'un pont.",
      image: "images/Gruttage pelle.jpg",
      tags: ["Haute Précision", "Levage"]
    },
    {
      _id: "real_2",
      title: "Chantier EOLE RER E",
      subtitle: "Collaboration TSO",
      description: "Participation au projet d'envergure EOLE (Est-Ouest Liaison Express) en collaboration avec TSO / EIFFAGE RAIL.",
      image: "images/dashboard/Pelle en action.png",
      tags: ["Grand Chantier", "IDF"]
    },
    {
      _id: "real_3",
      title: "Pose de ventilation tunnel",
      subtitle: "Grand Paris Express",
      description: "Intervention technique pour la pose des systèmes de ventilation sur la future Ligne 16 du Grand Paris Express.",
      image: "images/POSE JET.jpg",
      tags: ["Tunnel", "Grand Paris"]
    },
    {
      _id: "real_4",
      title: "Remplacement de rails",
      subtitle: "Chantier de nuit",
      description: "Opération nocturne pour le remplacement et la modernisation d'une section de voie.",
      image: "images/dashboard/Chantier 1.jpg",
      tags: ["Maintenance", "Nuit"]
    }
  ],
  
  // =================================================================
  // COLLECTION: CLIENTS (Exemple)
  // =================================================================
  clients: [
    {
      _id: "client_1",
      firstName: "Ahmed",
      lastName: "Chaira",
      email: "ahmed@lounarailtp.fr",
      phone: "+33612345678",
      companyName: "Louna Rail TP",
      location: "IDF",
      status: "active_client",
      createdAt: "2024-07-27T10:00:00Z"
    }
  ]
}; 