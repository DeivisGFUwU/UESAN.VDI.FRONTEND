<template>
  <q-page class="dashboard-page flex flex-center">
    <div class="dashboard-container">
      <div class="dashboard-title">Dashboard Postulante</div>
      <div class="dashboard-welcome q-mt-md">
        Bienvenido, postulante. Selecciona una función para continuar.
      </div>
      <div class="dashboard-actions q-mt-xl row q-col-gutter-lg q-mb-md">
        <div
          v-for="item in dashboardItems"
          :key="item.label"
          class="col-12 col-sm-6 col-md-4 q-mb-lg"
        >
          <q-card class="q-pa-md function-card flex flex-center column items-center">
            <q-icon :name="item.icon" size="48px" color="primary" class="q-mb-md" />
            <div class="function-title q-mb-xs">{{ item.label }}</div>
            <div class="function-desc q-mb-md">{{ item.desc }}</div>
            <q-btn color="primary" :label="item.action.label" @click="item.action.onClick" />
          </q-card>
        </div>
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
.function-card {
  min-height: 260px;
  border-radius: 14px;
  box-shadow: 0 2px 12px rgba(34, 34, 34, 0.06);
  transition: box-shadow 0.2s;
  &:hover {
    box-shadow: 0 4px 24px rgba(34, 34, 34, 0.12);
  }
}
.function-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: $esan-red;
}
.function-desc {
  color: $esan-grey;
  font-size: 1rem;
  text-align: center;
}
</style>

<script setup>
import { onMounted, getCurrentInstance, useRouter } from 'vue'
defineOptions({ name: 'PostulanteDashboard' })

const router = useRouter()

const dashboardItems = [
  {
    icon: 'search',
    label: 'Buscar Proyectos',
    desc: 'Explora proyectos de investigación disponibles.',
    action: { label: 'Ir', onClick: () => router.push('/postulante/buscar-proyectos') },
  },
  {
    icon: 'assignment',
    label: 'Postular a Proyectos',
    desc: 'Envía tu postulación a proyectos activos.',
    action: { label: 'Ir', onClick: () => router.push('/postulante/postular') },
  },
  {
    icon: 'library_books',
    label: 'Ver Publicaciones',
    desc: 'Consulta publicaciones científicas y académicas.',
    action: { label: 'Ir', onClick: () => router.push('/postulante/publicaciones') },
  },
  {
    icon: 'menu_book',
    label: 'Ver Revistas',
    desc: 'Accede a revistas indexadas y recursos.',
    action: { label: 'Ir', onClick: () => router.push('/postulante/revistas') },
  },
  {
    icon: 'person',
    label: 'Mi Perfil',
    desc: 'Edita y consulta tu información personal.',
    action: { label: 'Ir', onClick: () => router.push('/postulante/perfil') },
  },
]

onMounted(() => {
  const vm = getCurrentInstance()
  if (vm && vm.proxy && vm.proxy.$parent) {
    vm.proxy.$parent.carouselItems = dashboardItems
  }
})
</script>
