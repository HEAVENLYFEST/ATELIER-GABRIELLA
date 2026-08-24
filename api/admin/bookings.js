import { readBookings } from '../_lib/bookings.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Méthode non autorisée' })
  if (req.headers['x-admin-password'] !== process.env.ADMIN_PASSWORD) return res.status(401).json({ error: 'Non autorisé' })

  const bookings = await readBookings()
  bookings.sort((a, b) => (a.date + a.slot).localeCompare(b.date + b.slot))
  res.status(200).json(bookings)
}
