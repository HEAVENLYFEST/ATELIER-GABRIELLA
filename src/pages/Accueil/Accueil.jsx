import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDownRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import Button from '../../components/Button/Button'
import PageTransition from '../../components/PageTransition/PageTransition'
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

	return <PageTransition><section className="home-hero"><AnimatePresence initial={false} mode="wait"><motion.img key={carouselImages[activeSlide].src} className="home-hero__image" src={carouselImages[activeSlide].src} alt={carouselImages[activeSlide].alt} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.1, ease: [.25, 1, .5, 1] }} /></AnimatePresence><div className="home-hero__copy"><motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .25 }} className="eyebrow">Île-de-France · Événements d'exception</motion.p><motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: .8 }}>Atelier <em>Gabriella</em></motion.h1><motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .6 }}>Décoratrice & Scénographe d'Événements</motion.p></div><div className="home-hero__scroll"><ArrowDownRight size={16} /> Défiler</div><div className="home-hero__controls"><button aria-label="Image précédente" onClick={() => changeSlide(-1)}><ChevronLeft size={18} /></button><span>{String(activeSlide + 1).padStart(2, '0')} / 02</span><button aria-label="Image suivante" onClick={() => changeSlide(1)}><ChevronRight size={18} /></button></div></section>
<section className="page-section home-mission"><motion.div {...reveal}><p className="eyebrow">L'art de recevoir</p><h2 className="section-heading">Ma mission : <span className="manuscrit">imaginer</span> et créer un univers unique, chic et raffiné, mais surtout, à votre image.</h2><p className="intro-copy">Chaque célébration devient une histoire singulière. Je compose des décors sensibles, où les matières, les fleurs et la lumière racontent votre moment avec une élégance naturelle.</p><Button to="/prestations">En savoir plus</Button></motion.div><motion.div {...reveal} transition={{ duration: .75, delay: .15 }} className="home-mission__panel"><img src="/acceuil2.jpeg" alt="Décoration d'événement Atelier Gabriella" /></motion.div></section>
<section className="page-section home-services"><motion.div {...reveal} className="home-services__intro"><p className="eyebrow">Les attentions de l'atelier</p><h2 className="section-heading">Prestations</h2></motion.div><div className="offer-grid">{offers.map((offer, index) => <motion.article {...reveal} transition={{ duration: .6, delay: index * .12 }} className="offer-card" key={offer.name}><span>0{index + 1}</span><h3>{offer.name}</h3><p>{offer.text}</p><ArrowDownRight size={20} /></motion.article>)}</div><div className="home-services__cta"><Button to="/prestations" variant="outline">Découvrir mes formules</Button></div></section></PageTransition> }
