<template>
  <div class="q-pa-xl">
    <h2>Perfil de usuario</h2>
    <div v-if="user">
      <p><b>Nombre:</b> {{ user.nombre }}</p>
      <p><b>Apellido:</b> {{ user.apellido }}</p>
      <p><b>Email:</b> {{ user.email }}</p>
      <p><b>Rol:</b> {{ user.rol }}</p>
    </div>
    <div v-else>
      <p>No hay datos de usuario.</p>
    </div>
  </div>
</template>

<script setup>
import RespJWT from '../../models/RespJWT'
import { ref, onMounted } from 'vue'

const user = ref(null)

onMounted(() => {
  user.value = RespJWT.fromLocalStorage()
})
</script>
