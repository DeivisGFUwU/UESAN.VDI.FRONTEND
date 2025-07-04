<template>
  <q-page class="q-pa-md">
    <div class="text-h6 q-mb-md">Formularios de Investigación</div>
    <div class="q-mb-md">
      <BaseButton color="primary" label="Nuevo Formulario" @click="abrirModalCrear" />
    </div>
    <BaseTable
      :rows="formularios"
      :columns="columns"
      rowKey="FormularioId"
      flat
      bordered
      :pagination="{ rowsPerPage: 10 }"
    >
      <template #body-cell-acciones="props">
        <q-td align="center">
          <BaseButton
            v-if="canEdit(props.row)"
            size="sm"
            color="secondary"
            icon="edit"
            flat
            @click="onEdit(props.row)"
          />
          <q-tooltip v-else>Solo el dueño puede editar</q-tooltip>
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
          <BaseInput
            v-model="form.ProyectoId"
            label="ID Proyecto"
            type="number"
            dense
            customClass="q-mb-sm"
          />
          <BaseInput
            v-model="form.TipoFormulario"
            label="Tipo de Formulario"
            dense
            customClass="q-mb-sm"
          />
          <BaseInput
            v-model="form.Resumen"
            label="Resumen"
            type="textarea"
            dense
            customClass="q-mb-sm"
          />
          <BaseInput
            v-model="form.Objetivos"
            label="Objetivos"
            type="textarea"
            dense
            customClass="q-mb-sm"
          />
          <BaseInput
            v-model="form.MedioPublicacion"
            label="Medio de Publicación"
            dense
            customClass="q-mb-sm"
          />
          <BaseInput v-model="form.Issn" label="ISSN" dense customClass="q-mb-sm" />
          <BaseInput v-model="form.Doi" label="DOI" dense customClass="q-mb-sm" />
          <BaseInput
            v-model.number="form.Presupuesto"
            label="Presupuesto"
            type="number"
            dense
            customClass="q-mb-sm"
          />
          <BaseInput
            v-model="form.Cronograma"
            label="Cronograma"
            type="textarea"
            dense
            customClass="q-mb-sm"
          />
        </q-card-section>
        <q-card-actions align="right">
          <BaseButton flat label="Cancelar" color="negative" v-close-popup @click="resetForm" />
          <BaseButton
            flat
            :label="editando ? 'Guardar' : 'Crear'"
            color="primary"
            @click="guardarFormulario"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import BaseInput from 'src/components/common/BaseInput.vue'
import BaseButton from 'src/components/common/BaseButton.vue'
import BaseTable from 'src/components/common/BaseTable.vue'

defineOptions({ name: 'ProfesorFormularios' })

// Obtener usuario actual del localStorage
const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
const currentProfesorId =
  currentUser.profesorId || currentUser.ProfesorId || currentUser.id || currentUser.Id

function canEdit(row) {
  // Permitir solo si el ProfesorId del formulario coincide con el usuario actual
  return (
    row.ProfesorId === currentProfesorId || row.profesorId === currentProfesorId // por si viene en minúscula
  )
}

const formularios = ref([])
const errorMsg = ref('')
const successMsg = ref('')
const showModal = ref(false)
const editando = ref(false)
const form = ref({
  FormularioId: null,
  ProyectoId: null,
  TipoFormulario: '',
  Resumen: '',
  Objetivos: '',
  MedioPublicacion: '',
  Issn: '',
  Doi: '',
  Presupuesto: null,
  Cronograma: '',
})

const columns = [
  {
    name: 'TipoFormulario',
    label: 'Tipo',
    field: (row) => row.TipoFormulario || row.tipoFormulario,
    align: 'left',
  },
  { name: 'Resumen', label: 'Resumen', field: (row) => row.Resumen || row.resumen, align: 'left' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
]

const API_URL = '/formulariosinvestigacion'

const cargarFormularios = async () => {
  try {
    const token = localStorage.getItem('jwt')
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    })
    let data = []
    if (Array.isArray(res.data)) {
      data = res.data
    } else if (Array.isArray(res.data.formularios)) {
      data = res.data.formularios
    } else if (Array.isArray(res.data.data)) {
      data = res.data.data
    }
    formularios.value = data.map((f) => ({
      ...f,
      TipoFormulario: f.TipoFormulario || f.tipoFormulario,
      Resumen: f.Resumen || f.resumen,
      FormularioId: f.FormularioId || f.formularioId,
      ProyectoId: f.ProyectoId || f.proyectoId,
      Objetivos: f.Objetivos || f.objetivos,
      MedioPublicacion: f.MedioPublicacion || f.medioPublicacion,
      Issn: f.Issn || f.issn,
      Doi: f.Doi || f.doi,
      Presupuesto: f.Presupuesto || f.presupuesto,
      Cronograma: f.Cronograma || f.cronograma,
    }))
  } catch {
    errorMsg.value = 'Error al cargar formularios'
  }
}

function abrirModalCrear() {
  editando.value = false
  form.value = {
    FormularioId: null,
    ProyectoId: null,
    TipoFormulario: '',
    Resumen: '',
    Objetivos: '',
    MedioPublicacion: '',
    Issn: '',
    Doi: '',
    Presupuesto: null,
    Cronograma: '',
  }
  showModal.value = true
}

function onEdit(row) {
  editando.value = true
  form.value = { ...row }
  showModal.value = true
}

async function guardarFormulario() {
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const token = localStorage.getItem('jwt')
    if (editando.value) {
      await axios.put(`${API_URL}/${form.value.FormularioId}`, form.value, {
        headers: { Authorization: `Bearer ${token}` },
      })
      successMsg.value = 'Formulario actualizado correctamente.'
    } else {
      await axios.post(API_URL, form.value, { headers: { Authorization: `Bearer ${token}` } })
      successMsg.value = 'Formulario creado correctamente.'
    }
    showModal.value = false
    await cargarFormularios()
  } catch {
    errorMsg.value = 'Error al guardar formulario.'
  }
}

function resetForm() {
  form.value = {
    FormularioId: null,
    ProyectoId: null,
    TipoFormulario: '',
    Resumen: '',
    Objetivos: '',
    MedioPublicacion: '',
    Issn: '',
    Doi: '',
    Presupuesto: null,
    Cronograma: '',
  }
  showModal.value = false
  editando.value = false
}

onMounted(cargarFormularios)
</script>
