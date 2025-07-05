<template>
  <q-page class="q-pa-md" style="position: relative; min-height: 80vh">
    <div class="text-h5 q-mb-md">Asignación de Proyectos</div>
    <div class="row q-mb-md items-center">
      <BaseButton
        color="primary"
        label="Nueva Asignación"
        customClass="q-mr-md"
        @click="abrirModalCrear"
      />
    </div>
    <BaseTable
      :rows="asignaciones"
      :columns="columns"
      rowKey="asignacionId"
      flat
      bordered
      :pagination="{ rowsPerPage: 5 }"
    >
      <template #body-cell-acciones="props">
        <q-td align="center">
          <BaseButton size="sm" color="secondary" icon="edit" flat @click="onEdit(props.row)" />
          <BaseButton size="sm" color="negative" icon="delete" flat @click="onDelete(props.row)" />
        </q-td>
      </template>
    </BaseTable>
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
          <BaseSelect
            v-model="asignacionForm.proyectoId"
            :options="proyectosOptions"
            label="Proyecto"
            option-label="titulo"
            option-value="proyectoId"
            dense
            class="q-mb-sm"
          />
          <BaseSelect
            v-model="asignacionForm.profesorId"
            :options="profesoresOptions"
            label="Profesor"
            option-label="nombreCompleto"
            option-value="profesorId"
            dense
            class="q-mb-sm"
          />
          <BaseSelect
            v-model="asignacionForm.rolEnProyecto"
            :options="['Investigador Principal', 'Colaborador']"
            label="Rol en Proyecto"
            dense
            class="q-mb-sm"
          />
        </q-card-section>
        <q-card-actions align="right">
          <BaseButton flat label="Cancelar" color="negative" v-close-popup />
          <BaseButton
            flat
            :label="editando ? 'Guardar' : 'Asignar'"
            color="primary"
            @click="guardarAsignacion"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
  <BackButton label="Volver" style="position: fixed; top: 72px; left: 32px; z-index: 200" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import BaseButton from 'src/components/common/BaseButton.vue'
import BaseTable from 'src/components/common/BaseTable.vue'
import BaseSelect from 'src/components/common/BaseSelect.vue'
import BackButton from 'src/components/common/BackButton.vue'

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
    await api.delete(`/AsignacionProyecto/${row.asignacionId}`, {
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
        `/AsignacionProyecto/${asignacionForm.value.asignacionId}`,
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
        '/AsignacionProyecto',
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
    // 1. Obtener todos los IDs de asignaciones
    const response = await api.get('/AsignacionProyecto', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const ids = Array.isArray(response.data) ? response.data.map((a) => a.asignacionId) : []
    // 2. Obtener cada asignación por su ID
    const detalles = await Promise.all(
      ids.map(async (id) => {
        const res = await api.get(`/AsignacionProyecto/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        return res.data
      }),
    )
    // 3. Relacionar con proyectos y obtener apellido del usuario del profesor (consulta masiva)
    // Obtener todos los profesores y usuarios
    let profesores = []
    let usuarios = []
    try {
      const profesoresRes = await api.get('/profesores')
      profesores = Array.isArray(profesoresRes.data) ? profesoresRes.data : []
    } catch {
      // Error al obtener profesores, continuar con arreglo vacío
    }
    try {
      const usuariosRes = await api.get('/usuarios')
      usuarios = Array.isArray(usuariosRes.data) ? usuariosRes.data : []
    } catch {
      // Error al obtener usuarios, continuar con arreglo vacío
    }

    asignaciones.value = detalles.map((a) => {
      // Proyecto
      const proyecto = proyectosOptions.value.find((p) => p.proyectoId === a.proyectoId)
      // Buscar profesor y usuario
      let apellidoUsuario = a.profesorId
      const profesor = profesores.find((p) => p.profesorId === a.profesorId)
      if (profesor && profesor.usuarioId) {
        const usuario = usuarios.find((u) => u.usuarioId === profesor.usuarioId)
        if (usuario && usuario.apellido) {
          apellidoUsuario = usuario.apellido
        }
      }
      return {
        ...a,
        proyecto: proyecto ? proyecto.titulo : a.proyectoId,
        profesor: apellidoUsuario,
        proyectoId: a.proyectoId,
        profesorId: a.profesorId,
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
    const response = await api.get('/Proyectos', {
      headers: { Authorization: `Bearer ${token}` },
    })
    console.log('Proyectos desde API:', response.data)
    proyectosOptions.value = response.data
  } catch {
    proyectosOptions.value = []
  }
}

async function cargarProfesores() {
  try {
    const token = localStorage.getItem('jwt')
    const response = await api.get('/Profesores', {
      headers: { Authorization: `Bearer ${token}` },
    })
    console.log('Profesores desde API:', response.data)
    // Agregar campo nombreCompleto para el select
    profesoresOptions.value = response.data.map((p) => ({
      ...p,
      nombreCompleto: `${p.nombre || ''} ${p.apellido || ''}`.trim() || `Profesor #${p.profesorId}`,
    }))
  } catch {
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
