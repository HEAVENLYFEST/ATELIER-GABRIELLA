import { motion } from 'framer-motion'
import { Mail, Send } from 'lucide-react'
import { useState } from 'react'
import Button from '../../components/Button/Button'
import PageTransition from '../../components/PageTransition/PageTransition'
import RdvCalendar, { toISODate } from '../../components/RdvCalendar/RdvCalendar'
import Seo from '../../components/Seo/Seo'
import './Contact.css'

const initialForm = { name: '', email: '', phone: '', date: '', venue: '', address: '', message: '' }
const contactEmail = 'ateliergabriella.contact@gmail.com'

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [selectedDate, setSelectedDate] = useState()
  const [selectedSlot, setSelectedSlot] = useState('')
  const [status, setStatus] = useState('idle')
  const [serverError, setServerError] = useState('')
  const [startedAt] = useState(() => Date.now())

  const update = event => setForm({ ...form, [event.target.name]: event.target.value })

  const submit = async event => {
    event.preventDefault()
    const website = new FormData(event.currentTarget).get('website')
    if (!selectedDate || !selectedSlot) {
      setStatus('appointment-required')
      return
    }

    setStatus('booking')
    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, eventDate: form.date, date: toISODate(selectedDate), slot: selectedSlot, website, elapsedMs: Date.now() - startedAt }),
      })

      if (response.status === 409) {
        setSelectedSlot('')
        setStatus('slot-taken')
        return
      }
      if (response.status === 429) {
        setServerError((await response.json()).error)
        setStatus('rate-limited')
        return
      }
      if (!response.ok) {
        setStatus('booking-error')
        return
      }

      const { emailSent } = await response.json()
      setForm(initialForm)
      setSelectedDate(undefined)
      setSelectedSlot('')
      setStatus(emailSent ? 'sent' : 'sent-without-email')
    } catch {
      setStatus('booking-error')
    }
  }

  const alertMessage = {
    'sent': 'Merci ! Votre demande est envoyée et votre créneau est réservé. Un e-mail de confirmation vient de vous être adressé.',
    'sent-without-email': `Votre créneau est bien réservé, mais l’e-mail de confirmation n’a pas pu partir. N’hésitez pas à nous écrire à ${contactEmail}.`,
    'appointment-required': 'Choisissez une date et un créneau de rendez-vous avant d’envoyer votre demande.',
    'booking': 'Envoi de votre demande en cours…',
    'slot-taken': 'Ce créneau vient d’être réservé par quelqu’un d’autre. Merci d’en choisir un autre.',
    'rate-limited': serverError,
    'booking-error': 'Une erreur est survenue lors de la réservation. Merci de réessayer dans un instant.',
  }[status]

  return <PageTransition><Seo title="Contact & Rendez-vous" description="Contactez l'Atelier Gabriella pour votre projet de décoration d'événement et réservez un rendez-vous en ligne en Île-de-France." path="/contact" /><section className="contact-page page-section"><motion.div className="contact-photo" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 0.99, x: 0 }} transition={{ duration: .7 }}><img src="/photocontact.jpeg" alt="Couple lors d'un mariage" /></motion.div><motion.div className="contact-form-wrap" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .12 }}><p className="eyebrow">Parlons de votre histoire</p><h1 className="section-heading">Donnons vie à <em>votre</em> projet.</h1><p className="intro-copy">Dites-moi quelques mots sur votre événement. Je reviendrai vers vous avec beaucoup d'attention.</p><div className="contact-mail-note"><Mail size={18} strokeWidth={1.5} /><p>Après validation, votre demande nous est transmise directement et vous recevez un e-mail de confirmation. Vous pouvez aussi nous écrire à <strong>{contactEmail}</strong>.</p></div><form onSubmit={submit}><div className="contact-honeypot" aria-hidden="true"><label>Site web<input name="website" type="text" tabIndex={-1} autoComplete="off" /></label></div>{[['name', 'Nom complet', 'text'], ['email', 'Adresse e-mail', 'email'], ['phone', 'Téléphone', 'tel'], ['date', 'Date de l’événement', 'date'], ['venue', 'Lieu de l’événement', 'text'], ['address', 'Adresse postale', 'text']].map(([name, label, type]) => <label key={name}><span>{label}</span><input required={name === 'name' || name === 'email'} name={name} type={type} value={form[name]} onChange={update} /></label>)}<RdvCalendar selectedDate={selectedDate} selectedSlot={selectedSlot} onDateChange={setSelectedDate} onSlotChange={setSelectedSlot} /><label className="contact-message"><span>Votre message</span><textarea required name="message" rows="4" value={form.message} onChange={update} /></label><Button type="submit" variant="secondary" disabled={status === 'booking'}><Send size={14} /> Envoyer ma demande</Button></form>{alertMessage && <motion.p className={`form-alert form-alert--${status}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>{alertMessage}</motion.p>}</motion.div></section></PageTransition>
}
