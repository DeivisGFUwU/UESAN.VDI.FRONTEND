<template>
  <div :class="['sidebar-nav', { collapsed }]">
    <div class="sidebar-header">
      <span v-if="!collapsed" class="sidebar-title">Panel</span>
    </div>
    <q-list class="sidebar-list" role="list">
      <q-item
        v-for="item in items"
        :key="item.label"
        clickable
        :active="isActive(item)"
        :class="{ 'sidebar-active': isActive(item) }"
        :aria-current="isActive(item) ? 'page' : undefined"
        :aria-label="item.label"
        role="listitem"
        tabindex="0"
        @click="handleSidebarClick(item)"
      >
        <q-item-section avatar>
          <q-icon :name="item.icon" color="black" />
        </q-item-section>
        <q-item-section v-if="!collapsed">
          <q-item-label>{{ item.label }}</q-item-label>
          <q-item-label caption>{{ item.desc }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
defineProps({
  items: { type: Array, required: true },
  collapsed: { type: Boolean, default: false },
})
const route = useRoute()
const router = useRouter()
function isActive(item) {
  if (!item || !item.route) return false
  // Soporta rutas exactas e ignorando trailing slash
  const current = route.path.replace(/\/$/, '').toLowerCase()
  const target = item.route.replace(/\/$/, '').toLowerCase()
  return current === target
}

function handleSidebarClick(item) {
  // Si el ítem es el chatbot, abre el chat flotante global si existe
  if (item && item.route && item.route.toLowerCase().includes('chat')) {
    // Busca en window si está registrado globalmente
    if (window && window.$chatBotToggle) {
      window.$chatBotToggle()
      return
    }
    // Si no, navega a la ruta normalmente
  }
  // Navegación normal (SPA)
  if (item && item.route) {
    router.push(item.route)
  }
}
</script>

<style lang="scss" scoped>
@import '../../css/esan.variables.scss';
.sidebar-nav {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 240px;
  background: $esan-white;
  box-shadow: 2px 0 8px rgba(34, 34, 34, 0.07);
  z-index: 1000;
  transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  &.collapsed {
    width: 64px;
    .sidebar-title,
    .q-item-label,
    .q-item-label[caption] {
      display: none;
    }
  }
  .sidebar-active {
    background: $esan-light-grey;
    border-right: 4px solid $esan-red;
    color: $esan-red;
    font-weight: 600;
    .q-icon {
      color: $esan-red !important;
    }
    outline: 2px solid $esan-red;
    outline-offset: -2px;
  }
}
.sidebar-header {
  display: flex;
  align-items: center;
  padding: 16px 12px 8px 12px;
  border-bottom: 1px solid $esan-light-grey;
}
.sidebar-title {
  font-family: $esan-font-main;
  font-size: 1.2rem;
  color: $esan-red;
  font-weight: 700;
  margin-left: 12px;
}
.sidebar-list {
  flex: 1;
  padding-top: 8px;
}
.sidebar-toggle {
  color: $esan-red;
}
</style>
