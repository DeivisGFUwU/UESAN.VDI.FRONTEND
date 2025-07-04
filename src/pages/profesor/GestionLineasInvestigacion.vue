<template>
  <q-page class="q-pa-md">
    <div class="text-h6 q-mb-md">Líneas de Investigación</div>
    <BaseTable
      :rows="lineas"
      :columns="columns"
      rowKey="lineaId"
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
import { api } from 'src/boot/axios'
import BaseTable from 'src/components/common/BaseTable.vue'

const lineas = ref([])
const errorMsg = ref('')

const columns = [
  { name: 'nombre', label: 'Nombre', field: (row) => row.nombre || row.Nombre, align: 'left' },
]

async function cargarLineas() {
  try {
    const token = localStorage.getItem('jwt')
    // El endpoint correcto es /api/lineasinvestigacion
    const res = await api.get('/lineasinvestigacion', {
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
      nombre: l.nombre || l.Nombre,
      lineaId: l.lineaId || l.LineaId,
    }))
  } catch {
    errorMsg.value = 'Error al cargar líneas de investigación'
  }
}

onMounted(cargarLineas)
</script>
