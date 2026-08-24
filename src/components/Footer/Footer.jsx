import { Instagram, Mail, Music2, PinIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import './Footer.css'

export default function Footer() {
  return <footer className="footer"><div className="footer__grid"><div className="footer__social"><p className="footer__label">Suivez Nous</p><a href="https://www.instagram.com/ateliergabrielladesigner?igsh=M3NqZThjdml0MXNi" target="_blank" rel="noreferrer"><Instagram size={16} /> Instagram</a><a href="https://www.tiktok.com/@ateliergabrielladesigner?_r=1&_t=ZN-98IhNluOKqE" target="_blank" rel="noreferrer"><Music2 size={16} /> TikTok</a><a href="https://pin.it/EfbX32Jfs" target="_blank" rel="noreferrer"><PinIcon size={16} /> Pinterest</a></div><div className="footer__brand"><img src="/logo-navbar.png" alt="Atelier Gabriella" /><span>Scénographies intemporelles</span></div><div className="footer__contact"><p className="footer__label">Île-de-France</p><a href="mailto:ateliergabriella.contact@gmail.com"><Mail size={15} /> ateliergabriella.contact@gmail.com</a><p className="footer__hours">Lundi à samedi<br />10h à 19h</p></div></div><div className="footer__bottom"><span>© {new Date().getFullYear()} Atelier Gabriella</span><Link to="/contact">Échangeons sur votre projet</Link></div></footer>
}
