<template>
  <q-page class="q-pa-md">
    <div class="text-h6 q-mb-md">Mis Formularios de Investigación</div>
    <div class="q-mb-md">
      <BaseButton color="primary" label="Nuevo Formulario" disabled />
    </div>
    <BaseTable
      :rows="formularios"
      :columns="columns"
      rowKey="formularioId"
      flat
      bordered
      :pagination="{ rowsPerPage: 10 }"
    />
    <q-banner v-if="errorMsg" class="bg-red text-white q-mt-md">
      {{ errorMsg }}
    </q-banner>
    <BackButton class="back-btn-bottom" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import BaseButton from 'src/components/common/BaseButton.vue'
import BaseTable from 'src/components/common/BaseTable.vue'
import BackButton from 'src/components/common/BackButton.vue'

const formularios = ref([])
const errorMsg = ref('')

const columns = [
  {
    name: 'formularioId',
    label: 'ID',
    field: (row) => row.formularioId || row.FormularioId,
    align: 'left',
  },
  {
    name: 'tipoFormulario',
    label: 'Tipo',
    field: (row) => row.tipoFormulario || row.TipoFormulario,
    align: 'left',
  },
  { name: 'resumen', label: 'Resumen', field: (row) => row.resumen || row.Resumen, align: 'left' },
]

async function cargarFormularios() {
  try {
    const token = localStorage.getItem('jwt')
    const response = await api.get('/FormulariosInvestigacion', {
      headers: { Authorization: `Bearer ${token}` },
    })
    let data = []
    if (Array.isArray(response.data)) {
      data = response.data
    } else if (Array.isArray(response.data.formularios)) {
      data = response.data.formularios
    } else if (Array.isArray(response.data.data)) {
      data = response.data.data
    }
    formularios.value = data.map((f) => ({
      formularioId: f.formularioId || f.FormularioId,
      tipoFormulario: f.tipoFormulario || f.TipoFormulario,
      resumen: f.resumen || f.Resumen,
    }))
    errorMsg.value = ''
  } catch (error) {
    errorMsg.value =
      error?.response?.data?.message || error.message || 'Error al obtener formularios'
    console.error('Error al obtener formularios:', error)
  }
}

onMounted(cargarFormularios)
</script>

<style scoped>
.back-btn-bottom {
  position: fixed;
  left: 32px;
  bottom: 32px;
  z-index: 20;
}
</style>
