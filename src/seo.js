// Source unique du SEO : utilisée par les pages (<Seo />) et par le build (pages HTML pré-générées).
export const SITE_URL = 'https://www.ateliergabrielladesigner.com'
export const SITE_NAME = 'Atelier Gabriella'
export const DEFAULT_IMAGE = `${SITE_URL}/logo-navbar.png`

export const seoPages = {
  accueil: {
    path: '/',
    title: 'Décoration de mariage en Île-de-France',
    description: 'Atelier Gabriella, décoratrice et scénographe de mariages et d’événements en Île-de-France. Des décors sur-mesure, chics et raffinés, à votre image.',
  },
  aPropos: {
    path: '/a-propos',
    title: 'À propos · Décoratrice d’événements',
    description: 'Découvrez Gabriella, décoratrice et scénographe d’événements en Île-de-France, et son savoir-faire pour des décors de mariage élégants et intemporels.',
  },
  prestations: {
    path: '/prestations',
    title: 'Formules de décoration de mariage',
    description: 'Trois formules de décoration et de scénographie sur-mesure pour votre mariage ou votre événement : Essentielle, Confort et Signature. Île-de-France.',
  },
  contact: {
    path: '/contact',
    title: 'Contact & Rendez-vous',
    description: 'Contactez l’Atelier Gabriella pour votre projet de décoration de mariage ou d’événement et réservez votre rendez-vous en ligne, en Île-de-France.',
  },
  admin: {
    path: '/admin',
    title: 'Administration',
    description: 'Espace privé de gestion des rendez-vous.',
    noindex: true,
  },
  notFound: {
    path: '/404',
    title: 'Page introuvable',
    description: 'Cette page n’existe pas ou a été déplacée.',
    noindex: true,
  },
}

export const fullTitle = title => `${title} | ${SITE_NAME}`
