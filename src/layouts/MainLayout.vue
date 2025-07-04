<template>
  <q-layout class="main-layout" view="hHh lpR fFf">
    <!-- SidebarNav removido del layout global -->
    <MainHeader @logout="cerrarSesion" />
    <DynamicMenu :class="{ 'menu-shifted': drawerOpen }" @logout="cerrarSesion" />
    <chatBot />
    <!-- Aquí se mostrará el contenido de cada página hija -->
    <q-page-container
      :style="
        sidebarItems
          ? `margin-left: ${sidebarCollapsed ? 64 : 240}px; transition: margin 0.3s cubic-bezier(.4,0,.2,1);`
          : 'transition: margin 0.3s cubic-bezier(.4,0,.2,1);'
      "
    >
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import MainHeader from 'components/common/MainHeader.vue'
import DynamicMenu from 'components/common/DynamicMenu.vue'
import chatBot from 'components/chatBot/chatBot.vue'
import { ref, provide } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from 'src/stores/authStore'

export default {
  name: 'MainLayout',
  components: { MainHeader, DynamicMenu, chatBot },
  data() {
    return {
      sidebarItems: null,
      sidebarCollapsed: false,
    }
  },
  created() {
    // Detecta el dashboard y asigna los ítems correspondientes
    const route = this.$route
    if (route.path.startsWith('/admin')) {
      this.sidebarItems = [
        {
          icon: 'work',
          label: 'Gestión de Proyectos',
          desc: 'Administra todos los proyectos de investigación.',
          action: {
            label: 'Ir',
            onClick: () => (window.location.href = '/admin/Gestion-Proyectos'),
          },
        },
        {
          icon: 'assignment_ind',
          label: 'Asignación de Proyectos',
          desc: 'Asigna proyectos a profesores y equipos.',
          action: {
            label: 'Ir',
            onClick: () => (window.location.href = '/admin/Asignacion-Proyectos'),
          },
        },
        {
          icon: 'school',
          label: 'Gestión de Profesores',
          desc: 'Gestiona los datos de los profesores.',
          action: {
            label: 'Ir',
            onClick: () => (window.location.href = '/admin/Gestion-profesores'),
          },
        },
        {
          icon: 'manage_accounts',
          label: 'Gestión de Usuarios',
          desc: 'Administra usuarios del sistema.',
          action: {
            label: 'Ir',
            onClick: () => (window.location.href = '/admin/Gestion-usuarios'),
          },
        },
        {
          icon: 'library_books',
          label: 'Gestión de Publicaciones',
          desc: 'Gestiona publicaciones científicas.',
          action: {
            label: 'Ir',
            onClick: () => (window.location.href = '/admin/Gestion-publicaciones'),
          },
        },
        {
          icon: 'menu_book',
          label: 'Gestión de Revistas',
          desc: 'Administra revistas académicas.',
          action: {
            label: 'Ir',
            onClick: () => (window.location.href = '/admin/gestion-revistas'),
          },
        },
        {
          icon: 'assignment',
          label: 'Formularios de Investigación',
          desc: 'Gestiona formularios de investigación.',
          action: {
            label: 'Ir',
            onClick: () => (window.location.href = '/admin/Gestion-formularios-investigacion'),
          },
        },
        {
          icon: 'timeline',
          label: 'Líneas de Investigación',
          desc: 'Gestiona líneas de investigación.',
          action: {
            label: 'Ir',
            onClick: () => (window.location.href = '/admin/Gestion-lineas-investigacion'),
          },
        },
        {
          icon: 'groups',
          label: 'Autores de Publicaciones',
          desc: 'Gestiona autores de publicaciones.',
          action: {
            label: 'Ir',
            onClick: () => (window.location.href = '/admin/Gestion-autores-publicacion'),
          },
        },
        {
          icon: 'chat',
          label: 'Chat Interno',
          desc: 'Comunícate con otros administradores.',
          action: { label: 'Ir', onClick: () => (window.location.href = '/admin/Chat-interno') },
        },
      ]
    }
    // Aquí puedes agregar lógica para profesor/postulante si lo deseas
  },
  setup() {
    const drawerOpen = ref(false)
    provide('drawerOpen', drawerOpen)
    const router = useRouter()
    const authStore = useAuthStore()
    function cerrarSesion() {
      try {
        if (authStore && typeof authStore.clearAuth === 'function') {
          authStore.clearAuth()
        }
      } catch (error) {
        console.error('Error al cerrar sesión:', error)
      }
      localStorage.clear() // Limpia todo el localStorage por seguridad
      // Redirige a la portada (PortadaLayout)
      router.push('/')
    }
    return { drawerOpen, cerrarSesion }
  },
}
</script>

<style lang="scss" scoped>
@import 'src/css/esan.variables.scss';

.main-layout,
.default-layout {
  font-family: $esan-font-main;
  background: $esan-light-grey;
  color: $esan-black;
}
/* Desplazamiento del menú cuando el drawer está abierto */
.menu-shifted {
  transform: translateX(220px);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
/* Animación para desplazar el menú */
.menu-slide-enter-active,
.menu-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.menu-slide-enter-from,
.menu-slide-leave-to {
  transform: translateX(0);
}
.menu-slide-enter-to,
.menu-slide-leave-from {
  transform: translateX(-240px);
}
</style>
