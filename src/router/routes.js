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
        path: 'admin',
        name: 'AdminDashboard',
        component: () => import('pages/admin/AdminDashboard.vue'),
        children: [
          {
            path: 'Gestion-Proyectos',
            name: 'GestionProyectos',
            component: () => import('pages/admin/GestionProyectos.vue'),
          },
          {
            path: 'Asignacion-Proyectos',
            name: 'AsignacionProyectos',
            component: () => import('pages/admin/AsignacionProyectos.vue'),
          },
          {
            path: 'Gestion-profesores',
            name: 'GestionProfesores',
            component: () => import('pages/admin/GestionProfesores.vue'),
          },
          {
            path: 'Gestion-usuarios',
            name: 'GestionUsuarios',
            component: () => import('pages/admin/GestionUsuarios.vue'),
          },
          {
            path: 'Gestion-publicaciones',
            name: 'GestionPublicaciones',
            component: () => import('pages/admin/GestionPublicaciones.vue'),
          },
          {
            path: 'Gestion-revistas',
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
            name: 'GestionAutoresPublicaciones',
            component: () => import('pages/admin/GestionAutoresPublicaciones.vue'),
          },
          {
            path: 'Chat-interno',
            name: 'ChatInterno',
            component: () => import('pages/admin/ChatInterno.vue'),
          },
        ],
      },
      {
        path: 'profesor',
        component: () => import('pages/profesor/ProfesorDashboard.vue'),
        children: [
          {
            path: '',
            name: 'ProfesorDashboard',
            redirect: { name: 'ProfesorProyectos' },
          },
          {
            path: 'proyectos',
            name: 'ProfesorProyectos',
            component: () => import('pages/profesor/Proyectos.vue'),
          },
          {
            path: 'publicaciones',
            name: 'ProfesorPublicaciones',
            component: () => import('pages/profesor/Publicaciones.vue'),
          },
          {
            path: 'formularios',
            name: 'ProfesorFormularios',
            component: () => import('pages/profesor/Formularios.vue'),
          },
          {
            path: 'lineas',
            name: 'ProfesorLineas',
            component: () => import('pages/profesor/Lineas.vue'),
          },
          {
            path: 'revistas',
            name: 'ProfesorRevistas',
            component: () => import('pages/profesor/Revistas.vue'),
          },
          {
            path: 'chat',
            name: 'ProfesorChat',
            component: () => import('pages/profesor/Chat.vue'),
          },
          {
            path: 'perfil',
            name: 'ProfesorPerfil',
            component: () => import('pages/profesor/Perfil.vue'),
          },
        ],
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
