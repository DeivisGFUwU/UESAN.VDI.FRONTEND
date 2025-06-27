// src/boot/tokenRefresh.js
// Utilidad para refresco automático de JWT

import { LocalStorage, Notify } from 'quasar'
import axios from 'axios'
import router from '../router'

let refreshTimeout = null
let lastActivity = Date.now()
const INACTIVITY_LIMIT = 30 * 60 * 1000 // 30 minutos de inactividad

export function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        })
        .join(''),
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

function updateActivity() {
  lastActivity = Date.now()
}

;['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'].forEach((event) => {
  window.addEventListener(event, updateActivity, true)
})

function isUserActive() {
  return Date.now() - lastActivity < INACTIVITY_LIMIT
}

function scheduleRefresh(token) {
  const payload = parseJwt(token)
  if (!payload || !payload.exp) return
  const exp = payload.exp * 1000 // JWT exp en segundos
  const now = Date.now()
  const refreshTime = exp - now - 5 * 60 * 1000 // 5 minutos antes de expirar
  if (refreshTimeout) clearTimeout(refreshTimeout)
  if (refreshTime > 0) {
    refreshTimeout = setTimeout(() => {
      if (isUserActive()) {
        refreshToken()
      } else {
        LocalStorage.remove('token')
        Notify.create({ type: 'negative', message: 'Sesión cerrada por inactividad.' })
        router.push('/login')
      }
    }, refreshTime)
  }
}

async function refreshToken() {
  try {
    const oldToken = LocalStorage.getItem('token')
    if (!oldToken) throw new Error('No token')
    const response = await axios.post(
      '/api/usuarios/refresh-token',
      {},
      {
        headers: { Authorization: `Bearer ${oldToken}` },
      },
    )
    const newToken = response.data.token
    LocalStorage.set('token', newToken)
    scheduleRefresh(newToken)
  } catch {
    LocalStorage.remove('token')
    Notify.create({ type: 'negative', message: 'Sesión expirada. Inicia sesión de nuevo.' })
    router.push('/login')
  }
}

export default async () => {
  const token = LocalStorage.getItem('token')
  if (token) {
    scheduleRefresh(token)
  }
  // Opcional: escucha cambios en el token
  window.addEventListener('storage', (event) => {
    if (event.key === 'token') {
      if (event.newValue) {
        scheduleRefresh(event.newValue)
      } else {
        if (refreshTimeout) clearTimeout(refreshTimeout)
      }
    }
  })
}
