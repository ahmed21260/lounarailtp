// Fichier: assets/js/database.js
// Ce fichier centralise toutes les données de l'application Louna Rail TP.
// Il sert de source unique de vérité pour le contenu dynamique du site.

const dbIdMapping = {
  // Ce mapping fait le lien entre les _id (texte) des produits et les id (nombre) de la base de données serveur.
  "prod_1": 1, // Pack Engcon
  "prod_2": 2, // CACES R482/R483
  "prod_3": 3, // Pack Montée en compétence
  "prod_4": 4, // Sécurité ferroviaire
  "prod_5": 5  // Tinbin TC2
};

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
  // COLLECTION: QUIZ (Système d'évaluation)
  // =================================================================
  quizzes: [
    {
      _id: "quiz_caces_1",
      formationId: "prod_2",
      title: "Quiz CACES R482/R483 - Module 1",
      description: "Testez vos connaissances sur les bases de la conduite d'engins rail-route",
      questions: [
        {
          id: 1,
          question: "Quelle est la vitesse maximale généralement admise pour un engin rail-route circulant sur une voie de service ?",
          options: [
            { id: "A", text: "20 km/h", isCorrect: false },
            { id: "B", text: "30 km/h", isCorrect: true },
            { id: "C", text: "40 km/h", isCorrect: false },
            { id: "D", text: "50 km/h", isCorrect: false }
          ],
          explanation: "La vitesse maximale pour les engins sur voie de service est généralement limitée à 30 km/h pour garantir la sécurité des opérations et du personnel."
        },
        {
          id: 2,
          question: "Quels sont les 3 Équipements de Protection Individuelle (EPI) de base obligatoires sur un chantier ferroviaire ?",
          options: [
            { id: "A", text: "Casque, gants et masque", isCorrect: false },
            { id: "B", text: "Chaussures de sécurité, lunettes et bouchons d'oreilles", isCorrect: false },
            { id: "C", text: "Casque, chaussures de sécurité et vêtement haute visibilité", isCorrect: true },
            { id: "D", text: "Gants, harnais et lunettes", isCorrect: false }
          ],
          explanation: "Le port du casque, des chaussures de sécurité et d'un vêtement haute visibilité est le minimum obligatoire pour toute personne présente sur un chantier ferroviaire."
        },
        {
          id: 3,
          question: "Lors d'une Vérification Journalière de Prise de Poste (VJP), que devez-vous contrôler en priorité sur un engin rail-route ?",
          options: [
            { id: "A", text: "Uniquement les niveaux d'huile et de carburant", isCorrect: false },
            { id: "B", text: "L'état des organes de sécurité (freins, avertisseurs sonores, feux)", isCorrect: true },
            { id: "C", text: "La propreté de la cabine", isCorrect: false },
            { id: "D", text: "La connexion Bluetooth de l'autoradio", isCorrect: false }
          ],
          explanation: "La VJP impose un contrôle rigoureux des organes de sécurité. Un défaut sur ces éléments peut entraîner une interdiction de prise de poste."
        },
        {
          id: 4,
          question: "Que signifie l'acronyme ITEP dans le jargon de la sécurité des chantiers ferroviaires ?",
          options: [
            { id: "A", text: "Intervention Très Extrêmement Périphérique", isCorrect: false },
            { id: "B", text: "Interruption Temporaire d'Extinction de Poste", isCorrect: false },
            { id: "C", text: "Installation Terminale Embranchée Privée", isCorrect: false },
            { id: "D", text: "Interruption Temporaire de l'Exploitation pour Travaux", isCorrect: true }
          ],
          explanation: "L'ITEP est une mesure de sécurité essentielle qui garantit l'absence de toute circulation sur une section de voie définie pour permettre des travaux en toute sécurité."
        }
      ],
      passingScore: 70,
      timeLimit: 15 // minutes
    },
    {
      _id: "quiz_engcon_1",
      formationId: "prod_1",
      title: "Quiz Pack Engcon - Module 1",
      description: "Évaluez votre maîtrise des tiltrotateurs Engcon",
      questions: [
        {
          id: 1,
          question: "Quel est le principal avantage d'un tiltrotateur comme le Engcon ?",
          options: [
            { id: "A", text: "Augmenter la force de levage de l'engin", isCorrect: false },
            { id: "B", text: "Améliorer la polyvalence et la précision de l'outil", isCorrect: true },
            { id: "C", text: "Réduire la consommation de carburant de 50%", isCorrect: false },
            { id: "D", text: "Permettre de rouler plus vite sur les rails", isCorrect: false }
          ],
          explanation: "Le tiltrotateur, en permettant l'inclinaison et la rotation de l'outil, augmente considérablement la polyvalence de l'engin et la précision du travail, réduisant le besoin de repositionner la machine."
        },
        {
          id: 2,
          question: "Sur une pelle rail-route moderne, à quoi sert principalement le système de contrôle de dévers ?",
          options: [
            { id: "A", text: "À maintenir l'équilibre et la stabilité de la machine en compensant l'inclinaison de la voie", isCorrect: true },
            { id: "B", text: "À réguler automatiquement la température du moteur", isCorrect: false },
            { id: "C", text: "À contrôler la vitesse de rotation de la tourelle", isCorrect: false },
            { id: "D", text: "À gérer la pression des pneus pour la route", isCorrect: false }
          ],
          explanation: "Le système de contrôle de dévers est un dispositif de sécurité crucial qui assure la stabilité de la pelle lorsque la voie est inclinée (en dévers), prévenant ainsi les risques de basculement."
        },
        {
          id: 3,
          question: "Quelle est la particularité du système de raccordement rapide EC-Oil d'Engcon ?",
          options: [
            { id: "A", text: "Il permet de changer d'outil plus rapidement manuellement", isCorrect: false },
            { id: "B", text: "Il connecte automatiquement l'hydraulique et l'électricité sans descendre de la cabine", isCorrect: true },
            { id: "C", text: "Il est uniquement compatible avec les godets", isCorrect: false },
            { id: "D", text: "Il augmente la pression hydraulique de l'outil", isCorrect: false }
          ],
          explanation: "EC-Oil est un système de raccordement automatique qui connecte les outils hydrauliques et les circuits électriques, augmentant la sécurité et l'efficacité."
        },
        {
          id: 4,
          question: "Quelle précaution prendre avant d'utiliser un tiltrotateur ?",
          options: [
            { id: "A", text: "Vérifier uniquement le niveau d'huile", isCorrect: false },
            { id: "B", text: "Effectuer une inspection complète de l'équipement", isCorrect: true },
            { id: "C", text: "Tester uniquement les commandes", isCorrect: false },
            { id: "D", text: "Vérifier uniquement les pneus", isCorrect: false }
          ],
          explanation: "Une inspection complète de l'équipement est obligatoire avant chaque utilisation pour garantir la sécurité."
        }
      ],
      passingScore: 75,
      timeLimit: 10
    },
    {
      _id: "quiz_securite_1",
      formationId: "prod_4",
      title: "Quiz Sécurité Ferroviaire - Module 1",
      description: "Testez vos connaissances sur les protocoles de sécurité fondamentaux.",
      questions: [
        {
          id: 1,
          question: "En cas d'obstacle imprévu sur la voie, quelle est la procédure d'alerte radio à utiliser pour stopper immédiatement tous les trains dans une zone ?",
          options: [
            { id: "A", text: "Lancer un appel de détresse standard", isCorrect: false },
            { id: "B", text: "Utiliser la procédure d'Alerte Radio \"Stop, Stop, Stop\"", isCorrect: true },
            { id: "C", text: "Contacter le chef de gare le plus proche", isCorrect: false },
            { id: "D", text: "Activer simplement son signal sonore", isCorrect: false }
          ],
          explanation: "La procédure d'Alerte Radio (parfois associée à un bouton d'urgence dédié) diffuse un message prioritaire à tous les trains dans la zone pour un arrêt d'urgence."
        },
        {
          id: 2,
          question: "Pour protéger un obstacle sur la voie en l'absence de radio, quel dispositif manuel est posé sur le rail pour alerter un train qui approche ?",
          options: [
            { id: "A", text: "Un plot de signalisation orange", isCorrect: false },
            { id: "B", text: "Une fusée de détresse rouge", isCorrect: false },
            { id: "C", text: "Un ou plusieurs pétards", isCorrect: true },
            { id: "D", text: "Un drapeau rouge", isCorrect: false }
          ],
          explanation: "Un pétard est un dispositif qui explose au passage de la roue du train, produisant une détonation forte qui sert de signal d'arrêt impératif pour le conducteur."
        },
        {
          id: 3,
          question: "Pourquoi est-il vital de ne jamais s'approcher à moins de 3 mètres d'une caténaire, même si le contact direct n'a pas lieu ?",
          options: [
            { id: "A", text: "À cause du bruit qu'elle génère", isCorrect: false },
            { id: "B", text: "À cause du risque de chute d'éléments", isCorrect: false },
            { id: "C", text: "À cause du risque d'arc électrique, qui peut être mortel à distance", isCorrect: true },
            { id: "D", text: "À cause des vibrations dans le sol", isCorrect: false }
          ],
          explanation: "Une caténaire est sous très haute tension (1500V ou 25000V). Un arc électrique peut se former à travers l'air si l'on s'approche trop près, provoquant une électrocution mortelle sans même toucher le câble."
        },
        {
          id: 4,
          question: "Que signifie l'acronyme ITEP dans le jargon de la sécurité des chantiers ferroviaires ?",
          options: [
            { id: "A", text: "Intervention Très Extrêmement Périphérique", isCorrect: false },
            { id: "B", text: "Interruption Temporaire d'Extinction de Poste", isCorrect: false },
            { id: "C", text: "Installation Terminale Embranchée Privée", isCorrect: false },
            { id: "D", text: "Interruption Temporaire de l'Exploitation pour Travaux", isCorrect: true }
          ],
          explanation: "L'ITEP est une mesure de sécurité essentielle qui garantit l'absence de toute circulation sur une section de voie définie pour permettre des travaux en toute sécurité."
        }
      ],
      passingScore: 80,
      timeLimit: 12
    },
    {
      _id: "quiz_tinbin_1",
      formationId: "prod_5",
      title: "Quiz Tinbin TC2 - Module 1",
      description: "Évaluez votre maîtrise de l'aspirateur de ballast",
      questions: [
        {
          id: 1,
          question: "Quel est le rôle principal de l'aspirateur Tinbin TC2 ?",
          options: [
            { id: "A", text: "Nettoyer les voies", isCorrect: false },
            { id: "B", text: "Aspirer et nettoyer le ballast", isCorrect: true },
            { id: "C", text: "Tasser le ballast", isCorrect: false },
            { id: "D", text: "Pose de rails", isCorrect: false }
          ],
          explanation: "L'aspirateur Tinbin TC2 est spécialement conçu pour aspirer et nettoyer le ballast ferroviaire."
        },
        {
          id: 2,
          question: "Quelle pression hydraulique est recommandée pour le Tinbin TC2 ?",
          options: [
            { id: "A", text: "150 bar", isCorrect: false },
            { id: "B", text: "200 bar", isCorrect: false },
            { id: "C", text: "250 bar", isCorrect: true },
            { id: "D", text: "300 bar", isCorrect: false }
          ],
          explanation: "Une pression hydraulique de 250 bar est recommandée pour un fonctionnement optimal du Tinbin TC2."
        },
        {
          id: 3,
          question: "Quelle maintenance préventive est essentielle pour le Tinbin ?",
          options: [
            { id: "A", text: "Nettoyage des filtres", isCorrect: true },
            { id: "B", text: "Changement d'huile moteur", isCorrect: false },
            { id: "C", text: "Gonflage des pneus", isCorrect: false },
            { id: "D", text: "Révision complète", isCorrect: false }
          ],
          explanation: "Le nettoyage régulier des filtres est essentiel pour maintenir l'efficacité de l'aspirateur."
        },
        {
          id: 4,
          question: "En cas de colmatage du tuyau d'aspiration du Tinbin, quelle est la première action sécuritaire à entreprendre ?",
          options: [
            { id: "A", text: "Augmenter la puissance d'aspiration au maximum", isCorrect: false },
            { id: "B", text: "Arrêter complètement l'engin et dépressuriser le circuit hydraulique", isCorrect: true },
            { id: "C", text: "Secouer vigoureusement le tuyau pour le débloquer", isCorrect: false },
            { id: "D", text: "Insérer un objet métallique pour percer le bouchon", isCorrect: false }
          ],
          explanation: "Avant toute intervention manuelle sur un équipement hydraulique, la mise à l'arrêt complet et la dépressurisation sont des étapes de sécurité non négociables."
        }
      ],
      passingScore: 75,
      timeLimit: 10
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
      phone: "+33612435163",
      companyName: "Louna Rail TP",
      location: "IDF",
      status: "active_client",
      createdAt: "2024-07-27T10:00:00Z"
    }
  ]
}; 