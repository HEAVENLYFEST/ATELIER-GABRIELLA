import { motion } from 'framer-motion'
import { Mail, Send } from 'lucide-react'
import { useState } from 'react'
import Button from '../../components/Button/Button'
import PageTransition from '../../components/PageTransition/PageTransition'
import RdvCalendar, { toISODate } from '../../components/RdvCalendar/RdvCalendar'
import './Contact.css'

const initialForm = { name: '', email: '', phone: '', date: '', venue: '', address: '', message: '' }
const contactEmail = 'ateliergabriella.contact@gmail.com'

export default function Contact() {
  const [form, setForm] = useState(initialForm)
  const [selectedDate, setSelectedDate] = useState()
  const [selectedSlot, setSelectedSlot] = useState('')
  const [status, setStatus] = useState('idle')

  const update = event => setForm({ ...form, [event.target.name]: event.target.value })

  const submit = async event => {
    event.preventDefault()
    if (!selectedDate || !selectedSlot) {
      setStatus('appointment-required')
      return
    }

    setStatus('booking')
    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: toISODate(selectedDate), slot: selectedSlot, name: form.name, email: form.email, phone: form.phone }),
      })

      if (response.status === 409) {
        setSelectedSlot('')
        setStatus('slot-taken')
        return
      }
      if (!response.ok) {
        setStatus('booking-error')
        return
      }
    } catch {
      setStatus('booking-error')
      return
    }

    const appointmentDate = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full' }).format(selectedDate)
    const subject = `Demande de rendez-vous - ${form.name}`
    const body = [
      'Bonjour Atelier Gabriella,',
      '',
      'Je souhaite échanger avec vous au sujet de mon projet.',
      '',
      `Nom : ${form.name}`,
      `Adresse e-mail : ${form.email}`,
      `Téléphone : ${form.phone || 'Non renseigné'}`,
      `Date de l’événement : ${form.date || 'Non renseignée'}`,
      `Lieu de réception : ${form.venue || 'Non renseigné'}`,
      `Adresse postale : ${form.address || 'Non renseignée'}`,
      `Rendez-vous souhaité : ${appointmentDate}, ${selectedSlot}`,
      '',
      'Mon message :',
      form.message,
      '',
      'Bien cordialement,',
      form.name,
    ].join('\n')

    setStatus('mail-ready')
    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  const alertMessage = {
    'mail-ready': 'Votre messagerie a été ouverte. Vérifiez les informations préremplies, puis cliquez sur Envoyer dans votre application e-mail.',
    'appointment-required': 'Choisissez une date et un créneau de rendez-vous avant d’envoyer votre demande.',
    'booking': 'Réservation du créneau en cours…',
    'slot-taken': 'Ce créneau vient d’être réservé par quelqu’un d’autre. Merci d’en choisir un autre.',
    'booking-error': 'Une erreur est survenue lors de la réservation. Merci de réessayer dans un instant.',
  }[status]

  return <PageTransition><section className="contact-page page-section"><motion.div className="contact-photo" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 0.99, x: 0 }} transition={{ duration: .7 }}><img src="/photocontact.jpeg" alt="Couple lors d'un mariage" /></motion.div><motion.div className="contact-form-wrap" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .12 }}><p className="eyebrow">Parlons de votre histoire</p><h1 className="section-heading">Donnons vie à <em>votre</em> projet.</h1><p className="intro-copy">Dites-moi quelques mots sur votre événement. Je reviendrai vers vous avec beaucoup d'attention.</p><div className="contact-mail-note"><Mail size={18} strokeWidth={1.5} /><p>Après validation, votre messagerie s’ouvrira avec votre demande déjà préparée pour <strong>{contactEmail}</strong>. Il vous suffira de vérifier les informations, puis de cliquer sur « Envoyer ».</p></div><form onSubmit={submit}>{[['name', 'Nom complet', 'text'], ['email', 'Adresse e-mail', 'email'], ['phone', 'Téléphone', 'tel'], ['date', 'Date de l’événement', 'date'], ['venue', 'Lieu de réception', 'text'], ['address', 'Adresse postale', 'text']].map(([name, label, type]) => <label key={name}><span>{label}</span><input required={name === 'name' || name === 'email'} name={name} type={type} value={form[name]} onChange={update} /></label>)}<RdvCalendar selectedDate={selectedDate} selectedSlot={selectedSlot} onDateChange={setSelectedDate} onSlotChange={setSelectedSlot} /><label className="contact-message"><span>Votre message</span><textarea required name="message" rows="4" value={form.message} onChange={update} /></label><Button type="submit" variant="secondary"><Send size={14} /> Ouvrir ma messagerie</Button></form>{alertMessage && <motion.p className={`form-alert form-alert--${status}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>{alertMessage}</motion.p>}</motion.div></section></PageTransition>
}
