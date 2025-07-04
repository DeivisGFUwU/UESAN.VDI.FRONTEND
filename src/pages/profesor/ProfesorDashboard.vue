<template>
  <q-page class="dashboard-page flex flex-center">
    <div class="dashboard-container">
      <div class="dashboard-title">Dashboard Profesor</div>
      <!-- El carrusel se gestiona desde el layout -->
      <router-view class="q-mt-lg" />
    </div>
  </q-page>
</template>
<style lang="scss" scoped>
@import 'src/css/esan.variables.scss';

.dashboard-page {
  background: linear-gradient(120deg, $esan-light-grey 60%, #fff 100%);
  min-height: 100vh;
  font-family: $esan-font-main;
}
.dashboard-container {
  width: 100%;
  max-width: 1100px;
  background: white;
  border-radius: 18px;
  box-shadow: 0 2px 16px rgba(34, 34, 34, 0.07);
  padding: 32px 32px 24px 32px;
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

<script setup>
import { onMounted, getCurrentInstance } from 'vue'
// Comunica los items al layout principal
const carouselItems = [
  {
    icon: 'work',
    label: 'Proyectos',
    desc: 'Visualiza y gestiona tus proyectos de investigación.',
    action: { label: 'Ir', onClick: () => (window.location.href = '/profesor/proyectos') },
  },
  {
    icon: 'article',
    label: 'Publicaciones',
    desc: 'Administra tus publicaciones científicas.',
    action: { label: 'Ir', onClick: () => (window.location.href = '/profesor/publicaciones') },
  },
  {
    icon: 'assignment',
    label: 'Formularios de Investigación',
    desc: 'Completa y revisa formularios de investigación.',
    action: { label: 'Ir', onClick: () => (window.location.href = '/profesor/formularios') },
  },
  {
    icon: 'timeline',
    label: 'Líneas de Investigación',
    desc: 'Consulta las líneas de investigación disponibles.',
    action: { label: 'Ir', onClick: () => (window.location.href = '/profesor/lineas') },
  },
  {
    icon: 'menu_book',
    label: 'Revistas',
    desc: 'Accede a revistas académicas.',
    action: { label: 'Ir', onClick: () => (window.location.href = '/profesor/revistas') },
  },
  {
    icon: 'chat',
    label: 'Chat',
    desc: 'Comunícate con otros profesores.',
    action: { label: 'Ir', onClick: () => (window.location.href = '/profesor/chat') },
  },
  {
    icon: 'person',
    label: 'Mi Perfil',
    desc: 'Edita y consulta tu información personal.',
    action: { label: 'Ir', onClick: () => (window.location.href = '/profesor/perfil') },
  },
]
onMounted(() => {
  const vm = getCurrentInstance()
  if (vm && vm.proxy && vm.proxy.$parent) {
    vm.proxy.$parent.carouselItems = carouselItems
  }
})
</script>
