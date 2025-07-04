<template>
  <div class="loading-overlay">
    <q-spinner size="60px" color="esan-primary" />
    <div class="loading-text">Cargando...</div>
  </div>
</template>

<script setup>
// No props, simple overlay
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(255, 255, 255, 0.7);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.loading-text {
  margin-top: 18px;
  font-size: 1.2rem;
  color: #b80000;
  font-weight: 600;
}
</style>
