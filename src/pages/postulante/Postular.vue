<template>
  <q-page class="q-pa-lg">
    <div class="text-h5 q-mb-md">Postular a Proyectos</div>
    <q-banner class="bg-grey-2 text-grey-8 q-mb-md"
      >Solo puedes visualizar los proyectos disponibles. Para postular, contacta a un
      administrador.</q-banner
    >
    <q-table
      :rows="proyectos"
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
import proyectoService from 'src/services/proyectoService'
defineOptions({ name: 'PostularProyectos' })

const proyectos = ref([])
const columns = [
  { name: 'titulo', label: 'Título', field: 'titulo', align: 'left' },
  { name: 'linea', label: 'Línea', field: 'linea', align: 'left' },
  { name: 'profesor', label: 'Profesor', field: 'profesor', align: 'left' },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'left' },
]

onMounted(async () => {
  proyectos.value = await proyectoService.getAll()
})
</script>
