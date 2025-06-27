const routes = [
  {
    path: '/',
    redirect: '/login',
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

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
