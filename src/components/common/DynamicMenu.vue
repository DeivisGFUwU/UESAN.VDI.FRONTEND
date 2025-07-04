<template>
  <q-toolbar :color="toolbarColor" class="text-white shadow-2">
    <template v-if="roleId !== 1">
      <q-btn
        v-for="item in filteredMenu"
        :key="item.label"
        flat
        :to="item.route"
        :icon="item.icon"
        :color="item.color"
        class="q-mx-sm"
      >
        {{ item.label }}
      </q-btn>
    </template>
    <q-space />
    <q-avatar color="white" text-color="primary" class="q-mr-sm">{{ userInitials }}</q-avatar>
    <span class="q-mr-md">{{ userName }} ({{ userRoleLabel }})</span>
    <BaseButton label="Cerrar Sesión" color="negative" flat @click="$emit('logout')" />
  </q-toolbar>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from 'src/stores/authStore'
import BaseButton from './BaseButton.vue'

const authStore = useAuthStore()
const user = computed(() => authStore.user || {})
const roleId = computed(() => user.value.roleId)
const userInitials = computed(() => (user.value.nombre || 'U')[0])
const userName = computed(() => user.value.nombre || 'Usuario')
const userRoleLabel = computed(() => {
  if (roleId.value === 1) return 'Administrador'
  if (roleId.value === 2) return 'Profesor'
  return 'Usuario'
})

const menuOptions = [
  {
    label: 'Gestión Formularios Investigación',
    route: '/admin/gestion-formularios-investigacion',
    icon: 'assignment',
    color: 'deep-purple-5',
    roles: [1],
  },
  {
    label: 'Dashboard',
    route: '/dashboard',
    icon: 'dashboard',
    color: 'primary',
    roles: [1, 2, 3],
  },
  {
    label: 'Gestión Usuarios',
    route: '/admin/gestion-usuarios',
    icon: 'manage_accounts',
    color: 'deep-purple-5',
    roles: [1],
  },
  {
    label: 'Gestión Proyectos',
    route: '/admin/gestion-proyectos',
    icon: 'work',
    color: 'deep-purple-5',
    roles: [1],
  },
  {
    label: 'Gestión Publicaciones',
    route: '/admin/gestion-publicaciones',
    icon: 'library_books',
    color: 'deep-purple-5',
    roles: [1],
  },
  {
    label: 'Gestión Revistas',
    route: '/admin/gestion-revistas',
    icon: 'menu_book',
    color: 'deep-purple-5',
    roles: [1],
  },
  {
    label: 'Mis Publicaciones',
    route: '/profesor/publicaciones',
    icon: 'library_books',
    color: 'indigo-5',
    roles: [2],
  },
  {
    label: 'Mis Proyectos',
    route: '/profesor/proyectos',
    icon: 'work',
    color: 'indigo-5',
    roles: [2],
  },
  {
    label: 'Formularios',
    route: '/profesor/formularios',
    icon: 'assignment',
    color: 'indigo-5',
    roles: [2],
  },
  {
    label: 'Revistas',
    route: '/profesor/revistas',
    icon: 'menu_book',
    color: 'indigo-5',
    roles: [2, 3],
  },
  {
    label: 'Publicaciones',
    route: '/publicaciones',
    icon: 'library_books',
    color: 'blue-grey-5',
    roles: [3],
  },
  { label: 'Perfil', route: '/perfil', icon: 'person', color: 'grey-8', roles: [1, 2, 3] },
  { label: 'Chat', route: '/chat', icon: 'chat', color: 'teal-5', roles: [1, 2] },
]

const filteredMenu = computed(() => menuOptions.filter((opt) => opt.roles.includes(roleId.value)))

const toolbarColor = computed(() => {
  if (roleId.value === 1) return 'deep-purple-8'
  if (roleId.value === 2) return 'indigo-7'
  return 'blue-grey-7'
})
</script>

<style scoped>
.q-toolbar {
  min-height: 64px;
  font-size: 1.1rem;
}
.q-btn {
  font-weight: 500;
  letter-spacing: 0.5px;
}
</style>
