<template>
  <q-page class="flex flex-center">
    <div>
      <div class="text-h5 q-mb-md">Panel de Administración</div>
      <q-list bordered separator>
        <q-item clickable v-ripple to="/admin/Gestion-Proyectos">
          <q-item-section>Gestión de Proyectos</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/admin/Asignacion-Proyectos">
          <q-item-section>Asignación de Proyectos</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/admin/Gestion-profesores">
          <q-item-section>Gestión de Profesores</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/admin/Gestion-usuarios">
          <q-item-section>Gestión de Usuarios</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/admin/Gestion-publicaciones">
          <q-item-section>Gestión de Publicaciones</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/admin/Gestion-revistas">
          <q-item-section>Gestión de Revistas</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/admin/Gestion-formularios-investigacion">
          <q-item-section>Gestión de Formularios de Investigación</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/admin/Gestion-lineas-investigacion">
          <q-item-section>Gestión de Líneas de Investigación</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/admin/Gestion-autores-publicacion">
          <q-item-section>Gestión de Autores de Publicaciones</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/admin/Chat-interno">
          <q-item-section>Chat Interno</q-item-section>
        </q-item>
      </q-list>
      <div class="q-mt-md">Bienvenido, admin.</div>
      <router-view class="q-mt-lg" />
    </div>
  </q-page>
</template>

<script setup>
// Aquí puedes agregar lógica reactiva si lo necesitas
</script>
