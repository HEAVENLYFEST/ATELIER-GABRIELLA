import { readBookings } from './_lib/bookings.js'

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Méthode non autorisée' })

  try {
    const bookings = await readBookings()
    res.status(200).json(bookings.map(({ date, slot }) => ({ date, slot })))
  } catch (error) {
    console.error('Lecture des créneaux impossible :', error)
    res.status(500).json({ error: 'Le service de réservation est indisponible.' })
  }
}
