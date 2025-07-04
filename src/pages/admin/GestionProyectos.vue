<template>
  <q-page class="q-pa-md" style="position: relative">
    <div class="text-h5 q-mb-md">Gestión de Proyectos</div>
    <div class="row q-mb-md items-center">
      <BaseButton
        color="primary"
        label="Nuevo Proyecto"
        customClass="q-mr-md"
        @click="abrirModalCrear"
      />
      <BaseInput
        v-model="busquedaId"
        label="Buscar por ID"
        type="number"
        dense
        customClass="q-mr-sm"
        style="max-width: 150px"
      />
      <BaseButton color="secondary" label="Buscar" @click="onBuscarPorId" />
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
      <q-space />
      <q-uploader
        label="Carga masiva por Excel"
        accept=".xlsx,.xls"
        :auto-upload="false"
        @added="onArchivoExcel"
        style="max-width: 300px"
      />
    </div>
    <BaseTable
      :rows="proyectosFiltrados"
      :columns="columns"
      rowKey="proyectoId"
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
    <div v-if="proyectoBuscado" class="q-mt-md">
      <q-card>
        <q-card-section>
          <div class="text-h6">Proyecto encontrado</div>
          <div><b>ID:</b> {{ proyectoBuscado.proyectoId }}</div>
          <div><b>Título:</b> {{ proyectoBuscado.titulo }}</div>
          <div><b>Estatus:</b> {{ proyectoBuscado.estatus }}</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Modal para creación de proyecto -->
    <q-dialog v-model="showCreateModal">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Crear Nuevo Proyecto</div>
          <BaseInput v-model="nuevoProyecto.titulo" label="Título" dense customClass="q-mb-sm" />
          <BaseInput
            v-model="nuevoProyecto.descripcion"
            label="Descripción"
            dense
            customClass="q-mb-sm"
          />
          <BaseInput
            v-model="nuevoProyecto.fechaInicio"
            label="Fecha de Inicio"
            type="date"
            dense
            customClass="q-mb-sm"
          />
          <BaseInput
            v-model="nuevoProyecto.estatus"
            label="Estatus"
            dense
            customClass="q-mb-sm"
            readonly
          />
          <q-toggle v-model="nuevoProyecto.recomendado" label="Recomendado" class="q-mb-sm" />
          <BaseInput
            v-model.number="nuevoProyecto.lineaId"
            label="Línea ID"
            type="number"
            dense
            customClass="q-mb-sm"
          />
        </q-card-section>
        <q-card-actions align="right">
          <BaseButton flat label="Cancelar" color="negative" v-close-popup />
          <BaseButton flat label="Crear" color="primary" @click="crearProyecto" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Modal para edición de proyecto -->
    <q-dialog v-model="showEditModal">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Editar Proyecto</div>
          <BaseInput v-model="proyectoEditando.titulo" label="Título" dense customClass="q-mb-sm" />
          <BaseInput
            v-model="proyectoEditando.descripcion"
            label="Descripción"
            dense
            customClass="q-mb-sm"
          />
          <BaseInput
            v-model="proyectoEditando.fechaInicio"
            label="Fecha de Inicio"
            type="date"
            dense
            customClass="q-mb-sm"
          />
          <BaseInput
            v-model="proyectoEditando.fechaFin"
            label="Fecha de Fin"
            type="date"
            dense
            customClass="q-mb-sm"
          />
          <BaseSelect
            v-model="proyectoEditando.estatus"
            :options="['En curso', 'Completado']"
            label="Estatus"
            dense
            customClass="q-mb-sm"
          />
          <q-toggle v-model="proyectoEditando.recomendado" label="Recomendado" class="q-mb-sm" />
          <BaseInput
            v-model.number="proyectoEditando.lineaId"
            label="Línea ID"
            type="number"
            dense
            customClass="q-mb-sm"
          />
        </q-card-section>
        <q-card-actions align="right">
          <BaseButton flat label="Cancelar" color="negative" v-close-popup />
          <BaseButton flat label="Guardar" color="primary" @click="guardarEdicion" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <BackButton class="back-btn-bottom" />
  </q-page>
</template>

<style scoped>
.back-btn-bottom {
  position: fixed;
  left: 32px;
  bottom: 32px;
  z-index: 20;
}
</style>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from 'src/boot/axios'
import BaseInput from 'src/components/common/BaseInput.vue'
import BaseSelect from 'src/components/common/BaseSelect.vue'
import BaseButton from 'src/components/common/BaseButton.vue'
import BaseTable from 'src/components/common/BaseTable.vue'
import BackButton from 'src/components/common/BackButton.vue'

const proyectos = ref([])
const errorMsg = ref('')
const successMsg = ref('')
const busquedaId = ref('')
const busquedaTitulo = ref('')
const busquedaEstatus = ref('')
const proyectoBuscado = ref(null)
const showCreateModal = ref(false)
const nuevoProyecto = ref({
  titulo: '',
  descripcion: '',
  fechaInicio: '',
  estatus: 'En curso', // Valor por defecto
  recomendado: false,
  lineaId: null,
})
const showEditModal = ref(false)
const proyectoEditando = ref({})

const columns = [
  { name: 'proyectoId', label: 'ID', field: 'proyectoId', align: 'left' },
  { name: 'titulo', label: 'Título', field: 'titulo', align: 'left' },
  { name: 'estatus', label: 'Estatus', field: 'estatus', align: 'left' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
]

const proyectosFiltrados = computed(() => {
  let lista = proyectos.value
  if (busquedaTitulo.value) {
    lista = lista.filter((p) => p.titulo.toLowerCase().includes(busquedaTitulo.value.toLowerCase()))
  }
  if (busquedaEstatus.value) {
    lista = lista.filter((p) =>
      p.estatus.toLowerCase().includes(busquedaEstatus.value.toLowerCase()),
    )
  }
  return lista
})

function onEdit(row) {
  proyectoEditando.value = { ...row }
  showEditModal.value = true
}

async function onDelete(row) {
  if (!confirm('¿Estás seguro de que deseas eliminar este proyecto?')) return
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const token = localStorage.getItem('jwt')
    await api.delete(`/proyectos/${row.proyectoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    successMsg.value = 'Proyecto eliminado correctamente.'
    await cargarProyectos()
  } catch (error) {
    errorMsg.value =
      error?.response?.data?.message || error.message || 'Error al eliminar proyecto.'
    console.error('Error al eliminar proyecto:', error)
  }
}

async function onBuscarPorId() {
  errorMsg.value = ''
  successMsg.value = ''
  proyectoBuscado.value = null
  if (!busquedaId.value) {
    errorMsg.value = 'Ingrese un ID válido.'
    return
  }
  try {
    const token = localStorage.getItem('jwt')
    const response = await api.get(`/proyectos/${busquedaId.value}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    proyectoBuscado.value = response.data
    if (!response.data) {
      errorMsg.value = 'No se encontró el proyecto con ese ID.'
    }
  } catch (error) {
    proyectoBuscado.value = null
    errorMsg.value = error?.response?.data?.message || error.message || 'Error al buscar proyecto'
    console.error('Error al buscar proyecto:', error)
  }
}

async function onArchivoExcel(files) {
  errorMsg.value = ''
  successMsg.value = ''
  if (!files || files.length === 0) {
    errorMsg.value = 'Debe seleccionar un archivo Excel.'
    return
  }
  const file = files[0]
  const formData = new FormData()
  formData.append('file', file)
  try {
    const token = localStorage.getItem('jwt')
    const response = await api.post('/proyectos/crear-masivo-excel', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    })
    successMsg.value = response.data?.MensajeResumen || 'Carga masiva exitosa.'
    errorMsg.value = ''
    // Recargar la lista de proyectos
    await cargarProyectos()
  } catch (error) {
    errorMsg.value =
      error?.response?.data?.Mensaje || error.message || 'Error al cargar el archivo.'
    successMsg.value = ''
    console.error('Error al cargar archivo Excel:', error)
  }
}

async function cargarProyectos() {
  try {
    const token = localStorage.getItem('jwt')
    const response = await api.get('/proyectos', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (Array.isArray(response.data)) {
      proyectos.value = response.data
    } else if (Array.isArray(response.data.proyectos)) {
      proyectos.value = response.data.proyectos
    } else if (Array.isArray(response.data.data)) {
      proyectos.value = response.data.data
    } else {
      proyectos.value = []
      errorMsg.value = 'No se encontró un array de proyectos en la respuesta.'
    }
    errorMsg.value = ''
  } catch (error) {
    errorMsg.value = error?.response?.data?.message || error.message || 'Error al obtener proyectos'
    console.error('Error al obtener proyectos:', error)
  }
}

function abrirModalCrear() {
  showCreateModal.value = true
  // Limpiar campos
  nuevoProyecto.value = {
    titulo: '',
    descripcion: '',
    fechaInicio: '',
    estatus: 'En curso', // Valor por defecto
    recomendado: false,
    lineaId: null,
  }
}

async function crearProyecto() {
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const token = localStorage.getItem('jwt')
    const body = {
      Titulo: nuevoProyecto.value.titulo,
      Descripcion: nuevoProyecto.value.descripcion,
      FechaInicio: nuevoProyecto.value.fechaInicio,
      Estatus: nuevoProyecto.value.estatus,
      Recomendado: nuevoProyecto.value.recomendado,
      LineaId: nuevoProyecto.value.lineaId,
    }
    await api.post('/proyectos', body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    showCreateModal.value = false
    successMsg.value = 'Proyecto creado correctamente.'
    await cargarProyectos()
  } catch (error) {
    errorMsg.value = error?.response?.data?.message || error.message || 'Error al crear proyecto.'
    console.error('Error al crear proyecto:', error)
  }
}

async function guardarEdicion() {
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const token = localStorage.getItem('jwt')
    const body = {
      ProyectoId: proyectoEditando.value.proyectoId,
      Titulo: proyectoEditando.value.titulo,
      Descripcion: proyectoEditando.value.descripcion,
      FechaInicio: proyectoEditando.value.fechaInicio,
      FechaFin: proyectoEditando.value.fechaFin || null,
      Estatus: proyectoEditando.value.estatus,
      Recomendado: proyectoEditando.value.recomendado,
      LineaId: proyectoEditando.value.lineaId,
    }
    await api.put(`/proyectos/${proyectoEditando.value.proyectoId}`, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    showEditModal.value = false
    successMsg.value = 'Proyecto actualizado correctamente.'
    await cargarProyectos()
  } catch (error) {
    errorMsg.value =
      error?.response?.data?.message || error.message || 'Error al actualizar proyecto.'
    console.error('Error al actualizar proyecto:', error)
  }
}

// Reemplaza la llamada en onMounted por cargarProyectos
onMounted(cargarProyectos)
</script>
