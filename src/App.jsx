import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import CookieConsent from './components/CookieConsent/CookieConsent'
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Accueil from './pages/Accueil/Accueil'
import APropos from './pages/APropos/APropos'
import Prestations from './pages/Prestations/Prestations'
import Contact from './pages/Contact/Contact'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  const location = useLocation()

  return <>
    <ScrollToTop />
    <Header />
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Accueil />} />
        <Route path="/a-propos" element={<APropos />} />
        <Route path="/prestations" element={<Prestations />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </AnimatePresence>
    <Footer />
    <CookieConsent />
  </>
}
