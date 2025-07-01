<template>
  <q-page class="q-pa-md">
    <div class="text-h6">Revistas</div>
    <div class="q-mb-md">Aquí podrás consultar las revistas disponibles.</div>
    <q-input
      filled
      v-model="issnFiltro"
      label="Buscar por ISSN"
      class="q-mb-md"
      debounce="400"
      clearable
      @update:model-value="filtrarRevistas"
    />
    <q-table
      :rows="revistasFiltradas"
      :columns="columns"
      row-key="id"
      flat
      bordered
      :loading="cargando"
      no-data-label="No se encontraron revistas"
    />
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import axios from 'axios'
import { useAuthStore } from 'src/stores/auth'

const $q = useQuasar()
const authStore = useAuthStore()
const revistas = ref([])
const cargando = ref(false)
const issnFiltro = ref('')

const columns = [
  { name: 'issn', label: 'ISSN', field: 'issn', align: 'left', sortable: true },
  { name: 'titulo', label: 'Título', field: 'titulo', align: 'left', sortable: true },
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
    const token = authStore.token
    const res = await axios.get('/api/revistas/activas', {
      headers: { Authorization: `Bearer ${token}` },
    })
    // Normalización de campos según respuesta del backend
    revistas.value = Array.isArray(res.data)
      ? res.data.map((r) => ({
          id: r.id || r.revistasId || r.RevistaId || r.ISSN,
          issn: r.issn || r.ISSN,
          titulo: r.titulo || r.Titulo,
        }))
      : []
  } catch (e) {
    $q.notify({ type: 'negative', message: 'Error al cargar revistas' })
  } finally {
    cargando.value = false
  }
}

onMounted(cargarRevistas)
</script>
