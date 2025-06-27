const routes = [
  {
    path: '/',
    redirect: '/login', // Redirige a la página de login por defecto
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('src/components/components/LoginForm.vue'), // Ruta del login
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('src/components/components/RegisterForm.vue'), // Ruta de registro
  },
  {
    path: '/recuperar',
    name: 'Recuperar',
    component: () => import('src/components/components/UpdateForm.vue'), // Ruta de actualización de contraseña
  },
  {
    path: '/menu-libre',
    name: 'MenuLibre',
    component: () => import('src/components/components/MenuLibre.vue'), // Ruta del menú libre
  },
  {
    path: '/:catchAll(.*)*',
    name: 'ErrorNotFound',
    component: () => import('src/pages/ErrorNotFound.vue'), // Página de error si la ruta no existe
  },
]

export default routes
