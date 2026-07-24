import { motion } from 'framer-motion'
import './PhotoPlaceholder.css'

export default function PhotoPlaceholder({ label, height = '440px', className = '', aspectRatio }) {
  return <motion.div className={`photo-placeholder ${className}`} style={{ height, aspectRatio }} whileHover={{ y: -3 }} transition={{ duration: .4 }}>
    <div className="photo-placeholder__art"><span className="photo-placeholder__line" /><span>{label}</span><i /></div>
  </motion.div>
}
