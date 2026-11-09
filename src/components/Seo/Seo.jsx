import { useEffect } from 'react'
import { DEFAULT_IMAGE, SITE_URL, fullTitle } from '../../seo'

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
    const pageTitle = fullTitle(title)
    const url = `${SITE_URL}${path}`

    document.title = pageTitle
    setMetaTag('name', 'description', description)
    setMetaTag('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow')
    setCanonicalLink(url)

    setMetaTag('property', 'og:title', pageTitle)
    setMetaTag('property', 'og:description', description)
    setMetaTag('property', 'og:url', url)
    setMetaTag('property', 'og:image', image)
    setMetaTag('property', 'og:type', 'website')
    setMetaTag('property', 'og:locale', 'fr_FR')

    setMetaTag('name', 'twitter:card', 'summary_large_image')
    setMetaTag('name', 'twitter:title', pageTitle)
    setMetaTag('name', 'twitter:description', description)
    setMetaTag('name', 'twitter:image', image)
  }, [title, description, path, image, noindex])

  return null
}
