<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Mis Publicaciones</div>
    <BaseTable
      :rows="publicaciones"
      :columns="columns"
      rowKey="publicacionId"
      flat
      bordered
      :pagination="{ rowsPerPage: 10 }"
    />
    <q-banner v-if="errorMsg" class="bg-red text-white q-mt-md">
      {{ errorMsg }}
    </q-banner>
    <BackButton class="back-btn-bottom" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import BaseTable from 'src/components/common/BaseTable.vue'
import BackButton from 'src/components/common/BackButton.vue'

const publicaciones = ref([])
const errorMsg = ref('')

const columns = [
  { name: 'publicacionId', label: 'ID', field: (row) => row.publicacionId, align: 'left' },
  { name: 'titulo', label: 'Título', field: (row) => row.titulo, align: 'left' },
  {
    name: 'fechaPublicacion',
    label: 'Fecha',
    field: (row) => row.fechaPublicacion,
    align: 'left',
    format: (val) => (val ? new Date(val).toLocaleDateString() : ''),
  },
]

async function cargarPublicaciones() {
  try {
    const token = localStorage.getItem('jwt')
    const response = await api.get('/publicaciones', {
      headers: { Authorization: `Bearer ${token}` },
    })
    let data = []
    if (Array.isArray(response.data)) {
      data = response.data
    } else if (Array.isArray(response.data.publicaciones)) {
      data = response.data.publicaciones
    } else if (Array.isArray(response.data.data)) {
      data = response.data.data
    }
    publicaciones.value = data.map((p) => ({
      publicacionId: p.publicacionId || p.PublicacionId,
      titulo: p.titulo || p.Titulo,
      fechaPublicacion: p.fechaPublicacion || p.FechaPublicacion,
    }))
    errorMsg.value = ''
  } catch (error) {
    errorMsg.value =
      error?.response?.data?.message || error.message || 'Error al obtener publicaciones'
    console.error('Error al obtener publicaciones:', error)
  }
}

onMounted(cargarPublicaciones)
</script>

<style scoped>
.back-btn-bottom {
  position: fixed;
  left: 32px;
  bottom: 32px;
  z-index: 20;
}
</style>
