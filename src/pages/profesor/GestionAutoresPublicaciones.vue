<template>
  <q-page class="q-pa-md" style="position: relative; min-height: 80vh">
    <div class="text-h5 q-mb-md">Mis Autores de Publicaciones</div>
    <div class="row q-mb-md items-center">
      <BaseButton color="primary" label="Nuevo Autor" customClass="q-mr-md" disabled />
    </div>
    <BaseTable
      :rows="autores"
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
import BaseButton from 'src/components/common/BaseButton.vue'
import BaseTable from 'src/components/common/BaseTable.vue'
import BackButton from 'src/components/common/BackButton.vue'

const autores = ref([])
const errorMsg = ref('')

const columns = [
  {
    name: 'publicacionId',
    label: 'ID Publicación',
    field: (row) => row.publicacionId || row.PublicacionId,
    align: 'left',
  },
  {
    name: 'profesorId',
    label: 'ID Profesor',
    field: (row) => row.profesorId || row.ProfesorId,
    align: 'left',
  },
  {
    name: 'ordenAutor',
    label: 'Orden',
    field: (row) => row.ordenAutor || row.OrdenAutor,
    align: 'left',
  },
  {
    name: 'porcentajeParticipacion',
    label: '% Participación',
    field: (row) => row.porcentajeParticipacion || row.PorcentajeParticipacion,
    align: 'left',
  },
]

async function cargarAutores() {
  try {
    const token = localStorage.getItem('jwt')
    const response = await api.get('/AutoresPublicacion', {
      headers: { Authorization: `Bearer ${token}` },
    })
    let data = []
    if (Array.isArray(response.data)) {
      data = response.data
    } else if (Array.isArray(response.data.autores)) {
      data = response.data.autores
    } else if (Array.isArray(response.data.data)) {
      data = response.data.data
    }
    autores.value = data.map((a) => ({
      publicacionId: a.publicacionId || a.PublicacionId,
      profesorId: a.profesorId || a.ProfesorId,
      ordenAutor: a.ordenAutor || a.OrdenAutor,
      porcentajeParticipacion: a.porcentajeParticipacion || a.PorcentajeParticipacion,
    }))
    errorMsg.value = ''
  } catch (error) {
    errorMsg.value = error?.response?.data?.message || error.message || 'Error al obtener autores'
    console.error('Error al obtener autores:', error)
  }
}

onMounted(cargarAutores)
</script>

<style scoped>
.back-btn-bottom {
  position: fixed;
  left: 32px;
  bottom: 32px;
  z-index: 20;
}
</style>
