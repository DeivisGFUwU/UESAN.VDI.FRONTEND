<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Gestión de Profesores</div>
    <div class="row q-mb-md items-center">
      <BaseButton
        color="primary"
        label="Nuevo Profesor"
        customClass="q-mr-md"
        @click="abrirModalCrear"
      />
    </div>
    <BaseTable
      :rows="profesores"
      :columns="columns"
      rowKey="profesorId"
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

    <!-- Modal para crear/editar profesor -->
    <q-dialog v-model="showModal">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ editando ? 'Editar' : 'Nuevo' }} Profesor</div>
          <BaseInput v-model="profesorForm.nombre" label="Nombre" dense customClass="q-mb-sm" />
          <BaseInput v-model="profesorForm.apellido" label="Apellido" dense customClass="q-mb-sm" />
          <BaseInput v-model="profesorForm.correo" label="Correo" dense customClass="q-mb-sm" />
          <BaseInput
            v-model="profesorForm.departamento"
            label="Departamento"
            dense
            customClass="q-mb-sm"
          />
          <BaseInput
            v-model="profesorForm.categoria"
            label="Categoría"
            dense
            customClass="q-mb-sm"
          />
          <BaseInput
            v-if="!editando"
            v-model="profesorForm.password"
            label="Contraseña"
            type="password"
            dense
            customClass="q-mb-sm"
          />
        </q-card-section>
        <q-card-actions align="right">
          <BaseButton flat label="Cancelar" color="negative" v-close-popup />
          <BaseButton
            flat
            :label="editando ? 'Guardar' : 'Crear'"
            color="primary"
            @click="guardarProfesor"
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

const profesores = ref([])
const errorMsg = ref('')
const successMsg = ref('')
const showModal = ref(false)
const editando = ref(false)
const profesorForm = ref({
  profesorId: null,
  nombre: '',
  apellido: '',
  correo: '',
  departamento: '',
  categoria: '',
  password: '',
})

const columns = [
  { name: 'profesorId', label: 'ID', field: 'profesorId', align: 'left' },
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left' },
  { name: 'apellido', label: 'Apellido', field: 'apellido', align: 'left' },
  { name: 'correo', label: 'Correo', field: 'correo', align: 'left' },
  { name: 'departamento', label: 'Departamento', field: 'departamento', align: 'left' },
  { name: 'categoria', label: 'Categoría', field: 'categoria', align: 'left' },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
]

function abrirModalCrear() {
  editando.value = false
  profesorForm.value = {
    profesorId: null,
    nombre: '',
    apellido: '',
    correo: '',
    departamento: '',
    categoria: '',
    password: '',
  }
  showModal.value = true
}

function onEdit(row) {
  editando.value = true
  profesorForm.value = { ...row, password: '' }
  showModal.value = true
}

async function onDelete(row) {
  if (!confirm('¿Estás seguro de que deseas eliminar este profesor?')) return
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const token = localStorage.getItem('jwt')
    await api.delete(`/Profesores/${row.profesorId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    successMsg.value = 'Profesor eliminado correctamente.'
    await cargarProfesores()
  } catch (error) {
    errorMsg.value =
      error?.response?.data?.message || error.message || 'Error al eliminar profesor.'
    console.error('Error al eliminar profesor:', error)
  }
}

async function guardarProfesor() {
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const token = localStorage.getItem('jwt')
    if (editando.value) {
      await api.put(
        `/Profesores/${profesorForm.value.profesorId}`,
        {
          ProfesorId: profesorForm.value.profesorId,
          Departamento: profesorForm.value.departamento,
          Categoria: profesorForm.value.categoria,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      successMsg.value = 'Profesor actualizado correctamente.'
    } else {
      // Crear usuario y profesor juntos
      await api.post(
        '/Profesores',
        {
          Nombre: profesorForm.value.nombre,
          Apellido: profesorForm.value.apellido,
          Correo: profesorForm.value.correo,
          Departamento: profesorForm.value.departamento,
          Categoria: profesorForm.value.categoria,
          Password: profesorForm.value.password,
          RoleId: 2, // Rol profesor
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      successMsg.value = 'Profesor creado correctamente.'
    }
    showModal.value = false
    await cargarProfesores()
  } catch (error) {
    errorMsg.value = error?.response?.data?.message || error.message || 'Error al guardar profesor.'
    console.error('Error al guardar profesor:', error)
  }
}

async function cargarProfesores() {
  try {
    const token = localStorage.getItem('jwt')
    // 1. Obtener profesores
    const response = await api.get('/Profesores', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const profesoresRaw = response.data
    // 2. Obtener usuarios
    const usuariosResp = await api.get('/usuarios', {
      headers: { Authorization: `Bearer ${token}` },
    })
    const usuarios = Array.isArray(usuariosResp.data) ? usuariosResp.data : []
    // 3. Relacionar por usuarioId
    profesores.value = profesoresRaw.map((prof) => {
      const usuario = usuarios.find((u) => u.usuarioId === prof.usuarioId)
      return {
        ...prof,
        nombre: usuario?.nombre || '',
        apellido: usuario?.apellido || '',
        correo: usuario?.correo || '',
      }
    })
  } catch (error) {
    errorMsg.value =
      error?.response?.data?.message || error.message || 'Error al obtener profesores.'
    console.error('Error al obtener profesores:', error)
  }
}

onMounted(cargarProfesores)
</script>
