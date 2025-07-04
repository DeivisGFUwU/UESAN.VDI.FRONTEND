<template>
  <q-page class="dashboard-page">
    <div class="dashboard-flex-row">
      <div class="dashboard-sidebar-header">
        <q-btn
          flat
          dense
          icon="menu"
          class="sidebar-toggle"
          @click="collapsed = !collapsed"
          :aria-label="collapsed ? 'Expandir menú' : 'Colapsar menú'"
        />
      </div>
      <SidebarNav :items="sidebarItems" :collapsed="collapsed" />
      <div
        class="dashboard-container"
        :class="{ 'sidebar-collapsed': collapsed, 'sidebar-expanded': !collapsed }"
      >
        <div class="dashboard-title-row">
          <div class="dashboard-title">Panel de Profesor</div>
        </div>
        <div class="dashboard-welcome q-mt-md">Bienvenido, profesor.</div>
        <DomainCarousel :items="carouselItems" />
        <router-view class="q-mt-lg" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import SidebarNav from 'src/components/common/SidebarNav.vue'
import DomainCarousel from 'src/components/common/DomainCarousel.vue'

const collapsed = ref(false)

const sidebarItems = [
  {
    icon: 'work',
    label: 'Proyectos',
    desc: 'Gestiona tus proyectos',
    route: '/profesor/GestionProyectos',
  },
  {
    icon: 'article',
    label: 'Publicaciones',
    desc: 'Gestiona tus publicaciones',
    route: '/profesor/GestionPublicaciones',
  },
  {
    icon: 'assignment',
    label: 'Formularios de Investigación',
    desc: 'Gestiona tus formularios',
    route: '/profesor/GestionFormulariosInvestigacion',
  },
  {
    icon: 'timeline',
    label: 'Líneas de Investigación',
    desc: 'Consulta líneas de investigación',
    route: '/profesor/GestionLineasInvestigacion',
  },
  {
    icon: 'menu_book',
    label: 'Revistas',
    desc: 'Consulta revistas académicas',
    route: '/profesor/GestionRevistas',
  },
  {
    icon: 'groups',
    label: 'Autores de Publicaciones',
    desc: 'Gestiona tus autores',
    route: '/profesor/GestionAutoresPublicaciones',
  },
]

const carouselItems = [
  {
    icon: 'work',
    label: 'Proyectos',
    desc: 'Visualiza y gestiona tus proyectos de investigación.',
    action: { label: 'Ir', route: '/profesor/GestionProyectos' },
  },
  {
    icon: 'article',
    label: 'Publicaciones',
    desc: 'Administra tus publicaciones científicas.',
    action: { label: 'Ir', route: '/profesor/GestionPublicaciones' },
  },
  {
    icon: 'assignment',
    label: 'Formularios de Investigación',
    desc: 'Completa y revisa formularios de investigación.',
    action: { label: 'Ir', route: '/profesor/GestionFormulariosInvestigacion' },
  },
  {
    icon: 'timeline',
    label: 'Líneas de Investigación',
    desc: 'Consulta líneas de investigación.',
    action: { label: 'Ir', route: '/profesor/GestionLineasInvestigacion' },
  },
  {
    icon: 'menu_book',
    label: 'Revistas',
    desc: 'Consulta revistas académicas.',
    action: { label: 'Ir', route: '/profesor/GestionRevistas' },
  },
  {
    icon: 'groups',
    label: 'Autores de Publicaciones',
    desc: 'Gestiona tus autores de publicaciones.',
    action: { label: 'Ir', route: '/profesor/GestionAutoresPublicaciones' },
  },
]
</script>

<style lang="scss" scoped>
@import 'src/css/esan.variables.scss';
.dashboard-page {
  background: linear-gradient(120deg, $esan-light-grey 60%, #fff 100%);
  min-height: 100vh;
  font-family: $esan-font-main;
}
.dashboard-flex-row {
  display: flex;
  flex-direction: row;
  min-height: 100vh;
}
.dashboard-sidebar-header {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  z-index: 10;
  background: transparent;
  padding: 16px 32px 0 0;
}
.dashboard-container {
  width: 100%;
  max-width: 1100px;
  background: white;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(34, 34, 34, 0.07);
  padding: 32px 32px 24px 32px;
  margin-left: 240px;
  transition: margin-left 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
.sidebar-collapsed {
  margin-left: 64px !important;
}
.dashboard-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dashboard-title {
  font-size: $esan-font-size-title;
  font-family: $esan-font-main;
  color: $esan-red;
  font-weight: 700;
  margin-bottom: 18px;
  letter-spacing: 0.5px;
}
</style>
