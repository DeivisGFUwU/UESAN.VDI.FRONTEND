<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Gestión de Formularios de Investigación</div>
    <div class="row q-mb-md items-center">
      <BaseButton
        color="primary"
        label="Nuevo Formulario"
        customClass="q-mr-md"
        @click="abrirModalCrear"
      />
    </div>
    <BaseTable
      :rows="formularios"
      :columns="columns"
      rowKey="formularioId"
      flat
      bordered
      :pagination="{ rowsPerPage: 10 }"
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

    <!-- Modal para crear/editar formulario -->
    <q-dialog v-model="showModal">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">{{ editando ? 'Editar' : 'Nuevo' }} Formulario</div>
          <BaseSelect
            v-model="formularioForm.proyectoId"
            :options="proyectosOptions"
            label="Proyecto"
            option-label="titulo"
            option-value="proyectoId"
            dense
            class="q-mb-sm"
          />
          <BaseInput
            v-model="formularioForm.tipoFormulario"
            label="Tipo de Formulario"
            dense
            class="q-mb-sm"
          />
          <BaseInput
            v-model="formularioForm.resumen"
            label="Resumen"
            dense
            class="q-mb-sm"
            type="textarea"
          />
          <BaseInput
            v-model="formularioForm.objetivos"
            label="Objetivos"
            dense
            class="q-mb-sm"
            type="textarea"
          />
          <BaseInput
            v-model="formularioForm.medioPublicacion"
            label="Medio de Publicación"
            dense
            class="q-mb-sm"
          />
          <BaseInput v-model="formularioForm.issn" label="ISSN" dense class="q-mb-sm" />
          <BaseInput v-model="formularioForm.doi" label="DOI" dense class="q-mb-sm" />
          <BaseInput
            v-model.number="formularioForm.presupuesto"
            label="Presupuesto"
            dense
            class="q-mb-sm"
            type="number"
          />
          <BaseInput
            v-model="formularioForm.cronograma"
            label="Cronograma"
            dense
            class="q-mb-sm"
            type="textarea"
          />
        </q-card-section>
        <q-card-actions align="right">
          <BaseButton flat label="Cancelar" color="negative" v-close-popup />
          <BaseButton
            flat
            :label="editando ? 'Guardar' : 'Crear'"
            color="primary"
            @click="guardarFormulario"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <BackButton class="back-btn-bottom" :to="'/admin/Gestion-formularios-investigacion'" />
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
import BaseSelect from 'src/components/common/BaseSelect.vue'

const formularios = ref([])
const proyectosOptions = ref([])
const errorMsg = ref('')
const successMsg = ref('')
const showModal = ref(false)
const editando = ref(false)
const formularioForm = ref({
  formularioId: null,
  proyectoId: null,
  tipoFormulario: '',
  resumen: '',
  objetivos: '',
  medioPublicacion: '',
  issn: '',
  doi: '',
  presupuesto: 0,
  cronograma: '',
})

const columns = [
  { name: 'formularioId', label: 'ID', field: 'formularioId', align: 'left' },
  { name: 'proyecto', label: 'Proyecto', field: 'proyecto', align: 'left' },
  { name: 'tipoFormulario', label: 'Tipo', field: 'tipoFormulario', align: 'left' },
  { name: 'resumen', label: 'Resumen', field: 'resumen', align: 'left' },
  { name: 'objetivos', label: 'Objetivos', field: 'objetivos', align: 'left' },
  { name: 'medioPublicacion', label: 'Medio Pub.', field: 'medioPublicacion', align: 'left' },
  { name: 'issn', label: 'ISSN', field: 'issn', align: 'left' },
  { name: 'doi', label: 'DOI', field: 'doi', align: 'left' },
  { name: 'presupuesto', label: 'Presupuesto', field: 'presupuesto', align: 'left' },
  { name: 'cronograma', label: 'Cronograma', field: 'cronograma', align: 'left' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
]

function abrirModalCrear() {
  editando.value = false
  formularioForm.value = {
    formularioId: null,
    proyectoId: null,
    tipoFormulario: '',
    resumen: '',
    objetivos: '',
    medioPublicacion: '',
    issn: '',
    doi: '',
    presupuesto: 0,
    cronograma: '',
  }
  showModal.value = true
}

function onEdit(row) {
  editando.value = true
  formularioForm.value = {
    formularioId: row.formularioId,
    proyectoId: row.proyectoId,
    tipoFormulario: row.tipoFormulario || '',
    resumen: row.resumen || '',
    objetivos: row.objetivos || '',
    medioPublicacion: row.medioPublicacion || '',
    issn: row.issn || '',
    doi: row.doi || '',
    presupuesto: row.presupuesto || 0,
    cronograma: row.cronograma || '',
  }
  showModal.value = true
}

async function onDelete(row) {
  if (!confirm('¿Estás seguro de que deseas eliminar este formulario?')) return
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const token = localStorage.getItem('jwt')
    await api.delete(`/FormulariosInvestigacion/${row.formularioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    successMsg.value = 'Formulario eliminado correctamente.'
    await cargarFormularios()
  } catch (error) {
    errorMsg.value =
      error?.response?.data?.message || error.message || 'Error al eliminar formulario.'
    console.error('Error al eliminar formulario:', error)
  }
}

async function guardarFormulario() {
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const token = localStorage.getItem('jwt')
    if (editando.value) {
      await api.put(
        `/FormulariosInvestigacion/${formularioForm.value.formularioId}`,
        {
          FormularioId: formularioForm.value.formularioId,
          ProyectoId: formularioForm.value.proyectoId,
          TipoFormulario: formularioForm.value.tipoFormulario,
          Resumen: formularioForm.value.resumen,
          Objetivos: formularioForm.value.objetivos,
          MedioPublicacion: formularioForm.value.medioPublicacion,
          Issn: formularioForm.value.issn,
          Doi: formularioForm.value.doi,
          Presupuesto: formularioForm.value.presupuesto,
          Cronograma: formularioForm.value.cronograma,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      successMsg.value = 'Formulario actualizado correctamente.'
    } else {
      await api.post(
        '/FormulariosInvestigacion',
        {
          ProyectoId: formularioForm.value.proyectoId,
          TipoFormulario: formularioForm.value.tipoFormulario,
          Resumen: formularioForm.value.resumen,
          Objetivos: formularioForm.value.objetivos,
          MedioPublicacion: formularioForm.value.medioPublicacion,
          Issn: formularioForm.value.issn,
          Doi: formularioForm.value.doi,
          Presupuesto: formularioForm.value.presupuesto,
          Cronograma: formularioForm.value.cronograma,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      successMsg.value = 'Formulario creado correctamente.'
    }
    showModal.value = false
    await cargarFormularios()
  } catch (error) {
    errorMsg.value =
      error?.response?.data?.message || error.message || 'Error al guardar formulario.'
    console.error('Error al guardar formulario:', error)
  }
}

async function cargarFormularios() {
  try {
    const token = localStorage.getItem('jwt')
    const response = await api.get('/FormulariosInvestigacion', {
      headers: { Authorization: `Bearer ${token}` },
    })
    // Mapear para mostrar nombre de proyecto
    formularios.value = response.data.map((f) => {
      const proyecto = proyectosOptions.value.find((p) => p.proyectoId === f.proyectoId)
      return {
        ...f,
        proyecto: proyecto ? proyecto.titulo : f.proyectoId,
      }
    })
  } catch (error) {
    formularios.value = []
    errorMsg.value =
      error?.response?.data?.message || error.message || 'Error al obtener formularios.'
    console.error('Error al obtener formularios:', error)
  }
}

async function cargarProyectos() {
  try {
    const token = localStorage.getItem('jwt')
    const response = await api.get('/Proyectos', {
      headers: { Authorization: `Bearer ${token}` },
    })
    proyectosOptions.value = response.data
  } catch {
    proyectosOptions.value = []
  }
}

async function recargarTodo() {
  await cargarProyectos()
  await cargarFormularios()
}

onMounted(() => {
  recargarTodo()
})
</script>
