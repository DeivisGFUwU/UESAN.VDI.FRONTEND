import { defineBoot } from '#q-app/wrappers'
import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:5192/api' })

// Interceptor para agregar JWT automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor global para manejar expiración de token y errores 401/403
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Limpiar token y redirigir a login
      localStorage.removeItem('token')
      localStorage.removeItem('jwt')
      // Mostrar mensaje amigable
      if (window && window.$q) {
        window.$q.notify({
          type: 'negative',
          message: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
        })
      } else {
        alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
      }
      // Redirigir a login (ajusta la ruta si es diferente en tu app)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})

export { api }
