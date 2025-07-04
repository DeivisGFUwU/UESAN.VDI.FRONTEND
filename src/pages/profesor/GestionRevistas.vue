<template>
  <q-page class="q-pa-md">
    <div class="text-h6">Revistas Académicas</div>
    <div class="q-mb-md">Aquí podrás consultar las revistas disponibles.</div>
    <BaseInput
      v-model="issnFiltro"
      label="Buscar por ISSN"
      dense
      customClass="q-mb-md"
      clearable
      @update:model-value="filtrarRevistas"
    />
    <BaseTable
      :rows="revistasFiltradas"
      :columns="columns"
      rowKey="issn"
      flat
      bordered
      :loading="cargando"
      no-data-label="No se encontraron revistas"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { api } from 'src/boot/axios'
import BaseInput from 'src/components/common/BaseInput.vue'
import BaseTable from 'src/components/common/BaseTable.vue'

const revistas = ref([])
const cargando = ref(false)
const issnFiltro = ref('')

const columns = [
  { name: 'issn', label: 'ISSN', field: 'issn', align: 'left', sortable: true },
  { name: 'titulo', label: 'Título', field: 'titulo', align: 'left', sortable: true },
  { name: 'cuartil', label: 'Cuartil', field: 'cuartil', align: 'left', sortable: true },
  { name: 'categoria', label: 'Categoría', field: 'categoria', align: 'left', sortable: true },
  { name: 'pais', label: 'País', field: 'pais', align: 'left', sortable: true },
]

const revistasFiltradas = computed(() => {
  if (!issnFiltro.value) return revistas.value
  return revistas.value.filter(
    (r) => r.issn && r.issn.toLowerCase().includes(issnFiltro.value.toLowerCase()),
  )
})

function filtrarRevistas() {
  // La lógica está en el computed, esto es solo para el debounce
}

async function cargarRevistas() {
  cargando.value = true
  try {
    const token = localStorage.getItem('jwt')
    // El endpoint correcto es /api/Revistas
    const res = await api.get('/Revistas', {
      headers: { Authorization: `Bearer ${token}` },
    })
    revistas.value = Array.isArray(res.data) ? res.data : res.data?.revistas || []
  } catch {
    revistas.value = []
  } finally {
    cargando.value = false
  }
}

onMounted(cargarRevistas)
</script>
