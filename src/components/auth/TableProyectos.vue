<template>
  <q-table :rows="rows" :columns="columns" row-key="id" />
</template>

<script setup>
import { ref } from 'vue'

const rows = ref([])
const columns = [
  { name: 'id', label: 'ID', field: 'id', align: 'left' },
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left' },
  // Agrega más columnas según tu modelo
]
// Aquí puedes cargar los proyectos desde el backend
</script>
