# Kylian Honorine — Portfolio (Next.js)

Portfolio premium construit comme une expérience immersive multi-couches : intro cinématique, scène 3D WebGL en arrière-plan, scroll cinématique avec parallaxe, transitions de plan entre sections.

---

## Stack technique

- **Next.js 14** (App Router, static export → déployable partout en gratuit)
- **TypeScript** strict
- **Tailwind CSS** avec design tokens custom (depth, signal colors)
- **Framer Motion** pour les animations React
- **GSAP** disponible (peut être ajouté pour les timelines complexes)
- **Lenis** pour le smooth scroll cinématique
- **@react-three/fiber + Three.js** pour la scène 3D de fond (Network constellation animée en couches)

---

## Démarrage

```bash
npm install
npm run dev          # http://localhost:3000
```

## Build production

```bash
npm run build        # génère ./out/ (static export)
```

Le dossier `out/` est un site statique pur, prêt à uploader où tu veux.

---

## Déploiement gratuit

### Option 1 — Vercel (recommandé pour Next.js)

```bash
npm install -g vercel
vercel
```

Suis les instructions. Domaine `*.vercel.app` gratuit, SSL inclus, déploiement automatique à chaque push si tu connectes le repo Git.

### Option 2 — Netlify

```bash
npm install -g netlify-cli
npm run build
netlify deploy --dir=out --prod
```

### Option 3 — GitHub Pages

1. Décommente la ligne `basePath` dans `next.config.js` si tu déploies dans un sous-chemin (ex: `/portfolio`)
2. `npm run build`
3. Push le contenu de `out/` sur la branche `gh-pages`

```bash
npm run build
# Crée un .nojekyll pour GH Pages
touch out/.nojekyll
# Puis push out/ sur gh-pages (ex avec gh-pages package)
```

---

## Architecture des fichiers

```
.
├── app/
│   ├── layout.tsx              # Layout racine + chargement fonts (Fraunces, Inter Tight, JetBrains Mono)
│   ├── page.tsx                # Point d'entrée (importe Shell)
│   └── globals.css             # Tokens CSS, utilities Tailwind, reset
│
├── components/
│   ├── layout/
│   │   ├── Shell.tsx           # Orchestrateur — Lenis, Intro, sections, footer
│   │   ├── Intro.tsx           # Entrée cinématique (loader 2.2s)
│   │   ├── Header.tsx          # Nav fixe + lang switch
│   │   └── Footer.tsx          # Footer minimaliste
│   │
│   ├── effects/
│   │   ├── GrainOverlay.tsx    # Noise SVG full-screen
│   │   ├── ScrollProgress.tsx  # Barre de progression top
│   │   └── CursorBeacon.tsx    # Soft glow qui suit le curseur (desktop)
│   │
│   ├── three/
│   │   └── SceneBackground.tsx # Scène 3D : grille loin + constellation réseau + particules
│   │                            # Caméra recule au scroll → effet "traversée"
│   │
│   ├── sections/
│   │   ├── Hero.tsx            # 01 · Identité, dashboard live, CTA, scroll hint
│   │   ├── Profile.tsx         # 02 · À propos narratif, chips
│   │   ├── Stack.tsx           # 03 · Couches OSI-style, parallaxe Z
│   │   ├── Work.tsx            # 04 · 9 projets, filtres animés, tilt 3D
│   │   ├── Research.tsx        # 05 · Projets perso (red team)
│   │   ├── Trajectory.tsx      # 06 · Timeline expériences
│   │   ├── Contact.tsx         # 07 · Form + liens directs
│   │   └── hero/
│   │       └── LiveConsole.tsx # Dashboard live (topology + sparklines + terminal)
│   │
│   └── ui/
│       ├── SectionShell.tsx    # Wrapper section avec perspective
│       ├── SectionTitle.tsx    # Titre standardisé (chapitre, label, em italic)
│       └── Reveal.tsx          # Wrapper pour animations au scroll
│
├── lib/
│   ├── content.ts              # **TOUTES les données FR/EN** — édite ici pour modifier le texte
│   ├── i18n.tsx                # Provider de langue (localStorage + détection navigateur)
│   └── hooks.ts                # useReducedMotion, useIsMobile, useIsDesktop
│
├── public/
│   ├── CV.html                 # Le CV (servi statique)
│   ├── favicon.svg             # Icône
│   └── pdfs/                   # Tous tes dossiers techniques
│       ├── Grafana.pdf
│       ├── pfsense.pdf
│       ├── SAE_CYBER.pdf
│       ├── ctf.pdf
│       ├── IOT.pdf
│       ├── NAT.pdf
│       ├── fo.pdf
│       ├── harmely.pdf
│       └── storm.pdf
│       (à ajouter : nim_implant.pdf)
│
├── next.config.js              # Static export activé
├── tailwind.config.ts          # Design system (depth, signal, fonts)
├── tsconfig.json
└── package.json
```

---

## Modifier le contenu

**100% du texte est centralisé dans `lib/content.ts`**. Pas besoin de toucher aux composants pour mettre à jour :
- titres et baselines
- 9 projets (titre, résumé, stack, lien PDF, catégorie de filtre)
- 4 couches de stack technique
- expériences pro
- chips, paragraphes À propos
- formulaire (placeholders, messages)
- footer

Chaque clé existe en `fr` et `en`. Pour rendre le portfolio monolingue, supprime simplement le bouton dans `Header.tsx` et utilise `'fr'` partout.

---

## Mécanique cinématique (récap)

### Intro (0–2.2s)
- Fond noir absolu
- Grille technique qui se déploie depuis le centre (`scale 1.8 → 1`)
- "[ initialisation du système ]" → nom (gradient italique, blur → net) → rôle → barre lumineuse
- Fade out vers le hero

### Scroll cinématique
- **Lenis** prend en charge le smooth scroll natif (lerp 0.1)
- **Camera 3D recule** progressivement au scroll (z: 8 → 14, rotation X tilt)
- **Parallaxe différentielle** : grille fond / aurora / texte hero / console card → 4 vitesses différentes
- **Sections** apparaissent avec blur + translation Y, en cascade

### Profondeur (multi-couches)
1. **WebGL Canvas** (-z-30) : grille étendue → constellation réseau → particules
2. **Tech grid CSS** (-z-20) : grille technique fine en mask radial
3. **Cursor beacon** (-z-5) : glow qui suit le curseur en mix-blend
4. **Vignette** (-z-10) : assombrit les bords
5. **Grain noise** (-z-10) : texture filmique

### Micro-interactions
- **Cards projets** : tilt 3D (rotateX/Y selon position souris) + spotlight radial
- **Filtres** : pill animée avec `layoutId` Framer
- **Boutons CTA** : barre lumineuse qui traverse au hover
- **Sections** : underline accent qui se trace
- **Compteurs** : animations easeOutCubic (déjà présents dans la version 1, peuvent être réintégrés)

---

## Performance

- **Mobile** (<640px) : la scène 3D WebGL est désactivée, parallaxe limitée
- **`prefers-reduced-motion: reduce`** : intro skipée, animations désactivées globalement, Lenis désactivé
- **Static export** : pas de serveur Node, juste du HTML/CSS/JS → CDN-friendly
- **Fonts** : Google Fonts via `next/font` → préchargement optimisé, pas de FOUT
- **Lazy loading** : la scène Three.js est chargée en `lazy()` après l'intro pour ne pas bloquer le first paint

---

## Personnalisation rapide

### Changer la palette
`tailwind.config.ts` → section `colors.signal` (primary / mint / plum / coral)

### Changer les fonts
`app/layout.tsx` → swap les imports de `next/font/google`

### Ajuster la durée de l'intro
`components/layout/Intro.tsx` → variables `t1`, `t2`, `t3`

### Désactiver la 3D
Dans `components/layout/Shell.tsx`, commente `<SceneBackground />`

### Ajouter un projet
`lib/content.ts` → array `WORK.fr.projects` (et `WORK.en.projects`). Le filtre se base sur le tableau `type`.

---

## TODO côté Kylian

- [ ] Rédiger `public/pdfs/nim_implant.pdf` (le projet Masquerade Nim — je peux te le générer quand tu veux)
- [ ] Vérifier le formspree ID dans `lib/content.ts` (`xqaybwgn` — c'est bien le tien ?)
- [ ] Tester en local : `npm install && npm run dev`
- [ ] Décider de l'hébergement (Vercel = le plus simple)
- [ ] (Optionnel) Ajouter une section blog si tu veux écrire des articles techniques

---

## Crédits design

Design system custom — typographie : **Fraunces** (display), **Inter Tight** (UI), **JetBrains Mono** (data/code). Aucun template utilisé.
