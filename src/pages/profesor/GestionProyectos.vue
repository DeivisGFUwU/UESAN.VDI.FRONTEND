<template>
  <q-page class="q-pa-md" style="position: relative">
    <div class="text-h5 q-mb-md">Mis Proyectos</div>
    <div class="row q-mb-md items-center">
      <BaseButton color="primary" label="Nuevo Proyecto" customClass="q-mr-md" disabled />
      <BaseInput
        v-model="busquedaTitulo"
        label="Buscar por Título"
        dense
        customClass="q-ml-md q-mr-sm"
        style="max-width: 200px"
      />
      <BaseInput
        v-model="busquedaEstatus"
        label="Buscar por Estatus"
        dense
        customClass="q-mr-sm"
        style="max-width: 150px"
      />
    </div>
    <BaseTable
      :rows="proyectosFiltrados"
      :columns="columns"
      rowKey="proyectoId"
      flat
      bordered
      :pagination="{ rowsPerPage: 5 }"
    />
    <q-banner v-if="errorMsg" class="bg-red text-white q-mt-md">
      {{ errorMsg }}
    </q-banner>
    <BackButton class="back-btn-bottom" />
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from 'src/boot/axios'
import BaseInput from 'src/components/common/BaseInput.vue'
import BaseButton from 'src/components/common/BaseButton.vue'
import BaseTable from 'src/components/common/BaseTable.vue'
import BackButton from 'src/components/common/BackButton.vue'

const proyectos = ref([])
const errorMsg = ref('')
const busquedaTitulo = ref('')
const busquedaEstatus = ref('')

const columns = [
  {
    name: 'proyectoId',
    label: 'ID',
    field: (row) => row.proyectoId || row.ProyectoId,
    align: 'left',
  },
  { name: 'titulo', label: 'Título', field: (row) => row.titulo || row.Titulo, align: 'left' },
  { name: 'estatus', label: 'Estatus', field: (row) => row.estatus || row.Estatus, align: 'left' },
]

const proyectosFiltrados = computed(() => {
  let lista = proyectos.value
  if (busquedaTitulo.value) {
    lista = lista.filter((p) =>
      (p.titulo || p.Titulo || '').toLowerCase().includes(busquedaTitulo.value.toLowerCase()),
    )
  }
  if (busquedaEstatus.value) {
    lista = lista.filter((p) =>
      (p.estatus || p.Estatus || '').toLowerCase().includes(busquedaEstatus.value.toLowerCase()),
    )
  }
  return lista
})

async function cargarProyectos() {
  try {
    const token = localStorage.getItem('jwt')
    const response = await api.get('/proyectos', {
      headers: { Authorization: `Bearer ${token}` },
    })
    let data = []
    if (Array.isArray(response.data)) {
      data = response.data
    } else if (Array.isArray(response.data.proyectos)) {
      data = response.data.proyectos
    } else if (Array.isArray(response.data.data)) {
      data = response.data.data
    }
    proyectos.value = data.map((p) => ({
      proyectoId: p.proyectoId || p.ProyectoId,
      titulo: p.titulo || p.Titulo,
      estatus: p.estatus || p.Estatus,
    }))
    errorMsg.value = ''
  } catch (error) {
    errorMsg.value = error?.response?.data?.message || error.message || 'Error al obtener proyectos'
    console.error('Error al obtener proyectos:', error)
  }
}

onMounted(cargarProyectos)
</script>

<style scoped>
.back-btn-bottom {
  position: fixed;
  left: 32px;
  bottom: 32px;
  z-index: 20;
}
</style>
