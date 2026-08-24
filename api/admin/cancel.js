import { readBookings, writeBookings } from '../_lib/bookings.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Méthode non autorisée' })
  if (req.headers['x-admin-password'] !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'Non autorisé' })

  const { id } = req.body ?? {}
  if (!id) return res.status(400).json({ error: 'Identifiant manquant' })

  const bookings = await readBookings()
  const next = bookings.filter(booking => booking.id !== id)
  if (next.length === bookings.length) return res.status(404).json({ error: 'Réservation introuvable' })

  await writeBookings(next)
  res.status(200).json({ success: true })
}
