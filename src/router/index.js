import { defineRouter } from '#q-app/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router'
import routes from './routes'

export default defineRouter(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  })

  // Guard global para proteger rutas privadas
  Router.beforeEach((to, from, next) => {
    const publicPages = ['/login', '/register', '/recuperar']
    const isPublic = publicPages.includes(to.path)
    const token = localStorage.getItem('jwt')

    // Redirigir a login si intenta acceder a ruta privada sin token
    if (!isPublic && !token) {
      return next('/login')
    }

    // Evitar que un usuario logueado acceda a login/register/recuperar
    if (isPublic && token) {
      // Leer el rol del usuario del localStorage
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (user.rol === 3) return next('/admin')
      if (user.rol === 2) return next('/profesor')
      if (user.rol === 1) return next('/alumno/dashboard')
      return next('/')
    }

    return next()
  })

  return Router
})
