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
  return <header className={`header ${scrolled ? 'header--scrolled' : ''}`}><NavLink to="/" className="header__logo" onClick={() => setOpen(false)}><img src="/logo%20(2).png" alt="Atelier Gabriella" /></NavLink>
    <nav className="header__nav">{links.map(link => <NavLink end={link.to === '/'} key={link.to} to={link.to}>{link.label}</NavLink>)}</nav>
    <button className="header__menu" aria-label="Ouvrir le menu" onClick={() => setOpen(!open)}>{open ? <X size={20} /> : <Menu size={20} />}</button>
    <AnimatePresence>{open && <motion.nav className="header__mobile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><div>{links.map((link, index) => <motion.div key={link.to} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .12 + index * .08 }}><NavLink end={link.to === '/'} to={link.to} onClick={() => setOpen(false)}>{link.label}</NavLink></motion.div>)}</div></motion.nav>}</AnimatePresence>
  </header>
}
