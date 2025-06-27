<template>
  <q-layout view="lHh Lpr lFf">
    <!-- Encabezado principal -->
    <q-header elevated class="bg-esan-primary text-white shadow-10">
      <q-toolbar class="font-sans">
        <!-- Botón para abrir el left drawer -->
        <q-btn flat round dense icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />

        <!-- Imagen y nombre de usuario -->
        <q-btn flat class="row items-center q-ml-md" @click="goToProfile" style="min-width: 0">
          <q-avatar size="32px">
            <img :src="userImage" alt="User" />
          </q-avatar>
          <span
            class="q-ml-sm font-semibold text-base"
            style="color: #fff; font-family: 'Inter', sans-serif"
            >{{ userName }}</span
          >
        </q-btn>
        <q-btn
          flat
          round
          dense
          icon="logout"
          @click="logout"
          class="q-ml-sm"
          :aria-label="'Cerrar sesión'"
        />

        <q-space />

        <!-- Logo institucional a la derecha -->
        <div class="flex items-center q-ml-md">
          <div class="text-center mr-2 leading-tight">
            <span
              class="block text-[10px] text-white font-bold"
              style="font-family: 'Roboto', sans-serif; letter-spacing: 0.08em"
              >VDI</span
            >
            <span
              class="block text-2xl text-white font-bold"
              style="font-family: 'Roboto', sans-serif; letter-spacing: 0.04em; line-height: 1"
              >esan</span
            >
          </div>
          <img src="/icons/logoEsan.png" alt="Logo ESAN" height="40" />
        </div>
      </q-toolbar>
    </q-header>

    <!-- Left Drawer -->
    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-white font-sans">
      <q-list>
        <q-item-label header class="text-esan-primary font-bold">Menú</q-item-label>
        <q-item clickable v-for="item in drawerItems" :key="item.label">
          <q-item-section avatar>
            <q-icon :name="item.icon" class="text-esan-primary" />
          </q-item-section>
          <q-item-section class="font-medium text-esan-primary">{{ item.label }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <!-- Contenido principal -->
    <q-page-container class="bg-[#F8F8F8] font-sans">
      <router-view />
    </q-page-container>

    <!-- Botón flotante para chat IA -->
    <q-fab icon="cloud" color="esan-primary" class="fab-chat" @click="goToChat" />
  </q-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { parseJwt } from '../boot/tokenRefresh'
import RespJWT from '../models/RespJWT'

const leftDrawerOpen = ref(false)
const router = useRouter()

const userName = ref('Nombre Apellido')
const userImage = '/icons/favicon-128x128.png'

onMounted(() => {
  const user = RespJWT.fromLocalStorage()
  if (user && user.nombre && user.apellido) {
    userName.value = `${user.nombre} ${user.apellido}`
  } else {
    // Fallback: intentar extraer del JWT si no hay user en localStorage
    const token = localStorage.getItem('jwt')
    if (token) {
      try {
        const payload = parseJwt(token)
        if (payload && payload.nombre && payload.apellido) {
          userName.value = `${payload.nombre} ${payload.apellido}`
        } else {
          const jwtObj = JSON.parse(atob(token.split('.')[1]))
          if (jwtObj.nombre && jwtObj.apellido) {
            userName.value = `${jwtObj.nombre} ${jwtObj.apellido}`
          }
        }
      } catch {
        userName.value = 'Usuario'
      }
    }
  }
})

// Menú dinámico según rol (dummy, luego conectar con JWT/store)
const drawerItems = [
  { label: 'Inicio', icon: 'home' },
  { label: 'Perfil', icon: 'person' },
  // ...agregar más según el rol
]

function goToChat() {
  router.push('/chat') // Ruta a componente de chat IA
}

function goToProfile() {
  router.push('/perfil') // Ruta a componente de perfil
}

function logout() {
  // Aquí se debe limpiar el token y cualquier info de sesión
  localStorage.removeItem('jwt')
  RespJWT.clearLocalStorage()
  // Si usas Pinia/Vuex, limpia el store aquí
  router.push('/login') // Redirige al login
}
</script>

<style scoped>
.fab-chat {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1000;
}

.q-header {
  /* Sombra y color institucional */
  box-shadow: 0 4px 16px 0 rgba(31, 38, 135, 0.1);
  background-color: #b80000 !important;
}

.q-toolbar {
  font-family: 'Inter', sans-serif !important;
}

.q-drawer {
  font-family: 'Inter', sans-serif !important;
}

.q-item-label.header {
  color: #b80000 !important;
  font-family: 'Inter', sans-serif !important;
  font-weight: 700 !important;
}

.q-item-section {
  font-family: 'Inter', sans-serif !important;
  color: #b80000 !important;
}

.q-page-container {
  background-color: #f8f8f8 !important;
  font-family: 'Inter', sans-serif !important;
}
</style>
