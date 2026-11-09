import Button from '../../components/Button/Button'
import PageTransition from '../../components/PageTransition/PageTransition'
import Seo from '../../components/Seo/Seo'
import { seoPages } from '../../seo'

export default function NotFound() {
  return <PageTransition><Seo {...seoPages.notFound} /><section className="page-section" style={{ textAlign: 'center' }}>
    <p className="eyebrow">Erreur 404</p>
    <h1 className="section-heading">Cette page est <em>introuvable</em>.</h1>
    <p className="intro-copy">Elle n’existe pas ou a été déplacée.</p>
    <div style={{ marginTop: '2rem' }}><Button to="/">Retour à l’accueil</Button></div>
  </section></PageTransition>
}
