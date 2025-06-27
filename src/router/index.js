import { createRouter, createWebHistory } from 'vue-router'

// Importación de los componentes
import Login from 'src/components/components/LoginForm.vue' // Ruta del login
import RegisterForm from 'src/components/components/RegisterForm.vue' // Ruta de registro
import UpdateForm from 'src/components/components/UpdateForm.vue' // Ruta de actualización de contraseña
import MenuLibre from 'src/components/components/MenuLibre.vue' // Ruta del menú libre
import CrearListarPublicacion from 'src/components/components/CrearListarPublicacion.vue' // Ruta para "Crear y Listar Publicaciones"

const routes = [
  {
    path: '/',
    redirect: '/login', // Redirige a la página de login por defecto
  },
  {
    path: '/login',
    name: 'Login',
    component: Login, // Ruta del login
  },
  {
    path: '/register',
    name: 'Register',
    component: RegisterForm, // Ruta de registro
  },
  {
    path: '/recuperar',
    name: 'Recuperar',
    component: UpdateForm, // Ruta de recuperación de contraseña
  },
  {
    path: '/menu-libre',
    name: 'MenuLibre',
    component: MenuLibre, // Ruta del menú libre
  },
  {
    path: '/crear-listar-publicacion', // Nueva ruta para crear y listar publicaciones
    name: 'CrearListarPublicacion',
    component: CrearListarPublicacion, // Componente de Crear y Listar Publicaciones
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'ErrorNotFound',
    component: () => import('src/pages/ErrorNotFound.vue'), // Página de error si la ruta no existe
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
