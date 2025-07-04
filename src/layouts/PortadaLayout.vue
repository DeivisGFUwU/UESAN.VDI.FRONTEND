<template>
  <q-layout class="main-layout" view="hHh lpR fFf">
    <!-- Cabecera con el logo y acciones -->
    <q-header elevated class="header">
      <q-toolbar>
        <q-toolbar-title>
          <img src="/icons/Logo_VDI.png" alt="Logo ESAN VDI" height="40" />
          <span class="text-white">BIENVENIDO!</span>
        </q-toolbar-title>
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
      </q-toolbar>
    </q-header>
    <!-- Carrusel extraído a componente -->
    <main-carousel
      :image-urls="imageUrls"
      :current-image="currentImage"
      @prev="prevImage"
      @next="nextImage"
    />
  </q-layout>
</template>

<script>
import MainCarousel from 'components/common/MainCarousel.vue'
export default {
  name: 'PortadaLayout',
  components: { MainCarousel },
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
.q-toolbar-title img {
  margin-right: 10px;
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
