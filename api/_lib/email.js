const SITE_URL = 'https://www.ateliergabrielladesigner.com'
const LOGO_URL = `${SITE_URL}/logo-navbar.png`
const CONTACT_EMAIL = process.env.CONTACT_EMAIL || 'ateliergabriella.contact@gmail.com'
const FROM = process.env.RESEND_FROM || 'Atelier Gabriella <contact@ateliergabrielladesigner.com>'

const colors = { taupe: '#b7a390', creme: '#f0ebe3', or: '#b8986a', noir: '#1a1a1a', gris: '#6b6b6b', bordure: '#e0d8cf' }
const serif = "'Cormorant Garamond', Georgia, 'Times New Roman', serif"
const sans = "'Raleway', 'Helvetica Neue', Arial, sans-serif"

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char])

export const formatDate = isoDate => new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full', timeZone: 'Europe/Paris' }).format(new Date(`${isoDate}T12:00:00Z`))

const detailsTable = rows => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:24px 0;">${rows.map(([label, value]) => `
  <tr>
    <td style="border-bottom:1px solid ${colors.bordure};padding:12px 0;width:42%;vertical-align:top;font-family:${sans};font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:${colors.or};">${escapeHtml(label)}</td>
    <td style="border-bottom:1px solid ${colors.bordure};padding:12px 0;vertical-align:top;font-family:${sans};font-size:14px;line-height:1.6;color:${colors.noir};">${escapeHtml(value)}</td>
  </tr>`).join('')}
</table>`

const layout = ({ preheader, eyebrow, title, body }) => `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;1,400&family=Raleway:wght@400;600&display=swap" rel="stylesheet">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${colors.creme};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${colors.creme};">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;">
        <tr>
          <td align="center" style="background:${colors.taupe};padding:8px 24px;">
            <a href="${SITE_URL}"><img src="${LOGO_URL}" width="300" alt="Atelier Gabriella — Wedding &amp; Event Designer" style="display:block;width:300px;max-width:100%;height:auto;border:0;"></a>
          </td>
        </tr>
        <tr>
          <td style="padding:40px 40px 32px;">
            <p style="margin:0;font-family:${sans};font-size:10px;font-weight:600;letter-spacing:3px;text-transform:uppercase;color:${colors.or};">${escapeHtml(eyebrow)}</p>
            <h1 style="margin:12px 0 0;font-family:${serif};font-size:32px;font-weight:400;line-height:1.15;color:${colors.noir};">${escapeHtml(title)}</h1>
            ${body}
          </td>
        </tr>
        <tr>
          <td align="center" style="border-top:1px solid ${colors.bordure};padding:24px 40px;font-family:${sans};font-size:11px;line-height:1.7;color:${colors.gris};">
            Atelier Gabriella · Décoration d’événements en Île-de-France<br>
            <a href="${SITE_URL}" style="color:${colors.or};text-decoration:none;">ateliergabrielladesigner.com</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`

const paragraph = text => `<p style="margin:20px 0 0;font-family:${sans};font-size:14px;line-height:1.8;color:${colors.noir};">${text}</p>`

function ownerEmail(request) {
  const appointment = `${formatDate(request.date)}, ${request.slot}`
  return {
    from: FROM,
    to: [CONTACT_EMAIL],
    reply_to: request.email,
    subject: `Nouvelle demande de rendez-vous - ${request.name}`,
    html: layout({
      preheader: `${request.name} souhaite un rendez-vous le ${appointment}.`,
      eyebrow: 'Nouvelle demande',
      title: `Rendez-vous avec ${request.name}`,
      body: `${paragraph('Une nouvelle demande vient d’être envoyée depuis le site. Le créneau est déjà réservé dans votre agenda en ligne.')}
${detailsTable([
  ['Rendez-vous', appointment],
  ['Nom', request.name],
  ['E-mail', request.email],
  ['Téléphone', request.phone || 'Non renseigné'],
  ['Date de l’événement', request.eventDate ? formatDate(request.eventDate) : 'Non renseignée'],
  ['Lieu de l’événement', request.venue || 'Non renseigné'],
  ['Adresse postale', request.address || 'Non renseignée'],
])}
<p style="margin:0;font-family:${sans};font-size:10px;font-weight:600;letter-spacing:2px;text-transform:uppercase;color:${colors.or};">Message</p>
<p style="margin:8px 0 0;padding:16px 20px;background:${colors.creme};border-left:2px solid ${colors.or};font-family:${sans};font-size:14px;line-height:1.8;color:${colors.noir};white-space:pre-line;">${escapeHtml(request.message)}</p>
${paragraph(`Répondez simplement à cet e-mail pour écrire à ${escapeHtml(request.name)}.`)}`,
    }),
  }
}

function clientEmail(request) {
  const appointment = `${formatDate(request.date)}, ${request.slot}`
  return {
    from: FROM,
    to: [request.email],
    reply_to: CONTACT_EMAIL,
    subject: 'Votre demande de rendez-vous - Atelier Gabriella',
    html: layout({
      preheader: `Votre rendez-vous du ${appointment} est bien enregistré.`,
      eyebrow: 'Merci pour votre confiance',
      title: `Bonjour ${request.name},`,
      body: `${paragraph('Votre demande a bien été reçue et votre créneau de rendez-vous est réservé. Je reviendrai vers vous très vite pour échanger sur votre projet.')}
${detailsTable([['Rendez-vous', appointment], ['Date de l’événement', request.eventDate ? formatDate(request.eventDate) : 'Non renseignée'], ['Lieu', request.venue || 'Non renseigné']])}
${paragraph('Pour toute question ou pour modifier votre rendez-vous, répondez simplement à cet e-mail.')}
<p style="margin:28px 0 0;font-family:${serif};font-size:20px;font-style:italic;color:${colors.or};">Avec toute mon attention,<br>Atelier Gabriella</p>`,
    }),
  }
}

export async function sendBookingEmails(request) {
  if (!process.env.RESEND_API_KEY) throw new Error('RESEND_API_KEY manquant')

  const response = await fetch('https://api.resend.com/emails/batch', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify([ownerEmail(request), clientEmail(request)]),
  })
  if (!response.ok) throw new Error(`Resend ${response.status} : ${await response.text()}`)
}
