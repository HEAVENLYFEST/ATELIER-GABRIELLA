import { motion } from 'framer-motion'
import { ArrowDownRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import Button from '../../components/Button/Button'
import PageTransition from '../../components/PageTransition/PageTransition'
import Seo from '../../components/Seo/Seo'
import './Accueil.css'

const carouselImages = [{ src: '/photocarroussel1.jpeg', alt: 'Décoration de réception Atelier Gabriella' }, { src: '/photocarroussel2.jpeg', alt: 'Mariée dans une scénographie Atelier Gabriella' }]
const offers = [{ name: 'Essentielle', text: 'Une décoration juste, précise et lumineuse.' }, { name: 'Confort', text: 'Un accompagnement pensé dans les moindres détails.' }, { name: 'Signature', text: 'Une scénographie entièrement façonnée pour vous.' }]
const reveal = { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: .2 }, transition: { duration: .75 } }

export default function Accueil() {
	const [activeSlide, setActiveSlide] = useState(0)
	const changeSlide = direction => setActiveSlide(current => (current + direction + carouselImages.length) % carouselImages.length)

	useEffect(() => {
		const interval = window.setInterval(() => changeSlide(1), 5500)
		return () => window.clearInterval(interval)
	}, [])

	return <PageTransition><Seo title="Décoration & Scénographie d'Événements" description="Atelier Gabriella, décoratrice et scénographe d'événements en Île-de-France. Mariages, réceptions et célébrations sur-mesure, pensés avec élégance et précision." path="/" /><section className="home-hero">{carouselImages.map((image, index) => <img key={image.src} className={`home-hero__image ${index === activeSlide ? 'is-active' : ''}`} src={image.src} alt={image.alt} aria-hidden={index !== activeSlide} />)}<div className="home-hero__copy"><motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .25 }} className="eyebrow">Île-de-France · Événements d'exception</motion.p><motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: .8 }}>Atelier <em>Gabriella</em></motion.h1><motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .6 }}>Décoratrice & Scénographe d'Événements</motion.p></div><div className="home-hero__scroll"><ArrowDownRight size={16} /> Défiler</div><div className="home-hero__controls"><button aria-label="Image précédente" onClick={() => changeSlide(-1)}><ChevronLeft size={18} /></button><span>{String(activeSlide + 1).padStart(2, '0')} / 02</span><button aria-label="Image suivante" onClick={() => changeSlide(1)}><ChevronRight size={18} /></button></div></section>
<section className="page-section home-mission"><motion.div {...reveal}><p className="eyebrow"></p><h2 className="section-heading">Ma mission : <span className="manuscrit">imaginer</span> et créer un univers unique, chic et raffiné, mais surtout, à votre image.</h2><p className="intro-copy">Chaque célébration devient une histoire singulière.</p><Button to="/prestations">En savoir plus</Button></motion.div><motion.div {...reveal} transition={{ duration: .75, delay: .15 }} className="home-mission__panel"><img src="/acceuil2.jpeg" alt="Décoration d'événement Atelier Gabriella" /></motion.div></section>
<section className="page-section home-services"><motion.div {...reveal} className="home-services__intro"><p className="eyebrow">Les attentions de l'atelier</p><h2 className="section-heading">Prestations</h2></motion.div><div className="offer-grid">{offers.map((offer, index) => <motion.article {...reveal} transition={{ duration: .6, delay: index * .12 }} className={`offer-card ${index === 2 ? 'offer-card--signature' : ''}`} key={offer.name}><span>0{index + 1}</span><h3>{offer.name}</h3><p>{offer.text}</p><ArrowDownRight size={20} /></motion.article>)}</div><div className="home-services__cta"><Button to="/prestations" variant="outline">Découvrir mes formules</Button></div></section>
</PageTransition> }
