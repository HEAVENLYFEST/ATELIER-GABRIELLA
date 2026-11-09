import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { DEFAULT_IMAGE, SITE_NAME, SITE_URL, fullTitle, seoPages } from './src/seo.js'

const escapeAttr = value => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: `${SITE_URL}/`,
      name: SITE_NAME,
      inLanguage: 'fr-FR',
    },
    {
      '@type': 'LocalBusiness',
      '@id': `${SITE_URL}/#business`,
      name: SITE_NAME,
      description: seoPages.accueil.description,
      url: `${SITE_URL}/`,
      image: DEFAULT_IMAGE,
      logo: DEFAULT_IMAGE,
      email: 'ateliergabriella.contact@gmail.com',
      areaServed: { '@type': 'AdministrativeArea', name: 'Île-de-France' },
      knowsAbout: ['Décoration de mariage', 'Scénographie d’événements', 'Décoration d’événements'],
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '10:00',
        closes: '19:00',
      },
      sameAs: [
        'https://www.instagram.com/ateliergabrielladesigner',
        'https://www.tiktok.com/@ateliergabrielladesigner',
        'https://pin.it/EfbX32Jfs',
      ],
    },
  ],
}

const headTags = page => {
  const title = escapeAttr(fullTitle(page.title))
  const description = escapeAttr(page.description)
  const url = `${SITE_URL}${page.path}`
  return [
    `<title>${title}</title>`,
    `<meta name="description" content="${description}" />`,
    `<meta name="robots" content="${page.noindex ? 'noindex, nofollow' : 'index, follow'}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:site_name" content="${SITE_NAME}" />`,
    '<meta property="og:type" content="website" />',
    '<meta property="og:locale" content="fr_FR" />',
    `<meta property="og:title" content="${title}" />`,
    `<meta property="og:description" content="${description}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${DEFAULT_IMAGE}" />`,
    '<meta property="og:image:width" content="1000" />',
    '<meta property="og:image:height" content="520" />',
    `<meta property="og:image:alt" content="${SITE_NAME}, décoratrice d’événements" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${title}" />`,
    `<meta name="twitter:description" content="${description}" />`,
    `<meta name="twitter:image" content="${DEFAULT_IMAGE}" />`,
  ].join('\n    ')
}

const pageHtml = (template, page) => template.replace('<!--seo-->', headTags(page))

// Génère une page HTML par route (balises SEO propres à chaque page) et le sitemap.
function seoPrerender() {
  let outDir
  return {
    name: 'seo-prerender',
    configResolved(config) { outDir = config.build.outDir },
    transformIndexHtml: {
      order: 'pre',
      handler: html => html.replace('<!--structured-data-->', `<script type="application/ld+json">${JSON.stringify(structuredData)}</script>`),
    },
    async closeBundle() {
      if (!outDir) return
      const indexPath = join(outDir, 'index.html')
      const template = await readFile(indexPath, 'utf8').catch(() => null)
      if (!template?.includes('<!--seo-->')) return

      const pages = Object.values(seoPages)
      for (const page of pages) {
        if (page.path === '/') continue
        await writeFile(join(outDir, `${page.path.slice(1)}.html`), pageHtml(template, page))
      }
      await writeFile(indexPath, pageHtml(template, seoPages.accueil))

      const lastmod = new Date().toISOString().slice(0, 10)
      const urls = pages.filter(page => !page.noindex).map(page => `  <url>\n    <loc>${SITE_URL}${page.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`)
      await writeFile(join(outDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), seoPrerender()],
})
