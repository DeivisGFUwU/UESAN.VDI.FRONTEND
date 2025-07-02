<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Gestión de Autores de Publicaciones</div>
    <div class="row q-mb-md items-center">
      <q-btn color="primary" label="Nuevo Autor" class="q-mr-md" @click="abrirModalCrear" />
    </div>
    <q-table
      :rows="autores"
      :columns="columns"
      row-key="id"
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

    <!-- Modal para crear/editar autor -->
    <q-dialog v-model="showModal">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ editando ? 'Editar' : 'Nuevo' }} Autor de Publicación</div>
          <q-select
            v-model="autorForm.publicacionId"
            :options="publicacionesOptions"
            option-label="titulo"
            option-value="publicacionId"
            label="Publicación"
            dense
            class="q-mb-sm"
            emit-value
            map-options
          />
          <q-select
            v-model="autorForm.profesorId"
            :options="profesoresOptions"
            option-label="nombreCompleto"
            option-value="profesorId"
            label="Profesor"
            dense
            class="q-mb-sm"
            emit-value
            map-options
          />
          <q-input
            v-model.number="autorForm.ordenAutor"
            label="Orden del Autor"
            dense
            class="q-mb-sm"
            type="number"
            min="1"
          />
          <q-input
            v-model.number="autorForm.porcentajeParticipacion"
            label="% Participación"
            dense
            class="q-mb-sm"
            type="number"
            min="0"
            max="100"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn
            flat
            :label="editando ? 'Guardar' : 'Crear'"
            color="primary"
            @click="guardarAutor"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'

const autores = ref([])
const publicacionesOptions = ref([])
const profesoresOptions = ref([])
const errorMsg = ref('')
const successMsg = ref('')
const showModal = ref(false)
const editando = ref(false)
const autorForm = ref({
  id: null,
  publicacionId: null,
  profesorId: null,
  ordenAutor: 1,
  porcentajeParticipacion: 0,
})

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'publicacion', label: 'Publicación', field: 'publicacion', align: 'left' },
  { name: 'profesor', label: 'Profesor', field: 'profesor', align: 'left' },
  { name: 'ordenAutor', label: 'Orden', field: 'ordenAutor', align: 'left' },
  {
    name: 'porcentajeParticipacion',
    label: '% Participación',
    field: 'porcentajeParticipacion',
    align: 'left',
  },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
]

function abrirModalCrear() {
  editando.value = false
  autorForm.value = {
    id: null,
    publicacionId: null,
    profesorId: null,
    ordenAutor: 1,
    porcentajeParticipacion: 0,
  }
  showModal.value = true
}

function onEdit(row) {
  editando.value = true
  autorForm.value = {
    id: row.id,
    publicacionId: row.publicacionId,
    profesorId: row.profesorId,
    ordenAutor: row.ordenAutor,
    porcentajeParticipacion: row.porcentajeParticipacion,
  }
  showModal.value = true
}

async function onDelete(row) {
  if (!confirm('¿Estás seguro de que deseas eliminar este autor?')) return
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const token = localStorage.getItem('jwt')
    await api.delete(`/api/AutoresPublicacion/${row.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    successMsg.value = 'Autor eliminado correctamente.'
    await cargarAutores()
  } catch (error) {
    errorMsg.value = error?.response?.data?.message || error.message || 'Error al eliminar autor.'
    console.error('Error al eliminar autor:', error)
  }
}

async function guardarAutor() {
  errorMsg.value = ''
  successMsg.value = ''
  // Validaciones básicas
  if (!autorForm.value.publicacionId || !autorForm.value.profesorId) {
    errorMsg.value = 'Debe seleccionar publicación y profesor.'
    return
  }
  if (autorForm.value.ordenAutor < 1) {
    errorMsg.value = 'El orden debe ser mayor o igual a 1.'
    return
  }
  if (
    autorForm.value.porcentajeParticipacion < 0 ||
    autorForm.value.porcentajeParticipacion > 100
  ) {
    errorMsg.value = 'El porcentaje debe estar entre 0 y 100.'
    return
  }
  try {
    const token = localStorage.getItem('jwt')
    if (editando.value) {
      await api.put(
        `/api/AutoresPublicacion/${autorForm.value.id}`,
        {
          Id: autorForm.value.id,
          PublicacionId: autorForm.value.publicacionId,
          ProfesorId: autorForm.value.profesorId,
          OrdenAutor: autorForm.value.ordenAutor,
          PorcentajeParticipacion: autorForm.value.porcentajeParticipacion,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      successMsg.value = 'Autor actualizado correctamente.'
    } else {
      await api.post(
        '/api/AutoresPublicacion',
        {
          PublicacionId: autorForm.value.publicacionId,
          ProfesorId: autorForm.value.profesorId,
          OrdenAutor: autorForm.value.ordenAutor,
          PorcentajeParticipacion: autorForm.value.porcentajeParticipacion,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      successMsg.value = 'Autor creado correctamente.'
    }
    showModal.value = false
    await cargarAutores()
  } catch (error) {
    errorMsg.value = error?.response?.data?.message || error.message || 'Error al guardar autor.'
    console.error('Error al guardar autor:', error)
  }
}

async function cargarAutores() {
  try {
    const token = localStorage.getItem('jwt')
    const response = await api.get('/api/AutoresPublicacion', {
      headers: { Authorization: `Bearer ${token}` },
    })
    // Mapear para mostrar nombre de profesor y título de publicación
    autores.value = response.data.map((a) => {
      const publicacion = publicacionesOptions.value.find(
        (p) => p.publicacionId === a.publicacionId,
      )
      const profesor = profesoresOptions.value.find((prof) => prof.profesorId === a.profesorId)
      return {
        ...a,
        publicacion: publicacion ? publicacion.titulo : a.publicacionId,
        profesor: profesor ? profesor.nombreCompleto : a.profesorId,
      }
    })
  } catch (error) {
    autores.value = []
    errorMsg.value = error?.response?.data?.message || error.message || 'Error al obtener autores.'
    console.error('Error al obtener autores:', error)
  }
}

async function cargarPublicaciones() {
  try {
    const token = localStorage.getItem('jwt')
    const response = await api.get('/api/Publicaciones', {
      headers: { Authorization: `Bearer ${token}` },
    })
    publicacionesOptions.value = response.data.map((p) => ({
      ...p,
      titulo: p.titulo || `Publicación #${p.publicacionId}`,
    }))
  } catch {
    publicacionesOptions.value = []
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
  await cargarPublicaciones()
  await cargarProfesores()
  await cargarAutores()
}

onMounted(recargarTodo)
</script>
