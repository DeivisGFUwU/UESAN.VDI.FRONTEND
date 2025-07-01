<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Asignación de Proyectos</div>
    <div class="row q-mb-md items-center">
      <q-btn color="primary" label="Nueva Asignación" class="q-mr-md" @click="abrirModalCrear" />
    </div>
    <q-table
      :rows="asignaciones"
      :columns="columns"
      row-key="asignacionId"
      flat
      bordered
      :pagination="{ rowsPerPage: 5 }"
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

    <!-- Modal para crear/editar asignación -->
    <q-dialog v-model="showModal">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ editando ? 'Editar' : 'Nueva' }} Asignación</div>
          <q-select
            v-model="asignacionForm.proyectoId"
            :options="proyectosOptions"
            option-label="titulo"
            option-value="proyectoId"
            label="Proyecto"
            dense
            class="q-mb-sm"
            emit-value
            map-options
          />
          <q-select
            v-model="asignacionForm.profesorId"
            :options="profesoresOptions"
            option-label="nombreCompleto"
            option-value="profesorId"
            label="Profesor"
            dense
            class="q-mb-sm"
            emit-value
            map-options
          />
          <q-select
            v-model="asignacionForm.rolEnProyecto"
            :options="['Investigador Principal', 'Colaborador']"
            label="Rol en Proyecto"
            dense
            class="q-mb-sm"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn
            flat
            :label="editando ? 'Guardar' : 'Asignar'"
            color="primary"
            @click="guardarAsignacion"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'

const asignaciones = ref([])
const proyectosOptions = ref([])
const profesoresOptions = ref([])
const errorMsg = ref('')
const successMsg = ref('')
const showModal = ref(false)
const editando = ref(false)
const asignacionForm = ref({
  asignacionId: null,
  proyectoId: null,
  profesorId: null,
  rolEnProyecto: '',
})

const columns = [
  { name: 'asignacionId', label: 'ID', field: 'asignacionId', align: 'left' },
  { name: 'proyectoId', label: 'ID Proyecto', field: 'proyectoId', align: 'left' },
  { name: 'proyecto', label: 'Proyecto', field: 'proyecto', align: 'left' },
  { name: 'profesorId', label: 'ID Profesor', field: 'profesorId', align: 'left' },
  { name: 'profesor', label: 'Profesor', field: 'profesor', align: 'left' },
  { name: 'rolEnProyecto', label: 'Rol', field: 'rolEnProyecto', align: 'left' },
  { name: 'fechaAsignacion', label: 'Fecha Asignación', field: 'fechaAsignacion', align: 'left' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
]

function abrirModalCrear() {
  editando.value = false
  asignacionForm.value = {
    asignacionId: null,
    proyectoId: null,
    profesorId: null,
    rolEnProyecto: '',
  }
  showModal.value = true
}

function onEdit(row) {
  editando.value = true
  asignacionForm.value = {
    asignacionId: row.asignacionId,
    proyectoId: row.proyectoId, // Asegura que sea el ID, no el nombre
    profesorId: row.profesorId, // Asegura que sea el ID, no el nombre
    rolEnProyecto: row.rolEnProyecto,
  }
  showModal.value = true
}

async function onDelete(row) {
  if (!confirm('¿Estás seguro de que deseas eliminar esta asignación?')) return
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const token = localStorage.getItem('jwt')
    await api.delete(`/api/AsignacionProyecto/${row.asignacionId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    successMsg.value = 'Asignación eliminada correctamente.'
    await recargarTodo()
  } catch (error) {
    errorMsg.value =
      error?.response?.data?.message || error.message || 'Error al eliminar asignación.'
    console.error('Error al eliminar asignación:', error)
  }
}

async function guardarAsignacion() {
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const token = localStorage.getItem('jwt')
    if (editando.value) {
      await api.put(
        `/api/AsignacionProyecto/${asignacionForm.value.asignacionId}`,
        {
          AsignacionId: asignacionForm.value.asignacionId,
          ProyectoId: asignacionForm.value.proyectoId,
          ProfesorId: asignacionForm.value.profesorId,
          RolEnProyecto: asignacionForm.value.rolEnProyecto,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      successMsg.value = 'Asignación actualizada correctamente.'
    } else {
      await api.post(
        '/api/AsignacionProyecto',
        {
          ProyectoId: asignacionForm.value.proyectoId,
          ProfesorId: asignacionForm.value.profesorId,
          RolEnProyecto: asignacionForm.value.rolEnProyecto,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      successMsg.value = 'Asignación creada correctamente.'
    }
    showModal.value = false
    await recargarTodo()
  } catch (error) {
    errorMsg.value =
      error?.response?.data?.message || error.message || 'Error al guardar asignación.'
    console.error('Error al guardar asignación:', error)
  }
}

async function cargarAsignaciones() {
  try {
    const token = localStorage.getItem('jwt')
    const response = await api.get('/api/AsignacionProyecto', {
      headers: { Authorization: `Bearer ${token}` },
    })
    // Mapear para mostrar nombres de proyecto y profesor, pero conservar los IDs originales
    asignaciones.value = response.data.map((a) => {
      const proyecto = proyectosOptions.value.find((p) => p.proyectoId === a.proyectoId)
      const profesor = profesoresOptions.value.find((p) => p.profesorId === a.profesorId)
      return {
        ...a,
        proyecto: proyecto ? proyecto.titulo : a.proyectoId,
        profesor: profesor ? profesor.nombreCompleto : a.profesorId,
        proyectoId: a.proyectoId, // Conserva el ID para edición
        profesorId: a.profesorId, // Conserva el ID para edición
      }
    })
  } catch (error) {
    errorMsg.value =
      error?.response?.data?.message || error.message || 'Error al obtener asignaciones.'
    console.error('Error al obtener asignaciones:', error)
  }
}

async function cargarProyectos() {
  try {
    const token = localStorage.getItem('jwt')
    const response = await api.get('/api/Proyectos', {
      headers: { Authorization: `Bearer ${token}` },
    })
    console.log('Proyectos desde API:', response.data)
    proyectosOptions.value = response.data
  } catch (error) {
    proyectosOptions.value = []
  }
}

async function cargarProfesores() {
  try {
    const token = localStorage.getItem('jwt')
    const response = await api.get('/api/Profesores', {
      headers: { Authorization: `Bearer ${token}` },
    })
    console.log('Profesores desde API:', response.data)
    // Agregar campo nombreCompleto para el select
    profesoresOptions.value = response.data.map((p) => ({
      ...p,
      nombreCompleto: `${p.nombre || ''} ${p.apellido || ''}`.trim() || `Profesor #${p.profesorId}`,
    }))
  } catch (error) {
    profesoresOptions.value = []
  }
}

async function recargarTodo() {
  // Forzar recarga de proyectos y profesores ANTES de asignaciones
  await cargarProyectos()
  await cargarProfesores()
  // Esperar un pequeño delay para asegurar que los arrays estén actualizados
  await new Promise((resolve) => setTimeout(resolve, 100))
  await cargarAsignaciones()
}

onMounted(recargarTodo)
</script>
