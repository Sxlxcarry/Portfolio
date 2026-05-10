/**
 * Contenu intégral du portfolio — bilingue FR/EN
 * Source unique de vérité, importée par tous les composants.
 */

export type Lang = 'fr' | 'en';

export const PROFILE = {
  name: 'Kylian Honorine',
  role: 'Network & Security Engineer',
  location: 'La Réunion · France',
  email: 'kylian.honorine404@gmail.com',
  github: 'https://github.com/Sxlxcarry',
  linkedin: 'https://linkedin.com/in/kylianhonorine',
  cv: '/CV.html',
};

export const NAV = {
  fr: [
    { id: 'identity',   label: 'Identité' },
    { id: 'profile',    label: 'Profil' },
    { id: 'stack',      label: 'Stack' },
    { id: 'work',       label: 'Travaux' },
    { id: 'research',   label: 'Recherche' },
    { id: 'trajectory', label: 'Trajectoire' },
    { id: 'contact',    label: 'Contact' },
  ],
  en: [
    { id: 'identity',   label: 'Identity' },
    { id: 'profile',    label: 'Profile' },
    { id: 'stack',      label: 'Stack' },
    { id: 'work',       label: 'Work' },
    { id: 'research',   label: 'Research' },
    { id: 'trajectory', label: 'Trajectory' },
    { id: 'contact',    label: 'Contact' },
  ],
};

/* ============================================================
   HERO / IDENTITÉ
   ============================================================ */
export const HERO = {
  fr: {
    eyebrow: 'PORTFOLIO · 2026',
    titleA: 'Concevoir',
    titleB: 'des systèmes',
    titleC: 'qui tiennent.',
    intro:
      "Étudiant alternant en cybersécurité, infrastructure et administration réseau. " +
      "J'architecture, je sécurise et je supervise des environnements résilients — " +
      "du câble physique aux dashboards d'observabilité.",
    cta1: 'Explorer les travaux',
    cta2: 'Télécharger le CV',
    statusLine: 'NODE ONLINE · LISTENING ON 0.0.0.0',
  },
  en: {
    eyebrow: 'PORTFOLIO · 2026',
    titleA: 'Building',
    titleB: 'systems',
    titleC: 'that hold.',
    intro:
      "Apprentice student in cybersecurity, infrastructure and network administration. " +
      "I architect, secure and supervise resilient environments — " +
      "from physical cabling to observability dashboards.",
    cta1: 'Explore work',
    cta2: 'Download CV',
    statusLine: 'NODE ONLINE · LISTENING ON 0.0.0.0',
  },
};

/* ============================================================
   PROFILE — l'à propos, narratif
   ============================================================ */
export const PROFILE_SECTION = {
  fr: {
    chapter: '01',
    label: 'Profil',
    title: 'Une approche',
    titleEm: 'méthodique',
    titleEnd: 'des systèmes.',
    paragraphs: [
      "Je conçois des infrastructures comme on dessine des plans : par couches, par flux, par responsabilités. Chaque équipement a un rôle, chaque règle une justification, chaque alerte un destinataire.",
      "Mon terrain de jeu se situe à l'intersection du réseau, du système et de la sécurité. Configuration Cisco, segmentation VLAN, durcissement Linux, supervision Prometheus/Grafana, automatisation Ansible — j'apprends à transformer des environnements hétérogènes en plateformes observables et défendables.",
      "L'attaque éclaire la défense : je pratique le pentest et les CTF pour comprendre les angles morts, mieux les fermer ensuite.",
    ],
    chips: [
      'IPv4/IPv6',
      'Segmentation & ACLs',
      'Pentest',
      'Windows / Linux',
      'OPNsense / Stormshield',
      'Falco',
      'Docker',
      'FTTH / GPON',
    ],
  },
  en: {
    chapter: '01',
    label: 'Profile',
    title: 'A',
    titleEm: 'methodical',
    titleEnd: 'approach to systems.',
    paragraphs: [
      "I design infrastructures the way one draws blueprints: in layers, in flows, in responsibilities. Each device has a role, each rule a justification, each alert a recipient.",
      "My playground sits at the intersection of networking, systems, and security. Cisco configuration, VLAN segmentation, Linux hardening, Prometheus/Grafana monitoring, Ansible automation — I'm learning to turn heterogeneous environments into observable, defensible platforms.",
      "Offense informs defense: I practice pentesting and CTFs to understand blind spots, then close them better.",
    ],
    chips: [
      'IPv4/IPv6',
      'Segmentation & ACLs',
      'Pentest',
      'Windows / Linux',
      'OPNsense / Stormshield',
      'Falco',
      'Docker',
      'FTTH / GPON',
    ],
  },
};

/* ============================================================
   STACK — compétences en couches OSI-style
   ============================================================ */
export const STACK = {
  fr: {
    chapter: '02',
    label: 'Stack',
    title: 'Une',
    titleEm: 'architecture',
    titleEnd: 'à plusieurs couches.',
    desc: "Quatre strates d'expertise — du transport des paquets aux dashboards de supervision. Survol chaque couche pour révéler ses outils.",
    layers: [
      {
        id: 'L1',
        title: 'Réseau',
        subtitle: 'Layer 1–3 · Transport & Routage',
        tools: ['VLAN · 802.1Q', 'OSPF · BGP', 'QoS', 'IPSec · WireGuard', 'Cisco IOS', 'FTTH · GPON'],
      },
      {
        id: 'L2',
        title: 'Sécurité',
        subtitle: 'Offense & Défense',
        tools: ['Pentest', 'Metasploit', 'Durcissement Linux', 'MITM', 'Audit', 'Kong Gateway', 'Keycloak SSO'],
      },
      {
        id: 'L3',
        title: 'Supervision',
        subtitle: 'Observabilité & Alerting',
        tools: ['Prometheus', 'Grafana', 'Loki', 'Wazuh', 'Alloy', 'Falco', 'Netdata', 'Blackbox'],
      },
      {
        id: 'L4',
        title: 'Plateforme',
        subtitle: 'Dev & Ops',
        tools: ['Docker · Compose', 'Kubernetes', 'Bash · Python', 'PowerShell', 'Git · CI/CD', 'SQL'],
      },
    ],
  },
  en: {
    chapter: '02',
    label: 'Stack',
    title: 'A',
    titleEm: 'multi-layered',
    titleEnd: 'architecture.',
    desc: "Four strata of expertise — from packet transport to monitoring dashboards. Hover any layer to reveal its tools.",
    layers: [
      {
        id: 'L1',
        title: 'Network',
        subtitle: 'Layer 1–3 · Transport & Routing',
        tools: ['VLAN · 802.1Q', 'OSPF · BGP', 'QoS', 'IPSec · WireGuard', 'Cisco IOS', 'FTTH · GPON'],
      },
      {
        id: 'L2',
        title: 'Security',
        subtitle: 'Offense & Defense',
        tools: ['Pentest', 'Metasploit', 'Linux Hardening', 'MITM', 'Audit', 'Kong Gateway', 'Keycloak SSO'],
      },
      {
        id: 'L3',
        title: 'Observability',
        subtitle: 'Monitoring & Alerting',
        tools: ['Prometheus', 'Grafana', 'Loki', 'Wazuh', 'Alloy', 'Falco', 'Netdata', 'Blackbox'],
      },
      {
        id: 'L4',
        title: 'Platform',
        subtitle: 'Dev & Ops',
        tools: ['Docker · Compose', 'Kubernetes', 'Bash · Python', 'PowerShell', 'Git · CI/CD', 'SQL'],
      },
    ],
  },
};

/* ============================================================
   WORK — projets académiques / professionnels
   ============================================================ */
export type Project = {
  id: string;
  index: string;
  category: string;
  type: string[]; // pour le filtre
  title: string;
  summary: string;
  stack: string[];
  href: string;
};

export const WORK = {
  fr: {
    chapter: '03',
    label: 'Travaux',
    title: 'Modules',
    titleEm: 'opérationnels.',
    desc: "Études de cas livrées pendant mes études. Chaque module ouvre un dossier technique au format PDF.",
    filters: [
      { id: '*',             label: 'Tous' },
      { id: 'security',      label: 'Sécurité' },
      { id: 'network',       label: 'Réseau' },
      { id: 'observability', label: 'Supervision' },
      { id: 'devops',        label: 'DevOps' },
      { id: 'FTTH',          label: 'FTTH' },
    ],
    projects: [
      {
        id: 'observability-stack',
        index: '/01',
        category: 'Supervision',
        type: ['observability', 'devops'],
        title: 'Stack d\'observabilité',
        summary: 'Plateforme Prometheus / Grafana / Loki — monitoring de services, logs centralisés et alerting.',
        stack: ['Prometheus', 'Grafana', 'Loki', 'Docker'],
        href: '/pdfs/Grafana.pdf',
      },
      {
        id: 'campus-hardening',
        index: '/02',
        category: 'Sécurité',
        type: ['security'],
        title: 'Sécurisation campus',
        summary: 'OPNsense, segmentation VLAN, IDS et politiques de filtrage pour environnement de laboratoire.',
        stack: ['OPNsense', 'IDS', 'VLAN'],
        href: '/pdfs/pfsense.pdf',
      },
      {
        id: 'multi-vlan-lab',
        index: '/03',
        category: 'Réseau',
        type: ['network'],
        title: 'Lab routage multi-VLAN',
        summary: 'Topologie 3 switches / 1 routeur, OSPF, DHCP, NAT et inter-VLAN avec accès Internet.',
        stack: ['OSPF', 'DHCP', 'NAT', 'Cisco'],
        href: '/pdfs/SAE_CYBER.pdf',
      },
      {
        id: 'pentest-engagement',
        index: '/04',
        category: 'Offense',
        type: ['security', 'observability'],
        title: 'Pentest contrôlé',
        summary: 'Engagement encadré : reconnaissance, scanning, exploitation et rapport de remédiation.',
        stack: ['Nmap', 'Burp', 'Metasploit', 'Wazuh'],
        href: '/pdfs/ctf.pdf',
      },
      {
        id: 'iot-pycom',
        index: '/05',
        category: 'IoT',
        type: ['devops'],
        title: 'IoT Pycom',
        summary: 'Modules Pycom instrumentés en télémétrie, exposés via Docker Compose et visualisés sous Grafana.',
        stack: ['Pycom', 'Docker', 'Grafana'],
        href: '/pdfs/IOT.pdf',
      },
      {
        id: 'security-policies',
        index: '/06',
        category: 'Politique',
        type: ['network', 'security'],
        title: 'Politiques Stormshield',
        summary: 'Conception d\'un jeu de règles : NAT, objets réseau, journalisation et durcissement.',
        stack: ['Stormshield', 'ACL', 'NAT'],
        href: '/pdfs/NAT.pdf',
      },
      {
        id: 'ftth-deployment',
        index: '/07',
        category: 'FTTH',
        type: ['FTTH'],
        title: 'Déploiement FTTH',
        summary: 'Conception et analyse théorique d\'un réseau Fibre to the Home en architecture GPON.',
        stack: ['Fibre', 'GPON', 'Splitter'],
        href: '/pdfs/fo.pdf',
      },
      {
        id: 'nodejs-app',
        index: '/08',
        category: 'Application',
        type: ['devops'],
        title: 'Application Node.js',
        summary: 'Développement et déploiement d\'une application Node.js avec backend sécurisé.',
        stack: ['Node.js', 'Express', 'Auth'],
        href: '/pdfs/harmely.pdf',
      },
      {
        id: 'parking-reunion',
        index: '/09',
        category: 'Smart City',
        type: ['network'],
        title: 'Parking payant — La Réunion',
        summary: 'Système de gestion de parkings : attribution des places, contrôle des paiements et supervision.',
        stack: ['Réseau', 'Backend', 'API'],
        href: '/pdfs/storm.pdf',
      },
    ] as Project[],
  },
  en: {
    chapter: '03',
    label: 'Work',
    title: 'Operational',
    titleEm: 'modules.',
    desc: "Case studies delivered during my studies and apprenticeship. Each module opens a technical PDF dossier.",
    filters: [
      { id: '*',             label: 'All' },
      { id: 'security',      label: 'Security' },
      { id: 'network',       label: 'Network' },
      { id: 'observability', label: 'Observability' },
      { id: 'devops',        label: 'DevOps' },
      { id: 'FTTH',          label: 'FTTH' },
    ],
    projects: [
      {
        id: 'observability-stack',
        index: '/01',
        category: 'Observability',
        type: ['observability', 'devops'],
        title: 'Observability stack',
        summary: 'Prometheus / Grafana / Loki platform — service monitoring, centralized logging and alerting.',
        stack: ['Prometheus', 'Grafana', 'Loki', 'Docker'],
        href: '/pdfs/Grafana.pdf',
      },
      {
        id: 'campus-hardening',
        index: '/02',
        category: 'Security',
        type: ['security'],
        title: 'Campus hardening',
        summary: 'OPNsense, VLAN segmentation, IDS and filtering policies for a lab environment.',
        stack: ['OPNsense', 'IDS', 'VLAN'],
        href: '/pdfs/pfsense.pdf',
      },
      {
        id: 'multi-vlan-lab',
        index: '/03',
        category: 'Network',
        type: ['network'],
        title: 'Multi-VLAN routing lab',
        summary: 'Topology with 3 switches / 1 router, OSPF, DHCP, NAT and inter-VLAN with Internet access.',
        stack: ['OSPF', 'DHCP', 'NAT', 'Cisco'],
        href: '/pdfs/SAE_CYBER.pdf',
      },
      {
        id: 'pentest-engagement',
        index: '/04',
        category: 'Offense',
        type: ['security', 'observability'],
        title: 'Controlled pentest',
        summary: 'Guided engagement: reconnaissance, scanning, exploitation and remediation report.',
        stack: ['Nmap', 'Burp', 'Metasploit', 'Wazuh'],
        href: '/pdfs/ctf.pdf',
      },
      {
        id: 'iot-pycom',
        index: '/05',
        category: 'IoT',
        type: ['devops'],
        title: 'Pycom IoT',
        summary: 'Pycom modules instrumented for telemetry, exposed via Docker Compose and visualized in Grafana.',
        stack: ['Pycom', 'Docker', 'Grafana'],
        href: '/pdfs/IOT.pdf',
      },
      {
        id: 'security-policies',
        index: '/06',
        category: 'Policy',
        type: ['network', 'security'],
        title: 'Stormshield policies',
        summary: 'Designing a rule set: NAT, network objects, logging and hardening.',
        stack: ['Stormshield', 'ACL', 'NAT'],
        href: '/pdfs/NAT.pdf',
      },
      {
        id: 'ftth-deployment',
        index: '/07',
        category: 'FTTH',
        type: ['FTTH'],
        title: 'FTTH deployment',
        summary: 'Theoretical design and analysis of a Fiber to the Home network in GPON architecture.',
        stack: ['Fiber', 'GPON', 'Splitter'],
        href: '/pdfs/fo.pdf',
      },
      {
        id: 'nodejs-app',
        index: '/08',
        category: 'Application',
        type: ['devops'],
        title: 'Node.js application',
        summary: 'Development and deployment of a Node.js application with secured backend.',
        stack: ['Node.js', 'Express', 'Auth'],
        href: '/pdfs/harmely.pdf',
      },
      {
        id: 'parking-reunion',
        index: '/09',
        category: 'Smart City',
        type: ['network'],
        title: 'Paid parking — Réunion',
        summary: 'Parking management system: slot allocation, payment control and supervision.',
        stack: ['Network', 'Backend', 'API'],
        href: '/pdfs/storm.pdf',
      },
    ] as Project[],
  },
};

/* ============================================================
   RESEARCH — projets perso (red team, recherche offensive)
   ============================================================ */
export const RESEARCH = {
  fr: {
    chapter: '04',
    label: 'Recherche',
    title: 'Laboratoire',
    titleEm: 'offensif.',
    desc: "Explorations hors cursus, conduites en environnement isolé à des fins d'apprentissage et de sensibilisation.",
    items: [
      {
        id: 'masquerade-nim',
        index: '/R01',
        kind: 'Red Team',
        title: 'Masquerade · Implant Nim',
        summary:
          "Adaptation d'un projet open-source de masquerading PE, intégration d'un reverse shell développé en Nim et d'un module Python de capture webcam. Démonstration pédagogique pour la JPO 2026 de l'IUT de La Réunion.",
        stack: ['Nim', 'Python', 'Spearphishing', 'Awareness'],
        status: 'Livré',
        href: '/pdfs/nim_implant.pdf',
      },
      {
        id: 'placeholder-1',
        index: '/R02',
        kind: 'À venir',
        title: 'Recherche en cours',
        summary: "Prochaine exploration en environnement contrôlé.",
        stack: [],
        status: 'Planifié',
        href: '#',
      },
      {
        id: 'placeholder-2',
        index: '/R03',
        kind: 'À venir',
        title: 'Recherche en cours',
        summary: "Prochaine exploration en environnement contrôlé.",
        stack: [],
        status: 'Planifié',
        href: '#',
      },
    ],
  },
  en: {
    chapter: '04',
    label: 'Research',
    title: 'Offensive',
    titleEm: 'lab.',
    desc: "Off-curriculum explorations, conducted in isolated environments for learning and awareness purposes.",
    items: [
      {
        id: 'masquerade-nim',
        index: '/R01',
        kind: 'Red Team',
        title: 'Masquerade · Nim implant',
        summary:
          "Adaptation of an open-source PE-masquerading project, integration of a Nim-coded reverse shell and a Python webcam-capture module. Educational demonstration for the IUT Réunion 2026 open day.",
        stack: ['Nim', 'Python', 'Spearphishing', 'Awareness'],
        status: 'Shipped',
        href: '/pdfs/nim_implant.pdf',
      },
      {
        id: 'placeholder-1',
        index: '/R02',
        kind: 'Coming',
        title: 'Ongoing research',
        summary: "Next exploration in a controlled environment.",
        stack: [],
        status: 'Planned',
        href: '#',
      },
      {
        id: 'placeholder-2',
        index: '/R03',
        kind: 'Coming',
        title: 'Ongoing research',
        summary: "Next exploration in a controlled environment.",
        stack: [],
        status: 'Planned',
        href: '#',
      },
    ],
  },
};

/* ============================================================
   TRAJECTORY — expériences pro
   ============================================================ */
export const TRAJECTORY = {
  fr: {
    chapter: '05',
    label: 'Trajectoire',
    title: 'Du support',
    titleEm: 'à la production.',
    desc: "Stages en alternance — montée en compétence depuis le terrain utilisateur jusqu'à la mise en production de plateformes.",
    items: [
      {
        year: '2025',
        kind: 'Stage',
        role: 'Technicien Informatique',
        org: 'Fondation Père Favron · La Réunion',
        bullets: [
          'Support technique N1/N2 sur parc multi-sites',
          'Administration Active Directory, GLPI, Microsoft 365',
          'Audit cybersécurité et diagnostic réseau Cisco',
        ],
      },
      {
        year: '2026',
        kind: 'Stage',
        role: 'Admin système · Infrastructure & Cybersécurité',
        org: 'En cours',
        bullets: [
          'Déploiement d\'un cluster Kubernetes supervisé sous Grafana',
          'Mise en place d\'une API Gateway Kong avec SSO Keycloak',
          'Durcissement et sécurisation transverse de la plateforme',
        ],
      },
    ],
  },
  en: {
    chapter: '05',
    label: 'Trajectory',
    title: 'From support',
    titleEm: 'to production.',
    desc: "Apprenticeship internships — ramping up from end-user support to platform deployment.",
    items: [
      {
        year: '2025',
        kind: 'Internship',
        role: 'IT Technician',
        org: 'Fondation Père Favron · Réunion',
        bullets: [
          'N1/N2 technical support across multi-site fleet',
          'Active Directory, GLPI, Microsoft 365 administration',
          'Cybersecurity audit and Cisco network diagnosis',
        ],
      },
      {
        year: '2026',
        kind: 'Internship',
        role: 'System admin · Infrastructure & Security',
        org: 'In progress',
        bullets: [
          'Kubernetes cluster deployment supervised through Grafana',
          'Kong API Gateway implementation with Keycloak SSO',
          'Cross-platform hardening and security',
        ],
      },
    ],
  },
};

/* ============================================================
   CONTACT
   ============================================================ */
export const CONTACT = {
  fr: {
    chapter: '06',
    label: 'Contact',
    title: 'Ouvrir',
    titleEm: 'un canal.',
    desc: "Pour une opportunité, une question technique ou une collaboration — la connexion est ouverte.",
    formspree: 'https://formspree.io/f/xqaybwgn',
    fields: { name: 'Votre nom', email: 'Email', subject: 'Sujet', message: 'Votre message', send: 'Transmettre' },
    sending: 'Transmission…',
    sent: 'Message reçu. Réponse sous 48h.',
    error: 'Erreur de transmission. Réessayez.',
    side: {
      label: 'Liens directs',
      desc: 'Réponse sous 48h ouvrées. Disponible pour échanger sur infrastructure, cybersécurité et réseaux.',
    },
  },
  en: {
    chapter: '06',
    label: 'Contact',
    title: 'Open',
    titleEm: 'a channel.',
    desc: "For an opportunity, a technical question or a collaboration — the connection is open.",
    formspree: 'https://formspree.io/f/xqaybwgn',
    fields: { name: 'Your name', email: 'Email', subject: 'Subject', message: 'Your message', send: 'Transmit' },
    sending: 'Transmitting…',
    sent: 'Message received. Reply within 48h.',
    error: 'Transmission error. Please retry.',
    side: {
      label: 'Direct links',
      desc: 'Reply within 48 business hours. Available to discuss infrastructure, cybersecurity and networking.',
    },
  },
};

/* ============================================================
   FOOTER
   ============================================================ */
export const FOOTER = {
  fr: {
    copy: '© 2026 — Kylian Honorine · Réseaux & Cybersécurité',
    status: 'Tous systèmes opérationnels',
  },
  en: {
    copy: '© 2026 — Kylian Honorine · Networking & Cybersecurity',
    status: 'All systems operational',
  },
};

/* ============================================================
   INTRO (loader)
   ============================================================ */
export const INTRO = {
  fr: {
    init: '[ initialisation du système ]',
    role: 'Réseau · Sécurité · Infrastructure',
  },
  en: {
    init: '[ system initializing ]',
    role: 'Network · Security · Infrastructure',
  },
};
