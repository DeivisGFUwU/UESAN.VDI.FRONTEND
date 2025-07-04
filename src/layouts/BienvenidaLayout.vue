<template>
  <q-layout class="main-layout" view="hHh lpR fFf">
    <!-- Cabecera con el logo -->
    <q-header elevated class="header">
      <q-toolbar>
        <q-toolbar-title>
          <img src="/icons/Logo_VDI.png" alt="Logo ESAN VDI" height="40" />
          <span class="text-white">BIENVENIDO!</span>
        </q-toolbar-title>
      </q-toolbar>
      <!-- Botones de acción en la cabecera -->
      <div class="header-actions">
        <q-btn
          icon="login"
          color="primary"
          round
          @click="irALogin"
          class="btn-login"
          aria-label="Logeo"
        />
        <q-btn
          label="Postular a Investigación"
          color="secondary"
          class="btn-ir-publicaciones"
          @click="irARegistro"
        />
      </div>
    </q-header>

    <!-- Carrusel de imágenes -->
    <div class="carousel-container">
      <q-img
        :src="imageUrls[currentImage]"
        class="carousel-image"
        :alt="'Imagen ' + (currentImage + 1)"
        :key="currentImage"
      />
      <div class="carousel-buttons">
        <q-btn
          icon="keyboard_arrow_left"
          color="white"
          round
          @click="prevImage"
          class="carousel-btn-left"
        />
        <q-btn
          icon="keyboard_arrow_right"
          color="white"
          round
          @click="nextImage"
          class="carousel-btn-right"
        />
      </div>
    </div>
  </q-layout>
</template>

<script>
export default {
  name: 'BienvenidaLayout',
  data() {
    return {
      imageUrls: ['/icons/Portada.png', '/icons/Registro.png'],
      currentImage: 0,
    }
  },
  methods: {
    prevImage() {
      this.currentImage = (this.currentImage - 1 + this.imageUrls.length) % this.imageUrls.length
    },
    nextImage() {
      this.currentImage = (this.currentImage + 1) % this.imageUrls.length
    },
    irALogin() {
      this.$router.push('/login')
    },
    irARegistro() {
      this.$router.push('/register')
    },
  },
}
</script>

<style scoped>
.main-layout {
  background-color: #000;
  min-height: 100vh;
}
.header {
  background-color: #1a1a1a;
  color: white;
  padding: 10px;
}
.header-actions {
  position: absolute;
  top: 10px;
  right: 20px;
  display: flex;
  gap: 12px;
  align-items: center;
  z-index: 10;
}
.q-toolbar-title img {
  margin-right: 10px;
}
.carousel-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-top: 20px;
}
.carousel-image {
  width: 100%;
  height: 671px;
  object-fit: cover;
  border-radius: 10px;
}
.carousel-buttons {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
}
.carousel-btn-left {
  position: absolute;
  left: 10px;
}
.carousel-btn-right {
  position: absolute;
  right: 10px;
}
.btn-ir-publicaciones {
  font-size: 18px;
  padding: 10px 20px;
  background-color: #b80000;
  color: white;
}
.btn-login {
  background-color: #1976d2;
  color: white;
}
</style>
