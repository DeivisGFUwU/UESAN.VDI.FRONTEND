<template>
  <q-page class="dashboard-page">
    <div class="dashboard-flex-row">
      <SidebarNav :items="carouselItems" :collapsed="collapsed" />
      <div
        class="dashboard-container"
        :class="{ 'sidebar-collapsed': collapsed, 'sidebar-expanded': !collapsed }"
      >
        <div class="dashboard-title-row">
          <div class="dashboard-title">Panel de Administración</div>
          <q-btn
            flat
            dense
            icon="menu"
            class="sidebar-toggle"
            @click="collapsed = !collapsed"
            :aria-label="collapsed ? 'Expandir menú' : 'Colapsar menú'"
          />
        </div>
        <div class="dashboard-welcome q-mt-md">Bienvenido, {{ userName }}.</div>
        <div class="dashboard-metrics-row q-mb-lg q-mt-md row items-stretch q-col-gutter-md">
          <DashboardSummaryCard
            icon="groups"
            :value="usersCount"
            label="Usuarios Activos"
            icon-color="deep-purple-7"
            bg-color="#f3f0fa"
          />
          <DashboardSummaryCard
            icon="work"
            :value="proyectosCount"
            label="Proyectos activos"
            icon-color="indigo-7"
            bg-color="#f0f4fa"
          />
          <DashboardSummaryCard
            icon="library_books"
            :value="publicacionesCount"
            label="Publicaciones"
            icon-color="teal-7"
            bg-color="#f0faf7"
          />
          <DashboardSummaryCard
            icon="school"
            :value="profesoresCount"
            label="Profesores"
            icon-color="orange-7"
            bg-color="#faf6f0"
          />
        </div>
        <DomainCarousel :items="carouselItems" />
        <router-view class="q-mt-lg" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from 'src/stores/authStore'
import SidebarNav from 'src/components/common/SidebarNav.vue'
import DomainCarousel from 'src/components/common/DomainCarousel.vue'
import DashboardSummaryCard from 'src/components/common/DashboardSummaryCard.vue'
import userService from 'src/services/userService'
import proyectoService from 'src/services/proyectoService'
import publicacionService from 'src/services/publicacionService'
import profesorService from 'src/services/profesorService'

const collapsed = ref(true)
const authStore = useAuthStore()
const userName = computed(() => authStore.user?.nombre || 'Administrador')

const usersCount = ref('-')
const proyectosCount = ref('-')
const publicacionesCount = ref('-')
const profesoresCount = ref('-')

async function fetchMetrics() {
  try {
    const [users, proyectos, publicaciones, profesores] = await Promise.all([
      userService.getAll(),
      proyectoService.getAll(),
      publicacionService.getAll(),
      profesorService.getAll(),
    ])
    // Contar todos los usuarios devueltos por el backend
    let totalUsuarios = 0
    if (Array.isArray(users.data)) {
      totalUsuarios = users.data.length
    } else if (Array.isArray(users.data?.usuarios)) {
      totalUsuarios = users.data.usuarios.length
    }
    usersCount.value = totalUsuarios
    proyectosCount.value = Array.isArray(proyectos.data)
      ? proyectos.data.length
      : proyectos.data?.length || 0
    publicacionesCount.value = Array.isArray(publicaciones.data)
      ? publicaciones.data.length
      : publicaciones.data?.length || 0
    profesoresCount.value = Array.isArray(profesores.data)
      ? profesores.data.length
      : profesores.data?.length || 0
  } catch {
    usersCount.value = proyectosCount.value = publicacionesCount.value = profesoresCount.value = '—'
  }
}
onMounted(fetchMetrics)

const carouselItems = [
  {
    icon: 'groups',
    label: 'Usuarios Activos',
    desc: 'Visualiza y administra los usuarios activos.',
    route: '/admin/Gestion-usuarios',
    endpoint: '/usuarios',
    action: { label: 'Ir', onClick: () => (window.location.href = '/admin/Gestion-usuarios') },
  },
  {
    icon: 'work',
    label: 'Proyectos activos',
    desc: 'Administra todos los proyectos de investigación.',
    route: '/admin/Gestion-Proyectos',
    endpoint: '/proyectos',
    action: { label: 'Ir', onClick: () => (window.location.href = '/admin/Gestion-Proyectos') },
  },
  {
    icon: 'library_books',
    label: 'Publicaciones',
    desc: 'Gestiona publicaciones científicas.',
    route: '/admin/Gestion-publicaciones',
    endpoint: '/publicaciones',
    action: { label: 'Ir', onClick: () => (window.location.href = '/admin/Gestion-publicaciones') },
  },
  {
    icon: 'school',
    label: 'Profesores',
    desc: 'Gestiona los datos de los profesores.',
    route: '/admin/Gestion-profesores',
    endpoint: '/profesores',
    action: { label: 'Ir', onClick: () => (window.location.href = '/admin/Gestion-profesores') },
  },
  {
    icon: 'assignment_ind',
    label: 'Asignación de Proyectos',
    desc: 'Asigna proyectos a profesores y equipos.',
    route: '/admin/Asignacion-Proyectos',
    endpoint: '/asignaciones',
    action: { label: 'Ir', onClick: () => (window.location.href = '/admin/Asignacion-Proyectos') },
  },
  {
    icon: 'menu_book',
    label: 'Gestión de Revistas',
    desc: 'Administra revistas académicas.',
    route: '/admin/gestion-revistas',
    endpoint: '/revistas',
    action: { label: 'Ir', onClick: () => (window.location.href = '/admin/gestion-revistas') },
  },
  {
    icon: 'assignment',
    label: 'Formularios de Investigación',
    desc: 'Gestiona formularios de investigación.',
    route: '/admin/Gestion-formularios-investigacion',
    endpoint: '/formularios',
    action: {
      label: 'Ir',
      onClick: () => (window.location.href = '/admin/Gestion-formularios-investigacion'),
    },
  },
  {
    icon: 'timeline',
    label: 'Líneas de Investigación',
    desc: 'Gestiona líneas de investigación.',
    route: '/admin/Gestion-lineas-investigacion',
    endpoint: '/lineas',
    action: {
      label: 'Ir',
      onClick: () => (window.location.href = '/admin/Gestion-lineas-investigacion'),
    },
  },
  {
    icon: 'groups',
    label: 'Autores de Publicaciones',
    desc: 'Gestiona autores de publicaciones.',
    route: '/admin/Gestion-autores-publicacion',
    endpoint: '/autores',
    action: {
      label: 'Ir',
      onClick: () => (window.location.href = '/admin/Gestion-autores-publicacion'),
    },
  },
  {
    icon: 'chat',
    label: 'Chat IA',
    desc: 'Comunícate con IA.',
    route: '/admin/Chat-interno',
    endpoint: null,
    action: { label: 'Ir', onClick: () => (window.location.href = '/admin/Chat-interno') },
  },
]
</script>

<style lang="scss" scoped>
@import 'src/css/esan.variables.scss';

.dashboard-page {
  background: linear-gradient(120deg, $esan-light-grey 60%, #fff 100%);
  min-height: 100vh;
  font-family: $esan-font-main;
  overflow-x: hidden;
}
.dashboard-flex-row {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  min-height: 100vh;
}
.dashboard-container {
  width: 100%;
  max-width: 1100px;
  background: white;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(34, 34, 34, 0.07);
  padding: 32px 32px 24px 32px;
  position: relative;
  margin-left: 240px;
  transition: margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.dashboard-container.sidebar-collapsed {
  margin-left: 0px;
}
.dashboard-container.sidebar-expanded {
  margin-left: 200px;
}
.dashboard-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}
.dashboard-title {
  font-size: $esan-font-size-title;
  font-family: $esan-font-main;
  color: $esan-red;
  font-weight: 700;
  letter-spacing: 0.5px;
}
.dashboard-welcome {
  color: $esan-grey;
  font-size: $esan-font-size-base;
  font-family: $esan-font-alt;
}
.dashboard-metrics-row {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}
.sidebar-toggle {
  color: $esan-red;
}
</style>
