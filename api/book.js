import { createHash, randomUUID } from 'node:crypto'
import { readBookings, timeSlots, writeBookings } from './_lib/bookings.js'
import { sendBookingEmails } from './_lib/email.js'

const text = (value, max) => String(value ?? '').trim().slice(0, max)

const MIN_FILL_MS = 3000
const MAX_REQUESTS_PER_IP_PER_DAY = 3
const MAX_UPCOMING_PER_EMAIL = 2
const DAY_MS = 24 * 60 * 60 * 1000

const hashIp = req => {
  const ip = String(req.headers['x-forwarded-for'] ?? '').split(',')[0].trim() || req.socket?.remoteAddress || ''
  return ip ? createHash('sha256').update(`atelier-gabriella:${ip}`).digest('hex').slice(0, 32) : ''
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' })

  const body = req.body ?? {}

  // Anti-spam : champ piège rempli ou formulaire envoyé trop vite = robot. On répond comme si tout allait bien.
  if (body.website || !(Number(body.elapsedMs) >= MIN_FILL_MS)) return res.status(201).json({ id: randomUUID(), emailSent: true })

  const date = text(body.date, 10)
  const slot = text(body.slot, 20)
  const name = text(body.name, 120)
  const email = text(body.email, 200)
  const phone = text(body.phone, 40)
  const eventDate = text(body.eventDate, 10)
  const venue = text(body.venue, 200)
  const address = text(body.address, 300)
  const message = text(body.message, 5000)

  if (!date || !slot || !name || !email) return res.status(400).json({ error: 'Champs requis manquants' })
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Adresse e-mail invalide' })
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ error: 'Date invalide' })
  if (eventDate && !/^\d{4}-\d{2}-\d{2}$/.test(eventDate)) return res.status(400).json({ error: 'Date de l’événement invalide' })
  if (!timeSlots.includes(slot)) return res.status(400).json({ error: 'Créneau invalide' })

  const today = new Date().toISOString().slice(0, 10)
  if (date < today) return res.status(400).json({ error: 'Date passée' })

  let booking
  try {
    const bookings = await readBookings()
    if (bookings.some(existing => existing.date === date && existing.slot === slot)) {
      return res.status(409).json({ error: 'Ce créneau vient d’être réservé, choisissez-en un autre.' })
    }

    const ipHash = hashIp(req)
    const since = new Date(Date.now() - DAY_MS).toISOString()
    if (ipHash && bookings.filter(existing => existing.ipHash === ipHash && existing.createdAt >= since).length >= MAX_REQUESTS_PER_IP_PER_DAY) {
      return res.status(429).json({ error: 'Vous avez déjà envoyé plusieurs demandes aujourd’hui. Merci de nous écrire directement par e-mail.' })
    }
    if (bookings.filter(existing => existing.email.toLowerCase() === email.toLowerCase() && existing.date >= today).length >= MAX_UPCOMING_PER_EMAIL) {
      return res.status(429).json({ error: 'Vous avez déjà des rendez-vous à venir avec cette adresse e-mail. Merci de nous écrire directement pour en ajouter un.' })
    }

    booking = { id: randomUUID(), date, slot, name, email, phone, eventDate, venue, address, message, ipHash, createdAt: new Date().toISOString() }
    await writeBookings([...bookings, booking])
  } catch (error) {
    console.error('Réservation impossible :', error)
    return res.status(500).json({ error: 'Le service de réservation est indisponible.' })
  }

  let emailSent = true
  try {
    await sendBookingEmails(booking)
  } catch (error) {
    emailSent = false
    console.error('Envoi des e-mails impossible :', error)
  }

  res.status(201).json({ id: booking.id, emailSent })
}
