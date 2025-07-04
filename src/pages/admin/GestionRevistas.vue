<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Gestión de Revistas</div>
    <div class="row q-mb-md items-center">
      <BaseButton
        color="primary"
        label="Nueva Revista"
        customClass="q-mr-md"
        @click="abrirModalCrear"
      />
    </div>
    <BaseTable
      :rows="revistas"
      :columns="columns"
      rowKey="issn"
      flat
      bordered
      :pagination="{ rowsPerPage: 10 }"
    >
      <template #body-cell-activa="props">
        <q-td align="center">{{ props.row.activa ? 'Sí' : 'No' }}</q-td>
      </template>
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

    <!-- Modal para crear/editar revista -->
    <q-dialog v-model="showModal">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ editando ? 'Editar' : 'Nueva' }} Revista</div>
          <BaseInput
            v-model="revistaForm.issn"
            label="ISSN"
            dense
            customClass="q-mb-sm"
            :readonly="editando"
          />
          <BaseInput v-model="revistaForm.titulo" label="Título" dense customClass="q-mb-sm" />
          <BaseInput
            v-model="revistaForm.categoria"
            label="Categoría"
            dense
            customClass="q-mb-sm"
          />
          <BaseInput v-model="revistaForm.cuartil" label="Cuartil" dense customClass="q-mb-sm" />
          <BaseInput v-model="revistaForm.pais" label="País" dense customClass="q-mb-sm" />
          <q-toggle v-model="revistaForm.activa" label="Activa" class="q-mb-sm" />
        </q-card-section>
        <q-card-actions align="right">
          <BaseButton flat label="Cancelar" color="negative" v-close-popup />
          <BaseButton
            flat
            :label="editando ? 'Guardar' : 'Crear'"
            color="primary"
            @click="guardarRevista"
          />
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
import BackButton from 'src/components/common/BackButton.vue'
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import BaseInput from 'src/components/common/BaseInput.vue'
import BaseButton from 'src/components/common/BaseButton.vue'
import BaseTable from 'src/components/common/BaseTable.vue'

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

// Lista de ISSN a consultar individualmente (puedes poblarla desde otro lado o dejarla fija para pruebas)
const issnList = ref([])

// Llama este método para poblar la tabla con los datos individuales
async function cargarRevistasPorIssn() {
  revistas.value = []
  const token = localStorage.getItem('jwt')
  for (const issn of issnList.value) {
    try {
      const response = await api.get(`/Revistas/${issn}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      revistas.value.push(response.data)
    } catch (error) {
      // Si alguna revista no se encuentra, puedes mostrar un error o ignorar
      console.error(`Error al obtener revista ${issn}:`, error)
    }
  }
}

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
    await api.delete(`/Revistas/${row.issn}`, {
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
        `/Revistas/${revistaForm.value.issn}`,
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
        '/Revistas',
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

// Si quieres seguir usando la carga masiva, deja este método:
async function cargarRevistas() {
  try {
    const token = localStorage.getItem('jwt')
    const response = await api.get('/Revistas', {
      headers: { Authorization: `Bearer ${token}` },
    })
    revistas.value = response.data
  } catch (error) {
    revistas.value = []
    errorMsg.value = error?.response?.data?.message || error.message || 'Error al obtener revistas.'
    console.error('Error al obtener revistas:', error)
  }
}

// Al montar, primero obtenemos todos los ISSN, luego consultamos individualmente
onMounted(async () => {
  try {
    const token = localStorage.getItem('jwt')
    const response = await api.get('/Revistas', {
      headers: { Authorization: `Bearer ${token}` },
    })
    // Extrae los ISSN de la consulta masiva
    issnList.value = Array.isArray(response.data) ? response.data.map((r) => r.issn) : []
    // Ahora consulta individualmente cada revista
    await cargarRevistasPorIssn()
  } catch (error) {
    revistas.value = []
    errorMsg.value =
      error?.response?.data?.message || error.message || 'Error al obtener ISSN de revistas.'
    console.error('Error al obtener ISSN de revistas:', error)
  }
})
</script>
