<template>
  <q-page class="q-pa-lg">
    <div class="text-h5 q-mb-md">Ver Publicaciones</div>
    <q-table
      :rows="publicaciones"
      :columns="columns"
      row-key="id"
      flat
      bordered
      :pagination="{ rowsPerPage: 10 }"
      class="q-mt-md"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import publicacionService from 'src/services/publicacionService'
defineOptions({ name: 'VerPublicaciones' })

const publicaciones = ref([])
const columns = [
  { name: 'titulo', label: 'Título', field: 'titulo', align: 'left' },
  { name: 'revista', label: 'Revista', field: 'revista', align: 'left' },
  { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'left' },
]

onMounted(async () => {
  publicaciones.value = await publicacionService.getAll()
})
</script>
