<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Gestión de Publicaciones</div>
    <div class="row q-mb-md items-center">
      <q-btn color="primary" label="Nueva Publicación" class="q-mr-md" @click="abrirModalCrear" />
    </div>
    <q-table
      :rows="publicaciones"
      :columns="columns"
      row-key="publicacionId"
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

    <!-- Modal para crear/editar publicación -->
    <q-dialog v-model="showModal">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ editando ? 'Editar' : 'Nueva' }} Publicación</div>
          <q-select
            v-model="publicacionForm.profesorId"
            :options="profesoresOptions"
            option-label="nombreCompleto"
            option-value="profesorId"
            label="Profesor"
            dense
            class="q-mb-sm"
            emit-value
            map-options
          />
          <q-input v-model="publicacionForm.issn" label="ISSN" dense class="q-mb-sm" />
          <q-input v-model="publicacionForm.titulo" label="Título" dense class="q-mb-sm" />
          <q-input
            v-model="publicacionForm.fechaPublicacion"
            label="Fecha de Publicación"
            dense
            class="q-mb-sm"
            type="date"
          />
          <q-input
            v-model.number="publicacionForm.puntaje"
            label="Puntaje"
            dense
            class="q-mb-sm"
            type="number"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn
            flat
            :label="editando ? 'Guardar' : 'Crear'"
            color="primary"
            @click="guardarPublicacion"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'

const publicaciones = ref([])
const profesoresOptions = ref([])
const errorMsg = ref('')
const successMsg = ref('')
const showModal = ref(false)
const editando = ref(false)
const publicacionForm = ref({
  publicacionId: null,
  profesorId: null,
  issn: '',
  titulo: '',
  fechaPublicacion: '',
  puntaje: 0,
})

const columns = [
  { name: 'publicacionId', label: 'ID', field: 'publicacionId', align: 'left' },
  { name: 'profesor', label: 'Profesor', field: 'profesor', align: 'left' },
  { name: 'issn', label: 'ISSN', field: 'issn', align: 'left' },
  { name: 'titulo', label: 'Título', field: 'titulo', align: 'left' },
  {
    name: 'fechaPublicacion',
    label: 'Fecha',
    field: 'fechaPublicacion',
    align: 'left',
    format: (val) => (val ? new Date(val).toLocaleDateString() : ''),
  },
  { name: 'puntaje', label: 'Puntaje', field: 'puntaje', align: 'left' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
]

function abrirModalCrear() {
  editando.value = false
  publicacionForm.value = {
    publicacionId: null,
    profesorId: null,
    issn: '',
    titulo: '',
    fechaPublicacion: '',
    puntaje: 0,
  }
  showModal.value = true
}

function onEdit(row) {
  editando.value = true
  publicacionForm.value = {
    publicacionId: row.publicacionId,
    profesorId: row.profesorId,
    issn: row.issn,
    titulo: row.titulo,
    fechaPublicacion: row.fechaPublicacion?.slice(0, 10) || '',
    puntaje: row.puntaje,
  }
  showModal.value = true
}

async function onDelete(row) {
  if (!confirm('¿Estás seguro de que deseas eliminar esta publicación?')) return
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const token = localStorage.getItem('jwt')
    await api.delete(`/api/Publicaciones/${row.publicacionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    successMsg.value = 'Publicación eliminada correctamente.'
    await cargarPublicaciones()
  } catch (error) {
    errorMsg.value =
      error?.response?.data?.message || error.message || 'Error al eliminar publicación.'
    console.error('Error al eliminar publicación:', error)
  }
}

async function guardarPublicacion() {
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const token = localStorage.getItem('jwt')
    if (editando.value) {
      await api.put(
        `/api/Publicaciones/${publicacionForm.value.publicacionId}`,
        {
          PublicacionId: publicacionForm.value.publicacionId,
          ProfesorId: publicacionForm.value.profesorId,
          Issn: publicacionForm.value.issn,
          Titulo: publicacionForm.value.titulo,
          FechaPublicacion: publicacionForm.value.fechaPublicacion,
          Puntaje: publicacionForm.value.puntaje,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      successMsg.value = 'Publicación actualizada correctamente.'
    } else {
      await api.post(
        '/api/Publicaciones',
        {
          ProfesorId: publicacionForm.value.profesorId,
          Issn: publicacionForm.value.issn,
          Titulo: publicacionForm.value.titulo,
          FechaPublicacion: publicacionForm.value.fechaPublicacion,
          Puntaje: publicacionForm.value.puntaje,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      successMsg.value = 'Publicación creada correctamente.'
    }
    showModal.value = false
    await cargarPublicaciones()
  } catch (error) {
    errorMsg.value =
      error?.response?.data?.message || error.message || 'Error al guardar publicación.'
    console.error('Error al guardar publicación:', error)
  }
}

async function cargarPublicaciones() {
  try {
    const token = localStorage.getItem('jwt')
    const response = await api.get('/api/Publicaciones', {
      headers: { Authorization: `Bearer ${token}` },
    })
    // Mapear para mostrar nombre de profesor
    publicaciones.value = response.data.map((p) => {
      const profesor = profesoresOptions.value.find((prof) => prof.profesorId === p.profesorId)
      return {
        ...p,
        profesor: profesor ? profesor.nombreCompleto : p.profesorId,
      }
    })
  } catch (error) {
    publicaciones.value = []
    errorMsg.value =
      error?.response?.data?.message || error.message || 'Error al obtener publicaciones.'
    console.error('Error al obtener publicaciones:', error)
  }
}

async function cargarProfesores() {
  try {
    const token = localStorage.getItem('jwt')
    const response = await api.get('/api/Profesores', {
      headers: { Authorization: `Bearer ${token}` },
    })
    profesoresOptions.value = response.data.map((p) => ({
      ...p,
      nombreCompleto: `${p.nombre || ''} ${p.apellido || ''}`.trim() || `Profesor #${p.profesorId}`,
    }))
  } catch {
    profesoresOptions.value = []
  }
}

async function recargarTodo() {
  await cargarProfesores()
  await cargarPublicaciones()
}

onMounted(recargarTodo)
</script>
