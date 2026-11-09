const STORAGE_KEY = 'admin-password'

export function getAdminPassword() {
  try { return sessionStorage.getItem(STORAGE_KEY) || '' } catch { return '' }
}

export function setAdminPassword(password) {
  try { sessionStorage.setItem(STORAGE_KEY, password) } catch { /* stockage indisponible : la session ne survivra pas au rechargement */ }
}

export function clearAdminPassword() {
  try { sessionStorage.removeItem(STORAGE_KEY) } catch { /* rien à effacer */ }
}
