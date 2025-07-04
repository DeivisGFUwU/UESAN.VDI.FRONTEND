<template>
  <q-page class="dashboard-page flex flex-center">
    <div class="dashboard-container">
      <div class="dashboard-title">Dashboard Postulante</div>
      <!-- El carrusel se gestiona desde el layout -->
      <div class="dashboard-welcome q-mt-md">
        Bienvenido, postulante. Selecciona una opción del menú.
      </div>
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
.dashboard-welcome {
  color: $esan-grey;
  font-size: $esan-font-size-base;
  font-family: $esan-font-alt;
}
</style>

<script setup>
import { onMounted, getCurrentInstance } from 'vue'
defineOptions({ name: 'PostulanteDashboard' })
// Comunica los items al layout principal
const carouselItems = [
  {
    icon: 'search',
    label: 'Buscar Proyectos',
    desc: 'Explora proyectos de investigación disponibles.',
    action: { label: 'Ir', onClick: () => (window.location.href = '/postulante/buscar-proyectos') },
  },
  {
    icon: 'assignment',
    label: 'Postular',
    desc: 'Envía tu postulación a proyectos activos.',
    action: { label: 'Ir', onClick: () => (window.location.href = '/postulante/postular') },
  },
  {
    icon: 'person',
    label: 'Mi Perfil',
    desc: 'Edita y consulta tu información personal.',
    action: { label: 'Ir', onClick: () => (window.location.href = '/postulante/perfil') },
  },
]
onMounted(() => {
  const vm = getCurrentInstance()
  if (vm && vm.proxy && vm.proxy.$parent) {
    vm.proxy.$parent.carouselItems = carouselItems
  }
})
</script>
