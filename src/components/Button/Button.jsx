import { Link } from 'react-router-dom'
import './Button.css'

export default function Button({ children, to, onClick, variant = 'primary', type = 'button', disabled = false }) {
  const className = `button button--${variant}`
  if (to) return <Link className={className} to={to}><span>{children}</span></Link>
  return <button className={className} type={type} onClick={onClick} disabled={disabled}><span>{children}</span></button>
}
