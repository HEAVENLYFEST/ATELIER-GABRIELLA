import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import './Header.css'

const links = [{ to: '/', label: 'Accueil' }, { to: '/a-propos', label: 'À propos' }, { to: '/prestations', label: 'Prestations' }, { to: '/contact', label: 'Contact' }]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => { const listener = () => setScrolled(window.scrollY > 24); window.addEventListener('scroll', listener); return () => window.removeEventListener('scroll', listener) }, [])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [open])
  return <header className={`header ${scrolled ? 'header--scrolled' : ''} ${open ? 'header--open' : ''}`}><NavLink to="/" className="header__logo" onClick={() => setOpen(false)}><img src="/logo-navbar.png" alt="Atelier Gabriella" /></NavLink>
    <nav className="header__nav">{links.map(link => <NavLink end={link.to === '/'} key={link.to} to={link.to}>{link.label}</NavLink>)}</nav>
    <button className="header__menu" aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
    <AnimatePresence>{open && <motion.nav className="header__mobile" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .3 }}><div>{links.map((link, index) => <motion.div key={link.to} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .05 + index * .05 }}><NavLink end={link.to === '/'} to={link.to} onClick={() => setOpen(false)}>{link.label}</NavLink></motion.div>)}</div></motion.nav>}</AnimatePresence>
  </header>
}
