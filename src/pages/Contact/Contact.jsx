import { motion } from 'framer-motion'
import { LoaderCircle, Send } from 'lucide-react'
import { useState } from 'react'
import emailjs from '@emailjs/browser'
import Button from '../../components/Button/Button'
import PageTransition from '../../components/PageTransition/PageTransition'
import RdvCalendar from '../../components/RdvCalendar/RdvCalendar'
import './Contact.css'

// Renseignez VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID et VITE_EMAILJS_PUBLIC_KEY dans .env pour activer l'envoi.
const initialForm = { name: '', email: '', phone: '', date: '', venue: '', address: '', message: '' }
const sentEmailsStorageKey = 'atelier-gabriella-emails-envoyes'

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

    const normalizedEmail = form.email.trim().toLowerCase()
    const sentEmails = JSON.parse(localStorage.getItem(sentEmailsStorageKey) ?? '[]')
    if (sentEmails.includes(normalizedEmail)) {
      setStatus('duplicate')
      return
    }

    setStatus('loading')
    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          ...form,
          rdv_date: new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full' }).format(selectedDate),
          rdv_creneau: selectedSlot,
          to_email: 'ateliergabriella.contact@gmail.com',
          reply_to: form.email,
        },
        { publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY }
      )
      // Cette vérification se fait uniquement côté navigateur (`localStorage`), donc un visiteur qui vide son cache ou utilise un autre navigateur/appareil pourra renvoyer une demande avec le même email. Pour un blocage vraiment fiable et infalsifiable, il faudrait un vrai backend avec une base de données (ex : Firebase, Supabase, ou une petite API) qui vérifie l'email côté serveur. Cette solution `localStorage` est un premier niveau de protection simple, suffisant pour dissuader les envois multiples accidentels, mais pas 100% infaillible.
      localStorage.setItem(sentEmailsStorageKey, JSON.stringify([...sentEmails, normalizedEmail]))
      setStatus('success')
      setForm(initialForm)
      setSelectedDate(undefined)
      setSelectedSlot('')
    } catch {
      setStatus('error')
    }
  }

  const alertMessage = {
    success: 'Votre demande a bien été envoyée, je vous réponds sous 48h !',
    duplicate: 'Une demande a déjà été envoyée avec cette adresse email. Nous vous répondrons rapidement - merci de votre patience !',
    'appointment-required': 'Choisissez une date et un créneau de rendez-vous avant d’envoyer votre demande.',
    error: 'L’envoi n’a pas abouti. Réessayez dans quelques instants.',
  }[status]

  return <PageTransition><section className="contact-page page-section"><motion.div className="contact-photo" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 0.99, x: 0 }} transition={{ duration: .7 }}><img src="/photocontact.jpeg" alt="Couple lors d'un mariage" /></motion.div><motion.div className="contact-form-wrap" initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .12 }}><p className="eyebrow">Parlons de votre histoire</p><h1 className="section-heading">Donnons vie à <em>votre</em> projet.</h1><p className="intro-copy">Dites-moi quelques mots sur votre événement. Je reviendrai vers vous avec beaucoup d'attention.</p><form onSubmit={submit}>{[['name', 'Nom complet', 'text'], ['email', 'Adresse e-mail', 'email'], ['phone', 'Téléphone', 'tel'], ['date', 'Date de l’événement', 'date'], ['venue', 'Lieu de réception', 'text'], ['address', 'Adresse postale', 'text']].map(([name, label, type]) => <label key={name}><span>{label}</span><input required={name === 'name' || name === 'email'} name={name} type={type} value={form[name]} onChange={update} /></label>)}<RdvCalendar selectedDate={selectedDate} selectedSlot={selectedSlot} onDateChange={setSelectedDate} onSlotChange={setSelectedSlot} /><label className="contact-message"><span>Votre message</span><textarea required name="message" rows="4" value={form.message} onChange={update} /></label><Button type="submit" variant="secondary" disabled={status === 'loading'}>{status === 'loading' ? <><LoaderCircle className="spin" size={15} /> Envoi en cours...</> : <><Send size={14} /> Envoyer ma demande</>}</Button></form>{alertMessage && <motion.p className={`form-alert form-alert--${status}`} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>{alertMessage}</motion.p>}</motion.div></section></PageTransition>
}
