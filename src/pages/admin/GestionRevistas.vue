<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Gestión de Revistas</div>
    <div class="row q-mb-md items-center">
      <q-btn color="primary" label="Nueva Revista" class="q-mr-md" @click="abrirModalCrear" />
    </div>
    <q-table
      :rows="revistas"
      :columns="columns"
      row-key="issn"
      flat
      bordered
      :pagination="{ rowsPerPage: 10 }"
    >
      <template v-slot:body-cell-activa="props">
        <q-td align="center">{{ props.row.activa ? 'Sí' : 'No' }}</q-td>
      </template>
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

    <!-- Modal para crear/editar revista -->
    <q-dialog v-model="showModal">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ editando ? 'Editar' : 'Nueva' }} Revista</div>
          <q-input
            v-model="revistaForm.issn"
            label="ISSN"
            dense
            class="q-mb-sm"
            :readonly="editando"
          />
          <q-input v-model="revistaForm.titulo" label="Título" dense class="q-mb-sm" />
          <q-input v-model="revistaForm.categoria" label="Categoría" dense class="q-mb-sm" />
          <q-input v-model="revistaForm.cuartil" label="Cuartil" dense class="q-mb-sm" />
          <q-input v-model="revistaForm.pais" label="País" dense class="q-mb-sm" />
          <q-toggle v-model="revistaForm.activa" label="Activa" class="q-mb-sm" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn
            flat
            :label="editando ? 'Guardar' : 'Crear'"
            color="primary"
            @click="guardarRevista"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'

const revistas = ref([])
const errorMsg = ref('')
const successMsg = ref('')
const showModal = ref(false)
const editando = ref(false)
const revistaForm = ref({
  issn: '',
  titulo: '',
  categoria: '',
  cuartil: '',
  activa: true,
  pais: '',
})

const columns = [
  { name: 'issn', label: 'ISSN', field: 'issn', align: 'left' },
  { name: 'titulo', label: 'Título', field: 'titulo', align: 'left' },
  { name: 'categoria', label: 'Categoría', field: 'categoria', align: 'left' },
  { name: 'cuartil', label: 'Cuartil', field: 'cuartil', align: 'left' },
  { name: 'pais', label: 'País', field: 'pais', align: 'left' },
  { name: 'activa', label: 'Activa', field: 'activa', align: 'center' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
]

function abrirModalCrear() {
  editando.value = false
  revistaForm.value = {
    issn: '',
    titulo: '',
    categoria: '',
    cuartil: '',
    activa: true,
    pais: '',
  }
  showModal.value = true
}

function onEdit(row) {
  editando.value = true
  revistaForm.value = {
    issn: row.issn,
    titulo: row.titulo,
    categoria: row.categoria || '',
    cuartil: row.cuartil || '',
    activa: row.activa,
    pais: row.pais || '',
  }
  showModal.value = true
}

async function onDelete(row) {
  if (!confirm('¿Estás seguro de que deseas eliminar esta revista?')) return
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const token = localStorage.getItem('jwt')
    await api.delete(`/api/Revistas/${row.issn}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    successMsg.value = 'Revista eliminada correctamente.'
    await cargarRevistas()
  } catch (error) {
    errorMsg.value = error?.response?.data?.message || error.message || 'Error al eliminar revista.'
    console.error('Error al eliminar revista:', error)
  }
}

async function guardarRevista() {
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const token = localStorage.getItem('jwt')
    if (editando.value) {
      await api.put(
        `/api/Revistas/${revistaForm.value.issn}`,
        {
          Issn: revistaForm.value.issn,
          Titulo: revistaForm.value.titulo,
          Categoria: revistaForm.value.categoria,
          Cuartil: revistaForm.value.cuartil,
          Activa: revistaForm.value.activa,
          Pais: revistaForm.value.pais,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      successMsg.value = 'Revista actualizada correctamente.'
    } else {
      await api.post(
        '/api/Revistas',
        {
          Issn: revistaForm.value.issn,
          Titulo: revistaForm.value.titulo,
          Categoria: revistaForm.value.categoria,
          Cuartil: revistaForm.value.cuartil,
          Activa: revistaForm.value.activa,
          Pais: revistaForm.value.pais,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      successMsg.value = 'Revista creada correctamente.'
    }
    showModal.value = false
    await cargarRevistas()
  } catch (error) {
    errorMsg.value = error?.response?.data?.message || error.message || 'Error al guardar revista.'
    console.error('Error al guardar revista:', error)
  }
}

async function cargarRevistas() {
  try {
    const token = localStorage.getItem('jwt')
    const response = await api.get('/api/Revistas', {
      headers: { Authorization: `Bearer ${token}` },
    })
    revistas.value = response.data
  } catch (error) {
    revistas.value = []
    errorMsg.value = error?.response?.data?.message || error.message || 'Error al obtener revistas.'
    console.error('Error al obtener revistas:', error)
  }
}

onMounted(cargarRevistas)
</script>
