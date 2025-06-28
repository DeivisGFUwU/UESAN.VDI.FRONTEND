const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Inicio',
        component: () => import('pages/IndexPage.vue'),
      },
      {
        path: 'perfil',
        name: 'Perfil',
        component: () => import('pages/PerfilPage.vue'),
      },
      {
        path: 'chat',
        name: 'Chat',
        component: () => import('pages/ChatPage.vue'),
      },
      {
        path: 'crear-listar-publicacion',
        name: 'CrearListarPublicacion',
        component: () => import('pages/CrearListarPublicacion.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('components/auth/LoginForm.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('components/auth/RegisterForm.vue'),
  },
  {
    path: '/recuperar',
    name: 'Recuperar',
    component: () => import('components/auth/UpdateForm.vue'),
  },
  {
    path: '/:catchAll(.*)*',
    name: 'Error404',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
