<template>
  <q-page class="q-pa-lg">
    <div class="text-h5 q-mb-md">Mi Perfil</div>
    <q-card class="q-pa-md q-mb-md">
      <q-list>
        <q-item>
          <q-item-section label>Nombre</q-item-section>
          <q-item-section>{{ perfil.nombre }}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section label>Apellido</q-item-section>
          <q-item-section>{{ perfil.apellido }}</q-item-section>
        </q-item>
        <q-item>
          <q-item-section label>Correo</q-item-section>
          <q-item-section>{{ perfil.correo }}</q-item-section>
        </q-item>
      </q-list>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import userService from 'src/services/userService'
defineOptions({ name: 'PerfilPostulante' })

const perfil = ref({ nombre: '', apellido: '', correo: '' })

onMounted(async () => {
  perfil.value = await userService.getPerfil()
})
</script>
