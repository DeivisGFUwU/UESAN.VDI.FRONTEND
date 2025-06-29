<template>
  <q-page class="q-pa-md">
    <h2>Gestión de Proyectos</h2>

    <!-- Formulario para agregar/editar proyecto -->
    <q-form @submit.prevent="onSubmit">
      <div class="row q-col-gutter-md">
        <div class="col-6">
          <q-input filled v-model="form.Titulo" label="Título del Proyecto" required />
        </div>
      </div>
      <div class="q-mt-md">
        <q-btn color="primary" :label="editando ? 'Actualizar' : 'Agregar'" type="submit" />
        <q-btn flat label="Cancelar" @click="resetForm" v-if="editando" />
      </div>
    </q-form>

    <q-separator class="q-my-lg" />

    <!-- Tabla de proyectos -->
    <q-table title="Proyectos" :rows="proyectos" :columns="columns" row-key="ProyectoId" flat>
      <template v-slot:body-cell-acciones="props">
        <q-btn size="sm" color="primary" icon="edit" @click="editarProyecto(props.row)" />
        <q-btn
          size="sm"
          color="negative"
          icon="delete"
          @click="eliminarProyecto(props.row.ProyectoId)"
          class="q-ml-sm"
        />
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'

defineOptions({ name: 'ProfesorProyectos' })

const $q = useQuasar()
const proyectos = ref([])
const editando = ref(false)
const form = ref({ ProyectoId: null, Titulo: '' })

const columns = [
  { name: 'Titulo', label: 'Título', field: 'Titulo', align: 'left' },
  { name: 'Estatus', label: 'Estatus', field: 'Estatus', align: 'left' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
]

const API_URL = 'http://localhost:5192/api/proyectos' // Ajusta la URL según tu backend

const cargarProyectos = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    proyectos.value = res.data
  } catch {
    $q.notify({ type: 'negative', message: 'Error al cargar proyectos' })
  }
}

const onSubmit = async () => {
  try {
    const token = localStorage.getItem('token')
    if (editando.value) {
      await axios.put(`${API_URL}/${form.value.ProyectoId}`, form.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      $q.notify({ type: 'positive', message: 'Proyecto actualizado' })
    } else {
      await axios.post(API_URL, form.value, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      $q.notify({ type: 'positive', message: 'Proyecto agregado' })
    }
    resetForm()
    cargarProyectos()
  } catch {
    $q.notify({ type: 'negative', message: 'Error al guardar proyecto' })
  }
}

const editarProyecto = (proyecto) => {
  form.value = { ProyectoId: proyecto.ProyectoId, Titulo: proyecto.Titulo, Descripcion: '' }
  editando.value = true
}

const eliminarProyecto = async (id) => {
  try {
    const token = localStorage.getItem('token')
    await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    $q.notify({ type: 'positive', message: 'Proyecto eliminado' })
    cargarProyectos()
  } catch {
    $q.notify({ type: 'negative', message: 'Error al eliminar proyecto' })
  }
}

const resetForm = () => {
  form.value = { ProyectoId: null, Titulo: '', Descripcion: '' }
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
