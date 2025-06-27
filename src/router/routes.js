const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue'), // Cambia por tu página principal
      },
      {
        path: 'perfil',
        component: () => import('pages/PerfilPage.vue'), // Cambia por tu página de perfil si existe
      },
      {
        path: 'chat',
        component: () => import('pages/ChatPage.vue'), // Cambia por tu página de chat si existe
      },
      // Agrega más rutas hijas aquí según sea necesario
    ],
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
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
