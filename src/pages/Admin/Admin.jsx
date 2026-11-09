import { LogOut } from 'lucide-react'
import { useEffect, useState } from 'react'
import PageTransition from '../../components/PageTransition/PageTransition'
import Seo from '../../components/Seo/Seo'
import { seoPages } from '../../seo'
import { clearAdminPassword, getAdminPassword, setAdminPassword } from '../../adminSession'
import './Admin.css'

export default function Admin() {
  const [password, setPassword] = useState(getAdminPassword)
  const [inputPassword, setInputPassword] = useState('')
  const [bookings, setBookings] = useState(null)
  const [error, setError] = useState('')

  const loadBookings = async pwd => {
    setError('')
    try {
      const response = await fetch('/api/admin/bookings', { headers: { 'x-admin-password': pwd } })
      if (response.status === 401) {
        clearAdminPassword()
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
    setAdminPassword(inputPassword)
    setPassword(inputPassword)
  }

  const logout = () => {
    clearAdminPassword()
    setPassword('')
    setInputPassword('')
    setBookings(null)
    setError('')
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
    return <PageTransition><Seo {...seoPages.admin} /><section className="admin-page page-section">
      <form className="admin-login" onSubmit={submitPassword}>
        <h1 className="section-heading">Espace administration</h1>
        <label><span>Mot de passe</span><input type="password" value={inputPassword} onChange={event => setInputPassword(event.target.value)} required autoFocus /></label>
        {error && <p className="admin-error">{error}</p>}
        <button type="submit">Se connecter</button>
      </form>
    </section></PageTransition>
  }

  return <PageTransition><Seo {...seoPages.admin} /><section className="admin-page page-section">
    <div className="admin-header">
      <h1 className="section-heading">Rendez-vous réservés</h1>
      <button type="button" className="admin-logout" onClick={logout}><LogOut size={14} /> Se déconnecter</button>
    </div>
    {error && <p className="admin-error">{error}</p>}
    {error ? null : !bookings ? <p>Chargement…</p> : bookings.length === 0 ? <p>Aucun rendez-vous pour le moment.</p> : <ul className="admin-bookings">
      {bookings.map(booking => <li key={booking.id}>
        <div>
          <strong>{booking.date} · {booking.slot}</strong>
          <p>{booking.name} — <a href={`mailto:${booking.email}`}>{booking.email}</a>{booking.phone && ` — ${booking.phone}`}</p>
          {(booking.eventDate || booking.venue) && <p>Événement : {[booking.eventDate, booking.venue].filter(Boolean).join(' · ')}</p>}
          {booking.message && <p className="admin-message">{booking.message}</p>}
        </div>
        <button type="button" onClick={() => cancelBooking(booking.id)}>Annuler</button>
      </li>)}
    </ul>}
  </section></PageTransition>
}
