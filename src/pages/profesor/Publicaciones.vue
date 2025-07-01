<template>
  <q-page class="q-pa-md">
    <div class="text-h6 q-mb-md">Gestión de Publicaciones</div>
    <div class="q-mb-md">
      <q-btn color="primary" label="Nueva Publicación" @click="abrirModalCrear" />
    </div>
    <q-table
      :rows="publicaciones"
      :columns="columns"
      row-key="PublicacionId"
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
          <q-input v-model="publicacionForm.Issn" label="ISSN" dense class="q-mb-sm" />
          <q-input v-model="publicacionForm.Titulo" label="Título" dense class="q-mb-sm" />
          <q-input
            v-model="publicacionForm.FechaPublicacion"
            label="Fecha de Publicación"
            type="date"
            dense
            class="q-mb-sm"
          />
          <q-input
            v-model.number="publicacionForm.Puntaje"
            label="Puntaje"
            type="number"
            dense
            class="q-mb-sm"
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
import { useQuasar } from 'quasar'
import axios from 'axios'

defineOptions({ name: 'ProfesorPublicaciones' })

const $q = useQuasar()
const publicaciones = ref([])
const errorMsg = ref('')
const successMsg = ref('')
const showModal = ref(false)
const editando = ref(false)
const publicacionForm = ref({
  PublicacionId: null,
  Issn: '',
  Titulo: '',
  FechaPublicacion: '',
  Puntaje: 0,
})

const columns = [
  { name: 'Titulo', label: 'Título', field: (row) => row.Titulo || row.titulo, align: 'left' },
  {
    name: 'FechaPublicacion',
    label: 'Fecha',
    field: (row) => row.FechaPublicacion || row.fechaPublicacion,
    align: 'left',
    format: (val) => (val ? new Date(val).toLocaleDateString() : ''),
  },
  { name: 'Puntaje', label: 'Puntaje', field: (row) => row.Puntaje || row.puntaje, align: 'left' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
]

const API_URL = 'http://localhost:5192/api/publicaciones'

const cargarPublicaciones = async () => {
  try {
    const token = localStorage.getItem('jwt')
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    })
    let data = []
    if (Array.isArray(res.data)) {
      data = res.data
    } else if (Array.isArray(res.data.publicaciones)) {
      data = res.data.publicaciones
    } else if (Array.isArray(res.data.data)) {
      data = res.data.data
    }
    publicaciones.value = data.map((p) => ({
      ...p,
      Titulo: p.Titulo || p.titulo,
      FechaPublicacion: p.FechaPublicacion || p.fechaPublicacion,
      Puntaje: p.Puntaje || p.puntaje,
      PublicacionId: p.PublicacionId || p.publicacionId,
    }))
  } catch {
    errorMsg.value = 'Error al cargar publicaciones'
  }
}

function abrirModalCrear() {
  editando.value = false
  publicacionForm.value = {
    PublicacionId: null,
    Issn: '',
    Titulo: '',
    FechaPublicacion: '',
    Puntaje: 0,
  }
  showModal.value = true
}

function onEdit(row) {
  editando.value = true
  publicacionForm.value = {
    PublicacionId: row.PublicacionId,
    Issn: row.Issn,
    Titulo: row.Titulo,
    FechaPublicacion: row.FechaPublicacion ? row.FechaPublicacion.slice(0, 10) : '',
    Puntaje: row.Puntaje,
  }
  showModal.value = true
}

async function onDelete(row) {
  if (!confirm('¿Estás seguro de que deseas eliminar esta publicación?')) return
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const token = localStorage.getItem('jwt')
    await axios.delete(`${API_URL}/${row.PublicacionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    successMsg.value = 'Publicación eliminada correctamente.'
    await cargarPublicaciones()
  } catch {
    errorMsg.value = 'Error al eliminar publicación.'
  }
}

async function guardarPublicacion() {
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const token = localStorage.getItem('jwt')
    // Obtener el usuario del localStorage para asignar el ProfesorId
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    // Buscar el id de profesor en varias posibles propiedades
    const profesorId = user.profesorId || user.ProfesorId || user.id || user.Id
    if (!profesorId) {
      errorMsg.value =
        'No se encontró el ID de profesor en el usuario. Revisa el objeto user en localStorage.'
      console.error('user localStorage:', user)
      return
    }
    if (editando.value) {
      await axios.put(
        `${API_URL}/${publicacionForm.value.PublicacionId}`,
        {
          PublicacionId: publicacionForm.value.PublicacionId,
          ProfesorId: profesorId,
          Issn: publicacionForm.value.Issn,
          Titulo: publicacionForm.value.Titulo,
          FechaPublicacion: publicacionForm.value.FechaPublicacion,
          Puntaje: publicacionForm.value.Puntaje,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      successMsg.value = 'Publicación actualizada correctamente.'
    } else {
      await axios.post(
        API_URL,
        {
          ProfesorId: profesorId,
          Issn: publicacionForm.value.Issn,
          Titulo: publicacionForm.value.Titulo,
          FechaPublicacion: publicacionForm.value.FechaPublicacion,
          Puntaje: publicacionForm.value.Puntaje,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      successMsg.value = 'Publicación creada correctamente.'
    }
    showModal.value = false
    await cargarPublicaciones()
  } catch {
    errorMsg.value = 'Error al guardar publicación.'
  }
}

onMounted(cargarPublicaciones)
</script>
