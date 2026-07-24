import { motion } from 'framer-motion'
import { Check, Instagram } from 'lucide-react'
import Button from '../../components/Button/Button'
import PageTransition from '../../components/PageTransition/PageTransition'
import './Prestations.css'

const formulas = [
  { title: 'Essentielle', price: '250€', items: ['Échange découverte personnalisé', 'Planche d’inspiration sur-mesure', 'Conseils décoration et mise en scène'] },
  { title: 'Confort', price: 'à partir de 600€', items: ['Trois déplacements inclus', 'Visite technique du lieu', 'Mise en scène la veille ou le jour J', 'Coordination des détails décoratifs'] },
  { title: 'Signature', price: 'à partir de 1200€', premium: true, items: ['Six déplacements inclus', 'Conception de tous les espaces', 'Scénographie complète et location', 'Présence et ajustements le jour J'] },
]

export default function Prestations() {
  return <PageTransition><div className="prestations-layout">
    <section className="prestations-content">
      <motion.header className="services-intro" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
        <p className="eyebrow">Des formules à votre mesure</p><h1 className="section-heading">Prestations</h1>
        <p className="intro-copy">Du conseil ciblé à la scénographie complète, je vous accompagne avec une même exigence : composer un décor harmonieux qui révèle la beauté de votre événement.</p><Button to="/contact">Me contacter</Button>
      </motion.header>
      <section className="service-list">{formulas.map((formula, index) => <motion.article className={`service-row ${formula.premium ? 'service-row--premium' : ''}`} key={formula.title} initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .2 }} transition={{ duration: .7 }}><div className="service-row__content"><p className="eyebrow">Formule {String(index + 1).padStart(2, '0')}</p><h2>{formula.title}</h2><p className="service-row__price">{formula.price}</p><span className="gold-rule" /><ul>{formula.items.map(item => <li key={item}><Check size={14} />{item}</li>)}</ul><Button to="/contact" variant={formula.premium ? 'primary' : 'outline'}>Choisir cette formule</Button></div></motion.article>)}</section>
      <motion.a href="https://instagram.com" target="_blank" rel="noreferrer" className="instagram-box" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}><Instagram size={25} /><p>Retrouvez mes créations sur Instagram<br /><strong>@ateliergabriella</strong></p></motion.a>
    </section>
    <aside className="prestations-photo"><img src="/photoprestation.jpeg" alt="Décoration de table Atelier Gabriella" /></aside>
  </div></PageTransition>
}
