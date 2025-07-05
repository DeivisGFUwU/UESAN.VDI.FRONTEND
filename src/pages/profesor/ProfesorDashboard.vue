<template>
  <q-page class="dashboard-page fondo-biblioteca">
    <div class="dashboard-bg-overlay"></div>
    <div class="dashboard-header-bar">
      <div class="header-left">
        <q-btn flat dense icon="menu" class="sidebar-toggle" @click="collapsed = !collapsed" />
        <img src="/icons/Logo_VDI.png" alt="Logo ESAN VDI" class="esan-logo" />
      </div>
      <div class="header-right">
        <q-btn flat dense icon="language" class="header-icon" />
        <!-- Eliminado ícono de chat -->
        <img src="/icons/anonimo.jpg" alt="Usuario" class="user-avatar" />
      </div>
    </div>
    <div class="dashboard-flex-row">
      <SidebarNav :items="sidebarItems" :collapsed="collapsed" />
      <div class="dashboard-main-content">
        <div
          class="dashboard-container"
          :class="{ 'sidebar-collapsed': collapsed, 'sidebar-expanded': !collapsed }"
        >
          <div class="dashboard-title-row">
            <div class="dashboard-title">Panel de Profesor</div>
            <div style="display: flex; align-items: center; gap: 8px">
              <q-btn
                flat
                dense
                icon="logout"
                color="negative"
                label="Cerrar sesión"
                @click="logout"
                class="logout-btn"
              />
            </div>
          </div>
          <div class="dashboard-welcome q-mt-md">
            Bienvenido, profesor <span class="prof-name">{{ profesorNombre }}</span
            >.
            <div class="prof-avatar-wrapper">
              <img
                :src="authStore.user?.fotoUrl || '/icons/foto.png'"
                alt="Avatar Profesor"
                class="prof-avatar"
              />
            </div>
          </div>
          <div class="dashboard-content-row">
            <div class="dashboard-content-left">
              <router-view class="q-mt-lg" />
              <ChatBot />
            </div>
            <div class="dashboard-content-right">
              <DomainCarousel :items="carouselItems" />
            </div>
          </div>
          <div class="dashboard-news-section">
            <div class="dashboard-news-title">Noticias</div>
            <q-carousel
              v-model="newsSlide"
              animated
              control-color="black"
              arrows
              height="350px"
              class="dashboard-news-carousel"
            >
              <q-carousel-slide :name="1">
                <img
                  src="/icons/Noticia1.jpeg"
                  alt="Noticia 1"
                  style="
                    width: 235px;
                    height: 333px;
                    object-fit: cover;
                    margin: 0 auto;
                    border-radius: 12px;
                  "
                />
              </q-carousel-slide>
              <q-carousel-slide :name="2">
                <img
                  src="/icons/Noticia2.png"
                  alt="Noticia 2"
                  style="
                    width: 235px;
                    height: 333px;
                    object-fit: cover;
                    margin: 0 auto;
                    border-radius: 12px;
                  "
                />
              </q-carousel-slide>
            </q-carousel>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import ChatBot from 'src/components/chatBot/chatBot.vue'
import { useRouter } from 'vue-router'
import SidebarNav from 'src/components/common/SidebarNav.vue'
import DomainCarousel from 'src/components/common/DomainCarousel.vue'
import { useAuthStore } from 'src/stores/authStore'

const collapsed = ref(false)
const router = useRouter()
const authStore = useAuthStore()
const profesorNombre = authStore.user?.nombre || ''

function logout() {
  localStorage.clear()
  sessionStorage.clear()
  router.push('/')
}

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
]

const newsSlide = ref(1)
</script>

<style lang="scss" scoped>
@import 'src/css/esan.variables.scss';
.dashboard-page.fondo-biblioteca {
  position: relative;
  min-height: 100vh;
  font-family: $esan-font-main;
  background: none;
}
.dashboard-bg-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  background:
    linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)),
    url('/icons/BibliotecaFOndo.jpg') center center/cover no-repeat;
  filter: brightness(0.7) blur(0.5px);
  pointer-events: none;
}
.dashboard-header-bar {
  width: 100vw;
  height: 56px;
  background: #181818;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px 0 0;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 100%;
  padding-left: 16px;
}
.esan-logo {
  height: 38px;
  margin-left: 8px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}
.header-icon {
  color: #fff;
  font-size: 22px;
}
.user-avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  background: #eee;
}
.dashboard-flex-row,
.dashboard-container {
  position: relative;
  z-index: 1;
}
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
.dashboard-main-content {
  width: 100%;
  display: flex;
  margin-top: 56px;
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
.dashboard-content-row {
  display: flex;
  flex-direction: row;
  gap: 32px;
}
.dashboard-content-left {
  flex: 2;
  min-width: 0;
}
.dashboard-content-right {
  flex: 1;
  min-width: 280px;
  max-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: flex-start;
  margin-top: 16px;
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
.sidebar-toggle {
  color: $esan-red;
}
.logout-btn {
  color: $esan-red;
  font-weight: 600;
}
.dashboard-news-section {
  margin: 32px 0 0 0;
  padding: 24px 0 0 0;
  border-top: 1px solid #e0e0e0;
}
.dashboard-news-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #181818;
  margin-bottom: 16px;
}
.dashboard-news-carousel {
  max-width: 706px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
}
.dashboard-news-carousel img {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.prof-avatar-wrapper {
  display: flex;
  justify-content: flex-start;
  margin-top: 8px;
}
.prof-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #d50000;
  background: #eee;
}
.prof-name {
  color: $esan-red;
  font-weight: 700;
  font-size: 1.1em;
}
</style>
