import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { useEffect, useState } from 'react'
import Button from '../../components/Button/Button'
import PageTransition from '../../components/PageTransition/PageTransition'
import './Accueil.css'

const carouselImages = [{ src: '/photocarroussel1.jpeg', alt: 'Décoration de réception Atelier Gabriella' }, { src: '/photocarroussel2.jpeg', alt: 'Mariée dans une scénographie Atelier Gabriella' }]
const offers = [{ name: 'Essentielle', text: 'Une décoration juste, précise et lumineuse.' }, { name: 'Confort', text: 'Un accompagnement pensé dans les moindres détails.' }, { name: 'Signature', text: 'Une scénographie entièrement façonnée pour vous.' }]
const gallery = [
	{ src: '/photocarroussel1.jpeg', title: 'Réception', detail: 'Lumière & art de la table' },
	{ src: '/photoprestation.jpeg', title: 'Table signature', detail: 'Fleurs & matières' },
	{ src: '/acceuil2.jpeg', title: 'Célébration', detail: 'Une atmosphère sur mesure' },
	{ src: '/apropos2.jpeg', title: 'Les détails', detail: 'Le geste juste' },
	{ src: '/photocarroussel2.jpeg', title: 'Le grand jour', detail: 'Élégance intemporelle' },
	{ src: '/photocontact.jpeg', title: 'Votre histoire', detail: 'Pensée avec émotion' },
]
const testimonials = [
	{ quote: 'Une décoration délicate, élégante et parfaitement fidèle à l’atmosphère que nous avions imaginée.', event: 'Mariage en Île-de-France' },
	{ quote: 'Chaque détail semblait évident le jour J. Nous avons pu profiter pleinement de notre réception.', event: 'Réception privée' },
]
const reveal = { initial: { opacity: 0, y: 28 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true, amount: .2 }, transition: { duration: .75 } }

export default function Accueil() {
	const [activeSlide, setActiveSlide] = useState(0)
	const changeSlide = direction => setActiveSlide(current => (current + direction + carouselImages.length) % carouselImages.length)

	useEffect(() => {
		const interval = window.setInterval(() => changeSlide(1), 5500)
		return () => window.clearInterval(interval)
	}, [])

	return <PageTransition><section className="home-hero">{carouselImages.map((image, index) => <img key={image.src} className={`home-hero__image ${index === activeSlide ? 'is-active' : ''}`} src={image.src} alt={image.alt} aria-hidden={index !== activeSlide} />)}<div className="home-hero__copy"><motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .25 }} className="eyebrow">Île-de-France · Événements d'exception</motion.p><motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .35, duration: .8 }}>Atelier <em>Gabriella</em></motion.h1><motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .6 }}>Décoratrice & Scénographe d'Événements</motion.p></div><div className="home-hero__scroll"><ArrowDownRight size={16} /> Défiler</div><div className="home-hero__controls"><button aria-label="Image précédente" onClick={() => changeSlide(-1)}><ChevronLeft size={18} /></button><span>{String(activeSlide + 1).padStart(2, '0')} / 02</span><button aria-label="Image suivante" onClick={() => changeSlide(1)}><ChevronRight size={18} /></button></div></section>
<section className="page-section home-mission"><motion.div {...reveal}><p className="eyebrow"></p><h2 className="section-heading">Ma mission : <span className="manuscrit">imaginer</span> et créer un univers unique, chic et raffiné, mais surtout, à votre image.</h2><p className="intro-copy">Chaque célébration devient une histoire singulière. Je compose des décors sensibles, où les matières, les fleurs et la lumière racontent votre moment avec une élégance naturelle.</p><Button to="/prestations">En savoir plus</Button></motion.div><motion.div {...reveal} transition={{ duration: .75, delay: .15 }} className="home-mission__panel"><img src="/acceuil2.jpeg" alt="Décoration d'événement Atelier Gabriella" /></motion.div></section>
<section className="page-section home-services"><motion.div {...reveal} className="home-services__intro"><p className="eyebrow">Les attentions de l'atelier</p><h2 className="section-heading">Prestations</h2></motion.div><div className="offer-grid">{offers.map((offer, index) => <motion.article {...reveal} transition={{ duration: .6, delay: index * .12 }} className={`offer-card ${index === 2 ? 'offer-card--signature' : ''}`} key={offer.name}><span>0{index + 1}</span><h3>{offer.name}</h3><p>{offer.text}</p><ArrowDownRight size={20} /></motion.article>)}</div><div className="home-services__cta"><Button to="/prestations" variant="outline">Découvrir mes formules</Button></div></section>
<section className="home-gallery"><motion.header {...reveal} className="home-gallery__intro"><div><p className="eyebrow">Fragments de célébrations</p><h2 className="section-heading">Réalisations</h2></div><p>Des univers composés pour raconter chaque histoire avec douceur, caractère et précision.</p></motion.header><div className="home-gallery__grid">{gallery.map((item, index) => <motion.figure {...reveal} transition={{ duration: .7, delay: (index % 3) * .08 }} className={`home-gallery__item home-gallery__item--${index + 1}`} key={item.src}><div className="home-gallery__media"><img src={item.src} alt={`${item.title} par Atelier Gabriella`} /></div><figcaption><span><strong>{item.title}</strong>{item.detail}</span><ArrowUpRight size={17} /></figcaption></motion.figure>)}</div></section>
<section className="page-section home-testimonials"><motion.div {...reveal} className="home-testimonials__intro"><p className="eyebrow">Vos mots précieux</p><h2 className="section-heading">Une expérience pensée avec vous.</h2></motion.div><div className="home-testimonials__grid">{testimonials.map((testimonial, index) => <motion.blockquote {...reveal} transition={{ duration: .7, delay: index * .12 }} key={testimonial.event}><Quote size={24} strokeWidth={1} /><p>« {testimonial.quote} »</p><footer>{testimonial.event}</footer></motion.blockquote>)}</div></section>
</PageTransition> }
