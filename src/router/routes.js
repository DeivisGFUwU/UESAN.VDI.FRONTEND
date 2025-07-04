const routes = [
  {
    path: '/',
    name: 'Portada',
    component: () => import('layouts/PortadaLayout.vue'),
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
  // Rutas protegidas para cada rol
  {
    path: '/admin',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('pages/admin/AdminDashboard.vue'),
      },
      {
        path: 'Gestion-usuarios',
        name: 'GestionUsuarios',
        component: () => import('pages/admin/GestionUsuarios.vue'),
      },
      {
        path: 'Gestion-Proyectos',
        name: 'GestionProyectos',
        component: () => import('pages/admin/GestionProyectos.vue'),
      },
      {
        path: 'Gestion-publicaciones',
        name: 'GestionPublicaciones',
        component: () => import('pages/admin/GestionPublicaciones.vue'),
      },
      {
        path: 'Gestion-profesores',
        name: 'GestionProfesores',
        component: () => import('pages/admin/GestionProfesores.vue'),
      },
      {
        path: 'Asignacion-Proyectos',
        name: 'AsignacionProyectos',
        component: () => import('pages/admin/AsignacionProyectos.vue'),
      },
      {
        path: 'gestion-revistas',
        name: 'GestionRevistas',
        component: () => import('pages/admin/GestionRevistas.vue'),
      },
      {
        path: 'Gestion-formularios-investigacion',
        name: 'GestionFormulariosInvestigacion',
        component: () => import('pages/admin/GestionFormulariosInvestigacion.vue'),
      },
      {
        path: 'Gestion-lineas-investigacion',
        name: 'GestionLineasInvestigacion',
        component: () => import('pages/admin/GestionLineasInvestigacion.vue'),
      },
      {
        path: 'Gestion-autores-publicacion',
        name: 'GestionAutoresPublicacion',
        component: () => import('pages/admin/GestionAutoresPublicaciones.vue'),
      },
      {
        path: 'Chat-interno',
        name: 'ChatInterno',
        component: () => import('pages/admin/AdminDashboard.vue'), // Cambia esto si tienes un componente específico para el chat
      },
    ],
  },
  {
    path: '/profesor',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'ProfesorDashboard',
        component: () => import('pages/profesor/ProfesorDashboard.vue'),
      },
      // Aquí puedes agregar más rutas hijas para profesor
    ],
  },
  {
    path: '/postulante',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'PostulanteDashboard',
        component: () => import('pages/postulante/Postulante.vue'),
      },
      // Aquí puedes agregar más rutas hijas para postulante
    ],
  },
  {
    path: '/:catchAll(.*)*',
    name: 'Error404',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
