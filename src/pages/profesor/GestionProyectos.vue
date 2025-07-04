<template>
  <q-page class="q-pa-md" style="position: relative">
    <div class="text-h5 q-mb-md">Mis Proyectos</div>
    <div class="row q-mb-md items-center">
      <q-btn
        color="primary"
        label="Nuevo Proyecto"
        class="q-mr-md"
        @click="abrirModalNuevo = true"
      />
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
    <q-dialog v-model="abrirModalNuevo">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Nuevo Proyecto</div>
        </q-card-section>
        <q-card-section>
          <q-input v-model="nuevoProyecto.proyectoId" label="ID" dense type="number" min="1" />
          <q-input v-model="nuevoProyecto.titulo" label="Título" dense class="q-mt-sm" />
          <q-select
            v-model="nuevoProyecto.estatus"
            label="Estatus"
            :options="estatusOptions"
            dense
            class="q-mt-sm"
            emit-value
            map-options
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="grey" v-close-popup @click="resetNuevoProyecto" />
          <q-btn flat label="Crear" color="primary" :loading="creando" @click="crearProyecto" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-banner v-if="errorMsg" class="bg-red text-white q-mt-md">
      {{ errorMsg }}
    </q-banner>
    <q-banner v-if="successMsg" class="bg-green text-white q-mt-md">
      {{ successMsg }}
    </q-banner>
    <BackButton class="back-btn-bottom" />
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from 'src/boot/axios'
import BaseInput from 'src/components/common/BaseInput.vue'
import BaseTable from 'src/components/common/BaseTable.vue'
import BackButton from 'src/components/common/BackButton.vue'

const proyectos = ref([])
const errorMsg = ref('')
const busquedaTitulo = ref('')
const busquedaEstatus = ref('')
const abrirModalNuevo = ref(false)
const creando = ref(false)
const successMsg = ref('')
const nuevoProyecto = ref({ proyectoId: '', titulo: '', estatus: '' })
const estatusOptions = [
  { label: 'En curso', value: 'En curso' },
  { label: 'Completado', value: 'Completado' },
]

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

function resetNuevoProyecto() {
  nuevoProyecto.value = { proyectoId: '', titulo: '', estatus: '' }
  errorMsg.value = ''
  successMsg.value = ''
  abrirModalNuevo.value = false
}

async function crearProyecto() {
  creando.value = true
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const token = localStorage.getItem('jwt')
    const body = {
      proyectoId: nuevoProyecto.value.proyectoId,
      titulo: nuevoProyecto.value.titulo,
      estatus: nuevoProyecto.value.estatus,
    }
    await api.post('/proyectos', body, {
      headers: { Authorization: `Bearer ${token}` },
    })
    successMsg.value = 'Proyecto creado exitosamente.'
    abrirModalNuevo.value = false
    resetNuevoProyecto()
    await cargarProyectos()
  } catch (error) {
    errorMsg.value = error?.response?.data?.message || error.message || 'Error al crear proyecto'
  } finally {
    creando.value = false
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
