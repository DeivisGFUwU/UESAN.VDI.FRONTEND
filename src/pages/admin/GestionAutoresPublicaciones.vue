<template>
  <q-page class="q-pa-md" style="position: relative; min-height: 80vh">
    <div class="text-h5 q-mb-md">Gestión de Autores de Publicaciones</div>
    <div class="row q-mb-md items-center">
      <BaseButton
        color="primary"
        label="Nuevo Autor"
        customClass="q-mr-md"
        @click="abrirModalCrear"
      />
    </div>
    <BaseTable
      :rows="autores"
      :columns="columns"
      rowKey="id"
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

    <!-- Modal para crear/editar autor -->
    <q-dialog v-model="showModal">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ editando ? 'Editar' : 'Nuevo' }} Autor de Publicación</div>
          <BaseSelect
            v-model="autorForm.publicacionId"
            :options="publicacionesOptions"
            label="Publicación"
            option-label="titulo"
            option-value="publicacionId"
            dense
            class="q-mb-sm"
          />
          <BaseSelect
            v-model="autorForm.profesorId"
            :options="profesoresOptions"
            label="Profesor"
            option-label="nombreCompleto"
            option-value="profesorId"
            dense
            class="q-mb-sm"
          />
          <BaseInput
            v-model.number="autorForm.ordenAutor"
            label="Orden del Autor"
            dense
            class="q-mb-sm"
            type="number"
            min="1"
          />
          <BaseInput
            v-model.number="autorForm.porcentajeParticipacion"
            label="% Participación"
            dense
            class="q-mb-sm"
            type="number"
            min="0"
            max="100"
          />
        </q-card-section>
        <q-card-actions align="right">
          <BaseButton flat label="Cancelar" color="negative" v-close-popup />
          <BaseButton
            flat
            :label="editando ? 'Guardar' : 'Crear'"
            color="primary"
            @click="guardarAutor"
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
import BaseInput from 'src/components/common/BaseInput.vue'
import BaseButton from 'src/components/common/BaseButton.vue'
import BaseTable from 'src/components/common/BaseTable.vue'
import BaseSelect from 'src/components/common/BaseSelect.vue'
import BackButton from 'src/components/common/BackButton.vue'

const autores = ref([])
const publicacionesOptions = ref([])
const profesoresOptions = ref([])
const errorMsg = ref('')
const successMsg = ref('')
const showModal = ref(false)
const editando = ref(false)
const autorForm = ref({
  id: null,
  publicacionId: null,
  profesorId: null,
  ordenAutor: 1,
  porcentajeParticipacion: 0,
})

const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'publicacion', label: 'Publicación', field: 'publicacion', align: 'left' },
  { name: 'profesor', label: 'Profesor', field: 'profesor', align: 'left' },
  { name: 'ordenAutor', label: 'Orden', field: 'ordenAutor', align: 'left' },
  {
    name: 'porcentajeParticipacion',
    label: '% Participación',
    field: 'porcentajeParticipacion',
    align: 'left',
  },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
]

function abrirModalCrear() {
  editando.value = false
  autorForm.value = {
    id: null,
    publicacionId: null,
    profesorId: null,
    ordenAutor: 1,
    porcentajeParticipacion: 0,
  }
  showModal.value = true
}

function onEdit(row) {
  editando.value = true
  autorForm.value = {
    id: row.id,
    publicacionId: row.publicacionId,
    profesorId: row.profesorId,
    ordenAutor: row.ordenAutor,
    porcentajeParticipacion: row.porcentajeParticipacion,
  }
  showModal.value = true
}

async function onDelete(row) {
  if (!confirm('¿Estás seguro de que deseas eliminar este autor?')) return
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const token = localStorage.getItem('jwt')
    await api.delete(`/AutoresPublicacion/${row.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    successMsg.value = 'Autor eliminado correctamente.'
    await cargarAutores()
  } catch (error) {
    errorMsg.value = error?.response?.data?.message || error.message || 'Error al eliminar autor.'
    console.error('Error al eliminar autor:', error)
  }
}

async function guardarAutor() {
  errorMsg.value = ''
  successMsg.value = ''
  // Validaciones básicas
  if (!autorForm.value.publicacionId || !autorForm.value.profesorId) {
    errorMsg.value = 'Debe seleccionar publicación y profesor.'
    return
  }
  if (autorForm.value.ordenAutor < 1) {
    errorMsg.value = 'El orden debe ser mayor o igual a 1.'
    return
  }
  if (
    autorForm.value.porcentajeParticipacion < 0 ||
    autorForm.value.porcentajeParticipacion > 100
  ) {
    errorMsg.value = 'El porcentaje debe estar entre 0 y 100.'
    return
  }
  try {
    const token = localStorage.getItem('jwt')
    if (editando.value) {
      await api.put(
        `/AutoresPublicacion/${autorForm.value.id}`,
        {
          Id: autorForm.value.id,
          PublicacionId: autorForm.value.publicacionId,
          ProfesorId: autorForm.value.profesorId,
          OrdenAutor: autorForm.value.ordenAutor,
          PorcentajeParticipacion: autorForm.value.porcentajeParticipacion,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      successMsg.value = 'Autor actualizado correctamente.'
    } else {
      await api.post(
        '/AutoresPublicacion',
        {
          PublicacionId: autorForm.value.publicacionId,
          ProfesorId: autorForm.value.profesorId,
          OrdenAutor: autorForm.value.ordenAutor,
          PorcentajeParticipacion: autorForm.value.porcentajeParticipacion,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      successMsg.value = 'Autor creado correctamente.'
    }
    showModal.value = false
    await cargarAutores()
  } catch (error) {
    errorMsg.value = error?.response?.data?.message || error.message || 'Error al guardar autor.'
    console.error('Error al guardar autor:', error)
  }
}

async function cargarAutores() {
  try {
    const token = localStorage.getItem('jwt')
    const response = await api.get('/AutoresPublicacion', {
      headers: { Authorization: `Bearer ${token}` },
    })
    // Mapear para mostrar nombre de profesor y título de publicación
    autores.value = response.data.map((a) => {
      const publicacion = publicacionesOptions.value.find(
        (p) => p.publicacionId === a.publicacionId,
      )
      const profesor = profesoresOptions.value.find((prof) => prof.profesorId === a.profesorId)
      return {
        ...a,
        publicacion: publicacion ? publicacion.titulo : a.publicacionId,
        profesor: profesor ? profesor.nombreCompleto : a.profesorId,
      }
    })
  } catch (error) {
    autores.value = []
    errorMsg.value = error?.response?.data?.message || error.message || 'Error al obtener autores.'
    console.error('Error al obtener autores:', error)
  }
}

async function cargarPublicaciones() {
  try {
    const token = localStorage.getItem('jwt')
    const response = await api.get('/Publicaciones', {
      headers: { Authorization: `Bearer ${token}` },
    })
    publicacionesOptions.value = response.data.map((p) => ({
      ...p,
      titulo: p.titulo || `Publicación #${p.publicacionId}`,
    }))
  } catch {
    publicacionesOptions.value = []
  }
}

async function cargarProfesores() {
  try {
    const token = localStorage.getItem('jwt')
    const response = await api.get('/Profesores', {
      headers: { Authorization: `Bearer ${token}` },
    })
    profesoresOptions.value = response.data.map((p) => ({
      ...p,
      nombreCompleto: `${p.nombre || ''} ${p.apellido || ''}`.trim() || `Profesor #${p.profesorId}`,
    }))
  } catch {
    profesoresOptions.value = []
  }
}

onMounted(() => {
  cargarPublicaciones()
  cargarProfesores()
  cargarAutores()
})
</script>
