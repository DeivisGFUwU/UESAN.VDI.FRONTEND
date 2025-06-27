const routes = [
  {
    path: '/',
    redirect: '/revistas-gestion', // Ahora la app inicia en RevistasGestion.vue
  },
  {
    path: '/login',
    component: () => import('components/auth/LoginForm.vue'),
  },
  {
    path: '/register',
    component: () => import('components/auth/RegisterForm.vue'),
  },
  {
    path: '/recuperar',
    component: () => import('components/auth/UpdateForm.vue'),
  },
  {
    path: '/investigacion-form',
    component: () => import('components/auth/InvestigacionForm.vue'),
  },
  {
    path: '/revistas-gestion',
    component: () => import('components/auth/RevistasGestion.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
