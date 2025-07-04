<template>
  <q-header elevated class="header">
    <q-toolbar>
      <q-toolbar-title>
        <img src="/icons/Logo_VDI.png" alt="Logo ESAN VDI" height="40" />
        <span class="text-white">BIENVENIDO!</span>
      </q-toolbar-title>
      <base-button
        flat
        label="Cerrar Sesión"
        color="white"
        customClass="small-btn"
        @click="$emit('logout')"
      />
    </q-toolbar>
  </q-header>
</template>

<script>
import BaseButton from './BaseButton.vue'
export default {
  name: 'MainHeader',
  components: { BaseButton },
}
</script>

<style lang="scss" scoped>
@import 'src/css/esan.variables.scss';
.header {
  background: linear-gradient(90deg, $esan-red 80%, $esan-accent 100%);
  color: white;
  padding: 10px 0 10px 0;
  box-shadow: 0 2px 8px rgba(34, 34, 34, 0.08);
}
.q-toolbar-title img {
  margin-right: 10px;
}
</style>
