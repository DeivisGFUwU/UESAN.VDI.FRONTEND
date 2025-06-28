<template>
  <q-page class="crear-page">
    <div class="crear-container">
      <h1 class="titulo">Bienvenido a Crear y Listar Publicaciones</h1>
      <p class="subtitulo">Aquí podrás registrar y visualizar tus publicaciones fácilmente.</p>

      <!-- Área futura para formulario o lista -->
      <div class="contenido-temporal">
        <!-- Espacio reservado -->
        <q-icon name="book" size="80px" color="white" />
        <p class="text-center text-white q-mt-md">Contenido próximo...</p>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'CrearListarPublicacion',
}
</script>

<style scoped>
.crear-page {
  background-color: #000;
  height: 100%;
  padding: 40px;
  color: white;
}

.crear-container {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.titulo {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
  color: white;
}

.subtitulo {
  font-size: 16px;
  margin-bottom: 30px;
  color: #ccc;
}

.contenido-temporal {
  padding: 40px;
  border: 2px dashed #888;
  border-radius: 12px;
}
</style>
