import { createRouter, createWebHistory } from 'vue-router'
import Login from 'src/components/components/LoginForm.vue'
import CrearListarPublicacion from 'src/components/components/CrearListarPublicacion.vue' // Nueva importación

const routes = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/crear-listar-publicacion', // Nueva ruta
    name: 'CrearListarPublicacion',
    component: CrearListarPublicacion, // Componente de crear y listar publicaciones
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'ErrorNotFound',
    component: () => import('src/pages/ErrorNotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
