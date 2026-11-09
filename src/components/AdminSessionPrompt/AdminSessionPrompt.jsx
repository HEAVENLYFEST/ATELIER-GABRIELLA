import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { clearAdminPassword, getAdminPassword } from '../../adminSession'
import './AdminSessionPrompt.css'

export default function AdminSessionPrompt() {
  const { pathname } = useLocation()
  const previousPath = useRef(pathname)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const leftAdmin = previousPath.current === '/admin' && pathname !== '/admin'
    previousPath.current = pathname
    if (leftAdmin && getAdminPassword()) setOpen(true)
    if (pathname === '/admin') setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKeyDown = event => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  const logout = () => {
    clearAdminPassword()
    setOpen(false)
  }

  return <AnimatePresence>{open && <motion.div className="admin-prompt" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)}>
    <motion.div className="admin-prompt__card" role="dialog" aria-modal="true" aria-labelledby="admin-prompt-title" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }} transition={{ duration: .35 }} onClick={event => event.stopPropagation()}>
      <p className="eyebrow">Espace administration</p>
      <h2 id="admin-prompt-title">Vous êtes toujours connecté</h2>
      <p className="admin-prompt__text">Vous quittez l’espace admin. Souhaitez-vous vous déconnecter ou rester connecté pour y revenir plus tard ?</p>
      <div className="admin-prompt__actions">
        <button type="button" className="admin-prompt__primary" onClick={logout} autoFocus>Se déconnecter</button>
        <button type="button" className="admin-prompt__secondary" onClick={() => setOpen(false)}>Rester connecté</button>
      </div>
      <Link className="admin-prompt__back" to="/admin">Retour à l’espace admin</Link>
    </motion.div>
  </motion.div>}</AnimatePresence>
}
