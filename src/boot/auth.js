import { boot } from 'quasar/wrappers'
import { api } from './axios'

export default boot(({ router }) => {
  // Interceptor para agregar el token a cada petición
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })

  // Protección de rutas mejorada para evitar bucles
  router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token')
    if (!isAuthenticated && to.path !== '/login') {
      next('/login')
    } else if (isAuthenticated && to.path === '/login') {
      // Si ya está autenticado y va a /login, redirige a la principal (ajusta según tu app)
      next('/')
    } else {
      next()
    }
  })
})
