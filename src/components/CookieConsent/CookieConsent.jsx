import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import './CookieConsent.css'

const consentStorageKey = 'atelier-gabriella-cookie-consent'

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(!localStorage.getItem(consentStorageKey))
  }, [])

  const chooseConsent = choice => {
    localStorage.setItem(consentStorageKey, choice)
    // Brancher ici Google Analytics ou tout autre service tiers uniquement si choice === 'accepted'.
    setIsVisible(false)
  }

  if (!isVisible) return null

  return <motion.aside className="cookie-consent" role="dialog" aria-label="Choix des cookies" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: .35, ease: [.25, 1, .5, 1] }}><p>Ce site utilise des cookies pour améliorer votre expérience de navigation.</p><div className="cookie-consent__actions"><button type="button" onClick={() => chooseConsent('accepted')}>Accepter</button><button type="button" onClick={() => chooseConsent('refused')}>Refuser</button></div></motion.aside>
}
