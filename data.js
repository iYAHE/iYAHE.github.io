/* Single source for the portfolio: lines (skills), stations (projects), ride order, service record. */
window.PORTFOLIO = {
  person: {
    name: 'Yasser Abouelhassan',
    email: 'yassereissa1308@gmail.com',
    github: 'https://github.com/iYAHE',
  },

  lines: {
    W: {
      name: 'Web',
      tech: 'Next.js 15 and 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Motion, three.js, Leaflet',
    },
    M: {
      name: 'Mobile',
      tech: 'React Native, Expo SDK 54 to 58, Expo Router, Reanimated, NFC, EAS updates',
    },
    D: {
      name: 'Data',
      tech: 'PostgreSQL, Prisma, Supabase (Auth, row-level security, Realtime, PostGIS, edge functions), SQLite, Redis, Payload CMS',
    },
    C: {
      name: 'Commerce',
      tech: 'Paymob checkout with signed webhooks, deposits and installments, ledgers and wallets, Shopify Liquid',
    },
    A: {
      name: 'AI and media',
      tech: 'Anthropic API assistant with tools, Remotion programmatic video, ElevenLabs voice',
    },
    J: {
      name: 'Joint service',
      tech: 'Team projects for agency clients in the United States, built with a partner developer. Shopify, Next.js, Payload CMS.',
    },
  },

  stations: [
    {
      id: 'skyland', name: 'Sky Land', full: 'Sky Land Developments',
      kind: 'Real-estate landing site', role: 'Sole developer', when: '2026', status: 'Live',
      url: 'https://skylandeg.com', lines: ['W'],
      summary: 'Bilingual site for a developer selling VIVID, a villa compound in New Zayed, moved off an old PHP landing page.',
      points: [
        'English and Arabic (RTL) with separate root layouts per language.',
        'Structured data for the organisation and the project, sitemap and robots.',
        'Keyword research for the Egyptian market behind the page plan.',
      ],
      stack: ['Next.js 16', 'React 19', 'JSON-LD'],
      stats: [],
    },
    {
      id: 'flamingo', name: 'FlamingoAtlas', full: 'FlamingoAtlas',
      kind: 'Game companion site in 6 languages', role: 'Sole developer', when: '2026 to now', status: 'Live',
      url: 'https://flamingoatlas.com', lines: ['W', 'A'],
      summary: 'An unofficial launch guide: prices by country, store unlock times and editions, with every fact tagged by source.',
      points: [
        '40 routes in each of 6 languages, including Arabic, with hreflang and locale rewrites.',
        'Web Push and double opt-in email alerts driven by a scheduler.',
        'A video pipeline renders short clips in 6 languages from the site\'s own data.',
      ],
      stack: ['Next.js 16', 'TypeScript', 'SQLite', 'Web Push', 'Nodemailer', 'Remotion'],
      stats: [['6', 'languages'], ['63', 'countries priced'], ['90', 'tests']],
    },
    {
      id: 'video', name: 'Video Studio', full: 'Programmatic video studio',
      kind: 'Data-driven video pipelines', role: 'Sole developer', when: '2026', status: 'In use',
      url: '', lines: ['A'],
      summary: 'Code that turns data and scripts into finished vertical videos, so marketing content ships like software.',
      points: [
        '31 rendered Arabic videos for ElMasareef: 9 marketing stories and 22 character stories.',
        'Schema-checked compositions with a caption syntax for highlights and line breaks.',
        'Egyptian Arabic voice-over generated per character through ElevenLabs.',
      ],
      stack: ['Remotion 4', 'React 19', 'Zod', 'ElevenLabs', 'Node scripts'],
      stats: [['31', 'videos for one brand'], ['1080×1920', '30 fps']],
    },
    {
      id: 'masareef', name: 'ElMasareef', full: 'ElMasareef',
      kind: 'School and university fee guide for Egypt', role: 'Sole developer', when: '2026 to now', status: 'Live',
      url: 'https://elmasareef.com', lines: ['W', 'A'],
      summary: 'An Arabic-first directory that lets parents compare private school and university fees, with sourced data.',
      points: [
        'Clustered campus map, near-me search that keeps location in the browser, and side-by-side compare.',
        'Programmatic SEO pages by area, school type and faculty.',
        'Admin CMS for institutions and fee sources, leads synced to Google Sheets, review and forum moderation.',
      ],
      stack: ['Next.js 16', 'TypeScript', 'SQLite', 'Leaflet', 'Search Console API', 'Docker'],
      stats: [['486', 'schools'], ['66', 'universities'], ['113', 'tests']],
    },
    {
      id: 'reponelle', name: 'Reponelle', full: 'Reponelle',
      kind: 'Online invitation maker with RSVP', role: 'Sole developer', when: '2026 to now', status: 'Live',
      url: 'https://reponelle.com', lines: ['W', 'D'],
      summary: 'A SaaS where a host picks a design, builds an event and sends every guest a personal link.',
      points: [
        '77 designs and 12 locales including Arabic RTL, with localised email series.',
        'Guest RSVP, animated invitation, countdown and calendar files.',
        'Admin dashboard: funnel, countries, RSVP analytics, an IMAP inbox and newsletters.',
      ],
      stack: ['Next.js 15', 'React 19', 'PostgreSQL', 'OAuth', 'Nodemailer', 'Docker'],
      stats: [['12', 'languages'], ['77', 'designs'], ['290', 'tests']],
    },
    {
      id: 'khashab', name: 'Khashab', full: 'Khashab Furniture',
      kind: 'E-commerce and ERP platform', role: 'Sole developer', when: '2025 to now', status: 'Live',
      url: 'https://khashabfurniture.com', lines: ['W', 'M', 'D', 'C', 'A'],
      summary: 'The whole software side of a custom-furniture maker in Cairo: store, checkout, customer portal and the staff back office.',
      points: [
        'Replaced a WordPress and WooCommerce store with a bilingual catalogue of about 208 products. Live since 4 October 2026.',
        'Paymob deposit checkout, a portal that tracks custom orders through 7 production stages, and a 3D cabinet designer with price estimates.',
        'Finance module for contracts, installments and ledgers, plus an AI shopping assistant that answers from the live catalogue.',
      ],
      stack: ['Next.js 16', 'TypeScript', 'PostgreSQL', 'Prisma', 'Payload CMS', 'Paymob', 'three.js', 'Anthropic API', 'Expo', 'Docker'],
      stats: [['54', 'data models'], ['818', 'tests'], ['106', 'merged PRs'], ['~10 min', 'merge to live']],
    },
    {
      id: 'qready', name: 'QReady', full: 'QReady',
      kind: 'QR and NFC replacement for restaurant pagers', role: 'Sole developer', when: '2026', status: 'Prototype',
      url: '', lines: ['W', 'M'],
      summary: 'Customers scan a code or tap a tag, enter their order number and get a push alert when the food is ready.',
      points: [
        'Live order board over Server-Sent Events.',
        'Per-order PWA manifests so Home Screen push works on iOS.',
        'Staff app in Expo that writes NFC tags.',
      ],
      stack: ['Next.js 16', 'SQLite', 'Web Push', 'SSE', 'Expo', 'NFC'],
      stats: [],
    },
    {
      id: 'sanad', name: 'Sanad', full: 'Sanad',
      kind: 'Tow-truck marketplace for Egypt', role: 'Sole developer', when: '2026', status: 'Pre-launch',
      url: '', lines: ['W', 'M', 'D', 'C'],
      summary: 'A customer app, a driver app and an operations dashboard in one monorepo, on a Supabase back end.',
      points: [
        'Dispatches jobs to drivers in waves with PostGIS and atomic offer matching.',
        'Live tracking, PIN hand-over and condition photos.',
        'Server-side quotes, an append-only ledger, wallets and settlements.',
      ],
      stack: ['Turborepo', 'Expo', 'React Native', 'Next.js 16', 'Supabase', 'PostGIS', 'Paymob', 'Vitest'],
      stats: [['3', 'apps'], ['~65', 'tables'], ['222', 'tests']],
    },
    {
      id: 'rolex', name: 'Date & Time', full: 'Date & Time, Official Rolex Retailer',
      kind: 'Rolex section on a Shopify store', role: 'Contributor (team)', when: '2022 to 2026', status: 'Live',
      url: 'https://dateandtimema.com', lines: ['C', 'J'],
      summary: 'The Rolex area of a Massachusetts jeweller\'s Shopify store, built to Rolex\'s brand guidelines with a partner developer.',
      points: [
        '17 Rolex sections and about 40 templates across the model families.',
        'Geofenced pricing and price filters.',
        '66 of my commits over 13 months.',
      ],
      stack: ['Shopify', 'Liquid', 'JavaScript'],
      stats: [],
    },
    {
      id: 'cosc', name: 'COSC', full: 'Comprehensive Orthopedic & Spine Care',
      kind: 'Medical practice site, Joomla to Next.js', role: 'Contributor (team)', when: '2026', status: 'Staging',
      url: '', lines: ['J'],
      summary: 'A New York and New Jersey surgical practice moved from Joomla to Next.js and Payload CMS.',
      points: [
        '441 legacy URLs preserved through a redirect map.',
        'I reviewed and merged the client content changes.',
      ],
      stack: ['Next.js 16', 'Payload CMS 3', 'PostgreSQL'],
      stats: [],
    },
    {
      id: 'ent', name: 'ENT Specialists', full: 'ENT Specialists',
      kind: 'Medical practice site, Wix to Next.js', role: 'Contributor (team)', when: '2026', status: 'Team project',
      url: '', lines: ['J'],
      summary: 'A four-office Massachusetts ENT practice rebuilt from Wix, with a blog on headless Payload CMS.',
      points: [
        '23 provider profiles, 17 service pages and 199 redirects for the cutover.',
        'Built with a partner developer.',
      ],
      stack: ['Next.js 16', 'Tailwind CSS 4', 'Payload CMS'],
      stats: [],
    },
    {
      id: 'execusource', name: 'ExecuSource', full: 'ExecuSource',
      kind: 'Recruiting firm site, WordPress to Next.js', role: 'Contributor (team)', when: '2026', status: 'Live',
      url: 'https://execusource.com', lines: ['J'],
      summary: 'An Atlanta staffing firm\'s site rebuilt from WordPress, with its job board rendered on the server.',
      points: [
        'About 192 open jobs read from Bullhorn and rendered where search engines can see them.',
        'Built with a partner developer.',
      ],
      stack: ['Next.js 16', 'TypeScript', 'Bullhorn API'],
      stats: [],
    },
    {
      id: 'pri', name: 'PRI Technology', full: 'PRI Technology',
      kind: 'IT staffing site on Payload CMS', role: 'Contributor (team)', when: '2026', status: 'Team project',
      url: '', lines: ['J'],
      summary: 'A New York IT staffing firm\'s site with live job listings from a JobDiva feed.',
      points: [
        'Staffing and advisory sub-sites with a switchable theme system.',
        'Built with a partner developer.',
      ],
      stack: ['Next.js 16', 'Payload CMS 3', 'JobDiva'],
      stats: [],
    },
  ],

  /* The ride: solo builds in the order the train calls at them, then the team projects. */
  ride: ['khashab', 'reponelle', 'masareef', 'flamingo', 'sanad', 'qready', 'skyland', 'video'],
  joint: ['rolex', 'cosc', 'ent', 'execusource', 'pri'],

  depot: [
    ['Deploy', 'Docker, Coolify on a VPS, GitHub Actions to GHCR, Cloudflare R2 and Turnstile'],
    ['Test', 'Node test runner, Vitest, in-process Postgres with PGlite, ESLint'],
    ['Search', 'hreflang, JSON-LD, redirect maps, programmatic pages, IndexNow, GA4, Search Console API'],
    ['Languages', 'Arabic RTL and English by default, sites in up to 12 locales'],
    ['Workflow', 'Pull requests with CI on every merge, AI-assisted development with Claude Code and Codex'],
  ],

  record: [
    ['2020', 'Internship at Netways on camera apps built on an object detector.'],
    ['2021', 'B.Sc. in Computer Science, American University of Sharjah.'],
    ['2022', 'Freelance work starts with the Rolex section for Date & Time (Shopify).'],
    ['2023 to 2024', 'Military service.'],
    ['2025', 'Joined Khashab Furniture and built its first website.'],
    ['Oct 2025', 'Khashab admin panel in PHP, issuing bilingual PDF job orders.'],
    ['Apr 2026', 'Khashab admin app in Expo for customers, orders and transactions.'],
    ['Jun 2026', 'Agency rebuilds start: ENT Specialists and ExecuSource, then PRI Technology and COSC.'],
    ['Sep 2026', 'Khashab rebuild on Next.js begins. Reponelle, Sky Land and Sanad start the same month.'],
    ['4 Oct 2026', 'Khashab goes live. Paymob checkout, the AI assistant and the finance module follow within two weeks.'],
    ['Oct 2026', 'First commits on ElMasareef and FlamingoAtlas. QReady prototype.'],
  ],
};
