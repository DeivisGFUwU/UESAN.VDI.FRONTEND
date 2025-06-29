<template>
  <q-page class="flex flex-center">
    <div>
      <div class="text-h5 q-mb-md">Panel de Administración</div>
      <q-list bordered separator>
        <q-item clickable v-ripple to="/admin/gestion-proyectos">
          <q-item-section>Gestión de Proyectos</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/admin/asignacion-proyectos">
          <q-item-section>Asignación de Proyectos</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/admin/gestion-profesores">
          <q-item-section>Gestión de Profesores</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/admin/gestion-usuarios">
          <q-item-section>Gestión de Usuarios</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/admin/gestion-publicaciones">
          <q-item-section>Gestión de Publicaciones</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/admin/gestion-revistas">
          <q-item-section>Gestión de Revistas</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/admin/gestion-formularios-investigacion">
          <q-item-section>Gestión de Formularios de Investigación</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/admin/gestion-lineas-investigacion">
          <q-item-section>Gestión de Líneas de Investigación</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/admin/gestion-autores-publicacion">
          <q-item-section>Gestión de Autores de Publicaciones</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/admin/chat-interno">
          <q-item-section>Chat Interno</q-item-section>
        </q-item>
      </q-list>
      <div class="q-mt-md">Bienvenido, admin.</div>
    </div>
  </q-page>
</template>

<script setup>
// Aquí puedes agregar lógica reactiva si lo necesitas
</script>
