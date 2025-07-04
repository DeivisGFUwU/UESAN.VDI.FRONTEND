<template>
  <q-page class="q-pa-lg">
    <div class="text-h5 q-mb-md">Ver Revistas</div>
    <q-table
      :rows="revistas"
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
import revistaService from 'src/services/revistaService'
defineOptions({ name: 'VerRevistas' })

const revistas = ref([])
const columns = [
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left' },
  { name: 'issn', label: 'ISSN', field: 'issn', align: 'left' },
  { name: 'categoria', label: 'Categoría', field: 'categoria', align: 'left' },
]

onMounted(async () => {
  revistas.value = await revistaService.getAll()
})
</script>
