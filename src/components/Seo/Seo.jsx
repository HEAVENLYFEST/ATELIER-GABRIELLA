import { useEffect } from 'react'

const SITE_URL = 'https://ateliergabrielladesigner.com'
const DEFAULT_IMAGE = `${SITE_URL}/logo-navbar.png`

function setMetaTag(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

function setCanonicalLink(href) {
  let element = document.head.querySelector('link[rel="canonical"]')
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.appendChild(element)
  }
  element.setAttribute('href', href)
}

export default function Seo({ title, description, path = '', image = DEFAULT_IMAGE, noindex = false }) {
  useEffect(() => {
    const fullTitle = `${title} | Atelier Gabriella`
    const url = `${SITE_URL}${path}`

    document.title = fullTitle
    setMetaTag('name', 'description', description)
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    setCanonicalLink(url)

    setMetaTag('property', 'og:title', fullTitle)
    setMetaTag('property', 'og:description', description)
    setMetaTag('property', 'og:url', url)
    setMetaTag('property', 'og:image', image)
    setMetaTag('property', 'og:type', 'website')
    setMetaTag('property', 'og:locale', 'fr_FR')

    setMetaTag('name', 'twitter:card', 'summary_large_image')
    setMetaTag('name', 'twitter:title', fullTitle)
    setMetaTag('name', 'twitter:description', description)
    setMetaTag('name', 'twitter:image', image)
  }, [title, description, path, image, noindex])

  return null
}
