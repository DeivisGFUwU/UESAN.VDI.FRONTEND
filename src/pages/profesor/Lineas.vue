<template>
  <q-page class="q-pa-md">
    <div class="text-h6 q-mb-md">Líneas de Investigación</div>
    <q-table
      :rows="lineas"
      :columns="columns"
      row-key="LineaId"
      flat
      bordered
      :pagination="{ rowsPerPage: 10 }"
    />
    <q-banner v-if="errorMsg" class="bg-red text-white q-mt-md">
      {{ errorMsg }}
    </q-banner>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

defineOptions({ name: 'ProfesorLineas' })

const lineas = ref([])
const errorMsg = ref('')

const columns = [
  { name: 'Nombre', label: 'Nombre', field: (row) => row.Nombre || row.nombre, align: 'left' },
]

const API_URL = 'http://localhost:5192/api/lineasinvestigacion'

const cargarLineas = async () => {
  try {
    const token = localStorage.getItem('jwt')
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    })
    let data = []
    if (Array.isArray(res.data)) {
      data = res.data
    } else if (Array.isArray(res.data.lineas)) {
      data = res.data.lineas
    } else if (Array.isArray(res.data.data)) {
      data = res.data.data
    }
    lineas.value = data.map((l) => ({
      ...l,
      Nombre: l.Nombre || l.nombre,
      LineaId: l.LineaId || l.lineaId,
    }))
  } catch {
    errorMsg.value = 'Error al cargar líneas de investigación'
  }
}

onMounted(cargarLineas)
</script>
