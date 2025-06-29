<template>
  <q-page class="q-pa-md">
    <div class="text-h5 q-mb-md">Dashboard Profesor</div>
    <q-list bordered separator>
      <q-item clickable v-ripple to="/profesor/proyectos">
        <q-item-section avatar><q-icon name="work" /></q-item-section>
        <q-item-section>Proyectos</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/profesor/publicaciones">
        <q-item-section avatar><q-icon name="article" /></q-item-section>
        <q-item-section>Publicaciones</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/profesor/formularios">
        <q-item-section avatar><q-icon name="assignment" /></q-item-section>
        <q-item-section>Formularios de Investigación</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/profesor/lineas">
        <q-item-section avatar><q-icon name="timeline" /></q-item-section>
        <q-item-section>Líneas de Investigación</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/profesor/revistas">
        <q-item-section avatar><q-icon name="menu_book" /></q-item-section>
        <q-item-section>Revistas</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/profesor/chat">
        <q-item-section avatar><q-icon name="chat" /></q-item-section>
        <q-item-section>Chat</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/profesor/perfil">
        <q-item-section avatar><q-icon name="person" /></q-item-section>
        <q-item-section>Mi Perfil</q-item-section>
      </q-item>
    </q-list>
    <router-view />
  </q-page>
</template>

<script setup>
// Aquí puedes agregar lógica si es necesario
</script>

<style scoped>
.q-list {
  max-width: 500px;
  margin: auto;
}
</style>
