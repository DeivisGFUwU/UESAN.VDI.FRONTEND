<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Gestión de Líneas de Investigación</div>
    <div class="row q-mb-md items-center">
      <q-btn color="primary" label="Nueva Línea" class="q-mr-md" @click="abrirModalCrear" />
    </div>
    <q-table
      :rows="lineas"
      :columns="columns"
      row-key="lineaId"
      flat
      bordered
      :pagination="{ rowsPerPage: 10 }"
    >
      <template v-slot:body-cell-acciones="props">
        <q-td align="center">
          <q-btn size="sm" color="secondary" icon="edit" flat @click="onEdit(props.row)" />
          <q-btn size="sm" color="negative" icon="delete" flat @click="onDelete(props.row)" />
        </q-td>
      </template>
    </q-table>
    <q-banner v-if="errorMsg" class="bg-red text-white q-mt-md">
      {{ errorMsg }}
    </q-banner>
    <q-banner v-if="successMsg" class="bg-green text-white q-mt-md">
      {{ successMsg }}
    </q-banner>

    <!-- Modal para crear/editar línea -->
    <q-dialog v-model="showModal">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ editando ? 'Editar' : 'Nueva' }} Línea</div>
          <q-input v-model="lineaForm.nombre" label="Nombre de la Línea" dense class="q-mb-sm" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn
            flat
            :label="editando ? 'Guardar' : 'Crear'"
            color="primary"
            @click="guardarLinea"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'

const lineas = ref([])
const errorMsg = ref('')
const successMsg = ref('')
const showModal = ref(false)
const editando = ref(false)
const lineaForm = ref({
  lineaId: null,
  nombre: '',
})

const columns = [
  { name: 'lineaId', label: 'ID', field: 'lineaId', align: 'left' },
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
]

function abrirModalCrear() {
  editando.value = false
  lineaForm.value = {
    lineaId: null,
    nombre: '',
  }
  showModal.value = true
}

function onEdit(row) {
  editando.value = true
  lineaForm.value = {
    lineaId: row.lineaId,
    nombre: row.nombre,
  }
  showModal.value = true
}

async function onDelete(row) {
  if (!confirm('¿Estás seguro de que deseas eliminar esta línea?')) return
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const token = localStorage.getItem('jwt')
    await api.delete(`/api/LineasInvestigacion/${row.lineaId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    successMsg.value = 'Línea eliminada correctamente.'
    await cargarLineas()
  } catch (error) {
    errorMsg.value = error?.response?.data?.message || error.message || 'Error al eliminar línea.'
    console.error('Error al eliminar línea:', error)
  }
}

async function guardarLinea() {
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const token = localStorage.getItem('jwt')
    if (editando.value) {
      await api.put(
        '/api/LineasInvestigacion',
        {
          LineaId: lineaForm.value.lineaId,
          Nombre: lineaForm.value.nombre,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      successMsg.value = 'Línea actualizada correctamente.'
    } else {
      await api.post(
        '/api/LineasInvestigacion',
        {
          Nombre: lineaForm.value.nombre,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      successMsg.value = 'Línea creada correctamente.'
    }
    showModal.value = false
    await cargarLineas()
  } catch (error) {
    errorMsg.value = error?.response?.data?.message || error.message || 'Error al guardar línea.'
    console.error('Error al guardar línea:', error)
  }
}

async function cargarLineas() {
  try {
    const token = localStorage.getItem('jwt')
    const response = await api.get('/api/LineasInvestigacion', {
      headers: { Authorization: `Bearer ${token}` },
    })
    lineas.value = response.data
  } catch (error) {
    lineas.value = []
    errorMsg.value = error?.response?.data?.message || error.message || 'Error al obtener líneas.'
    console.error('Error al obtener líneas:', error)
  }
}

onMounted(cargarLineas)
</script>
