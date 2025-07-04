<template>
  <q-layout
    :class="{ 'main-layout': mostrarCarrusel, 'default-layout': !mostrarCarrusel }"
    view="hHh lpR fFf"
  >
    <!-- Cabecera con el logo y botón de cerrar sesión -->
    <q-header v-if="mostrarHeader" elevated class="header">
      <q-toolbar>
        <q-toolbar-title>
          <img src="/icons/Logo_VDI.png" alt="Logo ESAN VDI" height="40" />
          <span class="text-white">BIENVENIDO!</span>
        </q-toolbar-title>
        <q-btn flat label="Cerrar Sesión" color="white" @click="cerrarSesion" class="small-btn" />
      </q-toolbar>
    </q-header>

    <!-- Carrusel de imágenes solo en la página principal -->
    <div v-if="mostrarCarrusel" class="carousel-container">
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

    <!-- Aquí se mostrará el contenido de cada página hija -->
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MainLayout',
  computed: {
    mostrarCarrusel() {
      // Solo mostrar el carrusel en la página principal (ruta exacta '/')
      return this.$route.path === '/'
    },
    mostrarHeader() {
      // No mostrar el header en cualquier ruta de admin o profesor
      const path = this.$route.path
      return !(path.startsWith('/admin') || path.startsWith('/profesor'))
    },
  },
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
    cerrarSesion() {
      localStorage.removeItem('jwt')
      this.$router.push('/login')
    },
    irACrearListarPublicacion() {
      console.log('Redirigiendo...')
      this.$router.push('/crear-listar-publicacion')
    },
  },
}
</script>

<style scoped>
.main-layout {
  background-color: #000; /* fondo negro solo en la principal */
  min-height: 100vh;
}

.default-layout {
  background-color: #fff; /* fondo blanco para otras páginas */
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
</style>
