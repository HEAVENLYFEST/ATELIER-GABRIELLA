import { useEffect, useState } from 'react'
import PageTransition from '../../components/PageTransition/PageTransition'
import './Admin.css'

export default function Admin() {
  const [password, setPassword] = useState(() => sessionStorage.getItem('admin-password') || '')
  const [inputPassword, setInputPassword] = useState('')
  const [bookings, setBookings] = useState(null)
  const [error, setError] = useState('')

  const loadBookings = async pwd => {
    setError('')
    try {
      const response = await fetch('/api/admin/bookings', { headers: { 'x-admin-password': pwd } })
      if (response.status === 401) {
        sessionStorage.removeItem('admin-password')
        setPassword('')
        setError('Mot de passe incorrect.')
        return
      }
      if (!response.ok) {
        setError('Erreur lors du chargement des rendez-vous.')
        return
      }
      setBookings(await response.json())
    } catch {
      setError('Erreur lors du chargement des rendez-vous.')
    }
  }

  useEffect(() => {
    if (password) loadBookings(password)
  }, [password])

  const submitPassword = event => {
    event.preventDefault()
    sessionStorage.setItem('admin-password', inputPassword)
    setPassword(inputPassword)
  }

  const cancelBooking = async id => {
    if (!window.confirm('Annuler ce rendez-vous ? Le créneau redeviendra disponible.')) return
    const response = await fetch('/api/admin/cancel', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
      body: JSON.stringify({ id }),
    })
    if (response.ok) loadBookings(password)
    else setError('Impossible d’annuler ce rendez-vous.')
  }

  if (!password) {
    return <PageTransition><section className="admin-page page-section">
      <form className="admin-login" onSubmit={submitPassword}>
        <h1 className="section-heading">Espace administration</h1>
        <label><span>Mot de passe</span><input type="password" value={inputPassword} onChange={event => setInputPassword(event.target.value)} required autoFocus /></label>
        {error && <p className="admin-error">{error}</p>}
        <button type="submit">Se connecter</button>
      </form>
    </section></PageTransition>
  }

  return <PageTransition><section className="admin-page page-section">
    <h1 className="section-heading">Rendez-vous réservés</h1>
    {error && <p className="admin-error">{error}</p>}
    {error ? null : !bookings ? <p>Chargement…</p> : bookings.length === 0 ? <p>Aucun rendez-vous pour le moment.</p> : <ul className="admin-bookings">
      {bookings.map(booking => <li key={booking.id}>
        <div>
          <strong>{booking.date} · {booking.slot}</strong>
          <p>{booking.name} — <a href={`mailto:${booking.email}`}>{booking.email}</a>{booking.phone && ` — ${booking.phone}`}</p>
        </div>
        <button type="button" onClick={() => cancelBooking(booking.id)}>Annuler</button>
      </li>)}
    </ul>}
  </section></PageTransition>
}
