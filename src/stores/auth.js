// Estado de autenticación (token, rol, usuario)
import { ref } from 'vue'

export const token = ref(localStorage.getItem('token') || '')
export const rol = ref(localStorage.getItem('rol') || '')

export function setAuth(newToken, newRol) {
  token.value = newToken
  rol.value = newRol
  localStorage.setItem('token', newToken)
  localStorage.setItem('rol', newRol)
}

export function clearAuth() {
  token.value = ''
  rol.value = ''
  localStorage.removeItem('token')
  localStorage.removeItem('rol')
}
