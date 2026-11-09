import { get, put } from '@vercel/blob'

const BLOB_PATHNAME = 'bookings.json'

export const timeSlots = ['10h-11h', '11h-12h', '12h-13h', '13h-14h', '14h-15h', '15h-16h', '16h-17h', '17h-18h', '18h-19h']

export async function readBookings() {
  const result = await get(BLOB_PATHNAME, { access: 'private', useCache: false })
  if (!result?.stream) return []

  return new Response(result.stream).json()
}

export async function writeBookings(bookings) {
  await put(BLOB_PATHNAME, JSON.stringify(bookings), {
    access: 'private',
    contentType: 'application/json',
    addRandomSuffix: false,
    allowOverwrite: true,
  })
}
