<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Gestión de Usuarios</div>
    <div class="row q-mb-md items-center">
      <q-btn color="primary" label="Nuevo Usuario" class="q-mr-md" @click="abrirModalCrear" />
    </div>
    <q-table
      :rows="usuarios"
      :columns="columns"
      row-key="usuarioId"
      flat
      bordered
      :pagination="{ rowsPerPage: 10 }"
    >
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

    <!-- Modal para crear/editar usuario -->
    <q-dialog v-model="showModal">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">{{ editando ? 'Editar' : 'Nuevo' }} Usuario</div>
          <q-input v-model="usuarioForm.nombre" label="Nombre" dense class="q-mb-sm" />
          <q-input v-model="usuarioForm.apellido" label="Apellido" dense class="q-mb-sm" />
          <q-input v-model="usuarioForm.correo" label="Correo" dense class="q-mb-sm" type="email" />
          <q-select
            v-model="usuarioForm.roleId"
            :options="rolesOptions"
            option-label="label"
            option-value="value"
            label="Rol"
            dense
            class="q-mb-sm"
            emit-value
            map-options
          />
          <q-input
            v-if="!editando"
            v-model="usuarioForm.password"
            label="Contraseña"
            dense
            class="q-mb-sm"
            type="password"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="negative" v-close-popup />
          <q-btn
            flat
            :label="editando ? 'Guardar' : 'Crear'"
            color="primary"
            @click="guardarUsuario"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'

const usuarios = ref([])
const errorMsg = ref('')
const successMsg = ref('')
const showModal = ref(false)
const editando = ref(false)
const usuarioForm = ref({
  usuarioId: null,
  nombre: '',
  apellido: '',
  correo: '',
  roleId: null,
  password: '',
})

const rolesOptions = [
  { label: 'Administrador', value: 1 },
  { label: 'Profesor', value: 2 },
  { label: 'Usuario', value: 3 },
]

const columns = [
  { name: 'usuarioId', label: 'ID', field: 'usuarioId', align: 'left' },
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left' },
  { name: 'apellido', label: 'Apellido', field: 'apellido', align: 'left' },
  { name: 'correo', label: 'Correo', field: 'correo', align: 'left' },
  {
    name: 'roleId',
    label: 'Rol',
    field: 'roleId',
    align: 'left',
    format: (val) => rolesOptions.find((r) => r.value === val)?.label || val,
  },
  {
    name: 'correoVerificado',
    label: 'Verificado',
    field: 'correoVerificado',
    align: 'left',
    format: (val) => (val ? 'Sí' : 'No'),
  },
  { name: 'acciones', label: 'Acciones', field: 'acciones', align: 'center' },
]

function abrirModalCrear() {
  editando.value = false
  usuarioForm.value = {
    usuarioId: null,
    nombre: '',
    apellido: '',
    correo: '',
    roleId: null,
    password: '',
  }
  showModal.value = true
}

function onEdit(row) {
  editando.value = true
  usuarioForm.value = {
    usuarioId: row.usuarioId,
    nombre: row.nombre,
    apellido: row.apellido,
    correo: row.correo,
    roleId: row.roleId,
    password: '', // No se muestra ni edita la contraseña aquí
  }
  showModal.value = true
}

async function onDelete(row) {
  if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const token = localStorage.getItem('jwt')
    await api.delete(`/api/Usuarios/${row.usuarioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    successMsg.value = 'Usuario eliminado correctamente.'
    await cargarUsuarios()
  } catch (error) {
    errorMsg.value = error?.response?.data?.message || error.message || 'Error al eliminar usuario.'
    console.error('Error al eliminar usuario:', error)
  }
}

async function guardarUsuario() {
  errorMsg.value = ''
  successMsg.value = ''
  try {
    const token = localStorage.getItem('jwt')
    if (editando.value) {
      await api.put(
        `/api/Usuarios/${usuarioForm.value.usuarioId}`,
        {
          Nombre: usuarioForm.value.nombre,
          Apellido: usuarioForm.value.apellido,
          Correo: usuarioForm.value.correo,
          RoleId: usuarioForm.value.roleId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      successMsg.value = 'Usuario actualizado correctamente.'
    } else {
      await api.post(
        '/api/Usuarios',
        {
          Nombre: usuarioForm.value.nombre,
          Apellido: usuarioForm.value.apellido,
          Correo: usuarioForm.value.correo,
          RoleId: usuarioForm.value.roleId,
          Password: usuarioForm.value.password,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      successMsg.value = 'Usuario creado correctamente.'
    }
    showModal.value = false
    await cargarUsuarios()
  } catch (error) {
    errorMsg.value = error?.response?.data?.message || error.message || 'Error al guardar usuario.'
    console.error('Error al guardar usuario:', error)
  }
}

async function cargarUsuarios() {
  try {
    const token = localStorage.getItem('jwt')
    const response = await api.get('/api/Usuarios', {
      headers: { Authorization: `Bearer ${token}` },
    })
    usuarios.value = response.data
  } catch (error) {
    usuarios.value = []
    errorMsg.value = error?.response?.data?.message || error.message || 'Error al obtener usuarios.'
    console.error('Error al obtener usuarios:', error)
  }
}

onMounted(cargarUsuarios)
</script>
