import { randomUUID } from 'node:crypto'
import { readBookings, timeSlots, writeBookings } from './_lib/bookings.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' })

  const { date, slot, name, email, phone } = req.body ?? {}
  if (!date || !slot || !name || !email) return res.status(400).json({ error: 'Champs requis manquants' })
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({ error: 'Date invalide' })
  if (!timeSlots.includes(slot)) return res.status(400).json({ error: 'Créneau invalide' })

  const today = new Date().toISOString().slice(0, 10)
  if (date < today) return res.status(400).json({ error: 'Date passée' })

  const bookings = await readBookings()
  if (bookings.some(booking => booking.date === date && booking.slot === slot)) {
    return res.status(409).json({ error: 'Ce créneau vient d’être réservé, choisissez-en un autre.' })
  }

  const booking = { id: randomUUID(), date, slot, name, email, phone: phone || '', createdAt: new Date().toISOString() }
  await writeBookings([...bookings, booking])
  res.status(201).json({ id: booking.id })
}
