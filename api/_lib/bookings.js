import { list, put } from '@vercel/blob'

const BLOB_PATHNAME = 'bookings.json'

export const timeSlots = ['10h-11h', '11h-12h', '12h-13h', '13h-14h', '14h-15h', '15h-16h', '16h-17h', '17h-18h', '18h-19h']

export async function readBookings() {
  const { blobs } = await list({ prefix: BLOB_PATHNAME, limit: 1 })
  const blob = blobs.find(entry => entry.pathname === BLOB_PATHNAME)
  if (!blob) return []

  const response = await fetch(blob.url, { cache: 'no-store' })
  if (!response.ok) return []
  return response.json()
}

export async function writeBookings(bookings) {
  await put(BLOB_PATHNAME, JSON.stringify(bookings), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}
