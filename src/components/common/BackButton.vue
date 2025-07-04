<template>
  <div class="back-btn-wrapper">
    <q-btn
      flat
      round
      color="primary"
      icon="arrow_back"
      @click="goBack"
      class="back-btn"
      :aria-label="label"
    />
    <span class="back-label">{{ label }}</span>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const props = defineProps({
  label: { type: String, default: 'Volver' },
  to: { type: String, default: '' },
})
const router = useRouter()
function goBack() {
  // Si hay historial, vuelve; si no, redirige a la ruta 'to' si está definida
  if (window.history.length > 1) {
    router.back()
  } else if (props.to) {
    router.push(props.to)
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.back-btn-wrapper {
  display: flex;
  align-items: center;
  position: absolute;
  top: 24px;
  left: 24px;
  z-index: 10;
}
.back-btn {
  box-shadow: 0 2px 8px rgba(34, 34, 34, 0.1);
  font-size: 1.5rem;
  margin-right: 8px;
  transition: background 0.2s;
}
.back-btn:hover {
  background: #f0f0f0;
}
.back-label {
  font-family: var(--q-font-family, 'Roboto', sans-serif);
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
  letter-spacing: 0.5px;
}
</style>
