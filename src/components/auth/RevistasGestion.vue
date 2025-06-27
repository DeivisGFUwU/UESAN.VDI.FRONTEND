<template>
  <div class="relative min-h-screen w-full flex items-center justify-center font-sans bg-esan-background">
    <div class="login-bg" aria-hidden="true"></div>
    <q-card
      class="q-pa-xl q-mx-auto q-mt-xl q-mb-xl shadow-10 executive-bg"
      style="min-width: 400px; max-width: 900px; background: rgba(255,255,255,0.85)"
    >
      <div class="text-h5 text-center q-mb-lg text-esan-primary font-bold">Gestión de Revistas Científicas</div>
      <q-btn label="Agregar Revista" color="esan-primary" @click="abrirDialogoAgregar" class="q-mb-md" style="background-color: #b80000; color: #fff; font-weight: bold;" />
      <q-table
        :rows="revistas"
        :columns="columns"
        row-key="issn"
        flat
        bordered
        :pagination="{ rowsPerPage: 5 }"
        :filter="filtro"
        class="q-mb-lg"
      >
        <template #top-right>
          <q-input dense debounce="300" v-model="filtro" placeholder="Buscar..." filled />
        </template>
        <template #body-cell-activa="props">
          <q-td :props="props">
            <q-badge :color="props.row.activa ? 'green' : 'red'">
              {{ props.row.activa ? 'Sí' : 'No' }}
            </q-badge>
          </q-td>
        </template>
        <template #body-cell-acciones="props">
          <q-td :props="props">
            <q-btn dense flat icon="edit" color="esan-primary" style="background-color: #b80000; color: #fff; font-weight: bold;" @click="editarRevista(props.row)" />
            <q-btn dense flat icon="delete" color="esan-primary" style="background-color: #b80000; color: #fff; font-weight: bold;" @click="eliminarRevista(props.row.issn)" />
          </q-td>
        </template>
      </q-table>
      <!-- Diálogo para agregar/editar revista -->
      <q-dialog v-model="dialogoVisible">
        <q-card style="min-width: 350px; max-width: 500px;">
          <q-card-section>
            <div class="text-h6">{{ editando ? 'Editar Revista' : 'Agregar Revista' }}</div>
          </q-card-section>
          <q-card-section>
            <q-form @submit.prevent="guardarRevista">
              <q-input filled v-model="form.issn" label="ISSN" :disable="editando" required class="q-mb-md" />
              <q-input filled v-model="form.titulo" label="Título" required class="q-mb-md" />
              <q-input filled v-model="form.categoria" label="Categoría" required class="q-mb-md" />
              <q-input filled v-model="form.cuartil" label="Cuartil" required class="q-mb-md" />
              <q-select filled v-model="form.activa" :options="[{label:'Sí',value:true},{label:'No',value:false}]" label="Activa" required class="q-mb-md" />
              <q-input filled v-model="form.pais" label="País" required class="q-mb-md" />
              <q-btn label="Guardar" type="submit" color="esan-primary" class="full-width q-mt-md" style="background-color: #b80000; color: #fff; font-weight: bold;" />
            </q-form>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn flat label="Cancelar" color="grey" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
      <!-- Botón para ir a InvestigaciónForm -->
      <div class="q-mt-lg flex flex-center">
        <q-btn label="Ir a Formulario de Investigación" color="esan-primary" style="background-color: #b80000; color: #fff; font-weight: bold;" @click="goToInvestigacionForm" />
      </div>
    </q-card>
  </div>
</template>

<script setup>
// Página de gestión de revistas científicas (con backend usando Axios)
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import apiRevistas from '../../boot/apiRevistas'

const router = useRouter()
const $q = useQuasar()

// Columnas para la QTable
const columns = [
  { name: 'issn', label: 'ISSN', field: 'issn', align: 'left', sortable: true },
  { name: 'titulo', label: 'Título', field: 'titulo', align: 'left', sortable: true },
  { name: 'categoria', label: 'Categoría', field: 'categoria', align: 'left', sortable: true },
  { name: 'cuartil', label: 'Cuartil', field: 'cuartil', align: 'left', sortable: true },
  { name: 'activa', label: 'Activa', field: 'activa', align: 'center', sortable: true },
  { name: 'pais', label: 'País', field: 'pais', align: 'left', sortable: true },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' }
]

// Datos de revistas
const revistas = ref([])
const filtro = ref('')
const dialogoVisible = ref(false)
const editando = ref(false)
const form = ref({ issn: '', titulo: '', categoria: '', cuartil: '', activa: true, pais: '' })

onMounted(async () => {
  await cargarRevistas()
})

async function cargarRevistas() {
  try {
    const response = await apiRevistas.get('/')
    revistas.value = response.data
  } catch {
    $q.notify({ type: 'negative', message: 'Error al cargar revistas del backend.' })
    revistas.value = []
  }
}

function abrirDialogoAgregar() {
  editando.value = false
  form.value = { issn: '', titulo: '', categoria: '', cuartil: '', activa: true, pais: '' }
  dialogoVisible.value = true
}

function editarRevista(row) {
  editando.value = true
  form.value = { ...row }
  dialogoVisible.value = true
}

async function guardarRevista() {
  if (!form.value.issn || !form.value.titulo || !form.value.categoria || !form.value.cuartil || !form.value.pais) {
    $q.notify({ type: 'negative', message: 'Completa todos los campos requeridos.' })
    return
  }
  try {
    if (editando.value) {
      // PUT para editar
      await apiRevistas.put(`/${form.value.issn}`, { ...form.value })
      $q.notify({ type: 'positive', message: 'Revista actualizada en backend.' })
    } else {
      // POST para agregar
      await apiRevistas.post('/', { ...form.value })
      $q.notify({ type: 'positive', message: 'Revista agregada en backend.' })
    }
    dialogoVisible.value = false
    await cargarRevistas()
  } catch {
    $q.notify({ type: 'negative', message: 'Error al guardar en backend.' })
  }
}

async function eliminarRevista(issn) {
  try {
    await apiRevistas.delete(`/${issn}`)
    $q.notify({ type: 'info', message: 'Revista eliminada en backend.' })
    await cargarRevistas()
  } catch {
    $q.notify({ type: 'negative', message: 'Error al eliminar en backend.' })
  }
}

function goToInvestigacionForm() {
  router.push('/investigacion-form')
}
</script>

<style scoped>
.login-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -2;
  background-image: url('/icons/Portada.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 1;
}
.executive-bg {
  background: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  border-radius: 18px;
}
:deep(.q-field--focused .q-field__control:after) {
  border-bottom: 2px solid #b80000 !important;
}
:deep(.q-field__label--active),
:deep(.q-field--focused .q-field__label) {
  color: #b80000 !important;
}
:deep(.q-field__control:after) {
  border-bottom: 2px solid #b80000 !important;
}
:deep(.q-field__control:before) {
  border-bottom: 1px solid #b80000 !important;
}
:deep(.q-field__native) {
  color: #222 !important;
  font-family: 'Inter', sans-serif !important;
}
:deep(.q-field--filled .q-field__control) {
  background-color: transparent !important;
}
:deep(.q-field__label) {
  color: theme('colors.esan.primary.DEFAULT') !important;
  color: #b80000 !important;
  font-family: 'Inter', sans-serif !important;
  font-weight: 600 !important;
}
:deep(.q-field--focused .q-field__label) {
  color: theme('colors.esan.primary.DEFAULT') !important;
  color: #b80000 !important;
}
:deep(.q-field__control:after) {
  border-bottom: 2px solid #b80000 !important;
}
:deep(.q-field--focused .q-field__control:after) {
  border-bottom: 2.5px solid #b80000 !important;
}
:deep(.q-field--error .q-field__label) {
  color: #dc2626 !important;
}
:deep(.q-field--error .q-field__control:after) {
  border-bottom: 2px solid #dc2626 !important;
}
</style>

<!--
Este componente permite listar, agregar, editar y eliminar revistas científicas usando datos locales y backend.
Conecta a un backend para obtener, crear, actualizar y eliminar revistas científicas.
-->
