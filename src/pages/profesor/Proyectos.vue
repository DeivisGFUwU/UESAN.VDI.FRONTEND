<template>
  <q-page class="q-pa-md">
    <h2>Gestión de Proyectos</h2>

    <!-- Tabla de proyectos -->
    <BaseTable title="Proyectos" :rows="proyectos" :columns="columns" rowKey="ProyectoId" flat>
      <template #body-cell-acciones="props">
        <BaseButton size="sm" color="primary" icon="edit" @click="editarProyecto(props.row)" />
      </template>
    </BaseTable>

    <!-- Modal para editar proyecto (solo FechaFin) -->
    <q-dialog v-model="editando">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Editar Fecha de Fin</div>
          <BaseInput
            v-model="form.FechaFin"
            label="Fecha de Fin"
            type="date"
            dense
            customClass="q-mb-sm"
          />
        </q-card-section>
        <q-card-actions align="right">
          <BaseButton flat label="Cancelar" color="negative" @click="resetForm" />
          <BaseButton flat label="Guardar" color="primary" @click="onSubmit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'
import BaseInput from 'src/components/common/BaseInput.vue'
import BaseButton from 'src/components/common/BaseButton.vue'
import BaseTable from 'src/components/common/BaseTable.vue'

defineOptions({ name: 'ProfesorProyectos' })

const $q = useQuasar()
const proyectos = ref([])
const editando = ref(false)
const form = ref({ ProyectoId: null, FechaFin: '' })

// Solo mostrar columnas que existen en ProyectoListDTO
const columns = [
  { name: 'Titulo', label: 'Título', field: (row) => row.Titulo || row.titulo, align: 'left' },
  { name: 'Estatus', label: 'Estatus', field: (row) => row.Estatus || row.estatus, align: 'left' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
]

const API_URL = '/proyectos' // Ajusta la URL según tu backend

const cargarProyectos = async () => {
  try {
    const token = localStorage.getItem('jwt')
    const res = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    // Normalizar los nombres de campos a mayúscula inicial
    let data = []
    if (Array.isArray(res.data)) {
      data = res.data
    } else if (Array.isArray(res.data.proyectos)) {
      data = res.data.proyectos
    } else if (Array.isArray(res.data.data)) {
      data = res.data.data
    }
    proyectos.value = data.map((p) => ({
      ...p,
      Titulo: p.Titulo || p.titulo,
      Estatus: p.Estatus || p.estatus,
      ProyectoId: p.ProyectoId || p.proyectoId,
    }))
  } catch {
    $q.notify({ type: 'negative', message: 'Error al cargar proyectos' })
  }
}

const onSubmit = async () => {
  try {
    const token = localStorage.getItem('jwt')
    await axios.put(
      `${API_URL}/${form.value.ProyectoId}`,
      {
        FechaFin: form.value.FechaFin,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    $q.notify({ type: 'positive', message: 'Fecha de fin actualizada' })
    resetForm()
    cargarProyectos()
  } catch {
    $q.notify({ type: 'negative', message: 'Error al actualizar proyecto' })
  }
}

const editarProyecto = async (proyecto) => {
  try {
    const token = localStorage.getItem('jwt')
    // Obtener el proyecto completo por ID para traer FechaFin
    const res = await axios.get(`${API_URL}/${proyecto.ProyectoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    form.value = {
      ProyectoId: res.data.ProyectoId,
      FechaFin: res.data.FechaFin ? res.data.FechaFin.slice(0, 10) : '',
    }
    editando.value = true
  } catch {
    $q.notify({ type: 'negative', message: 'No se pudo cargar el proyecto para editar.' })
  }
}

const resetForm = () => {
  form.value = { ProyectoId: null, FechaFin: '' }
  editando.value = false
}

onMounted(() => {
  cargarProyectos()
})
</script>

<style scoped>
.q-table .q-btn {
  min-width: 32px;
}
</style>
