<template>
  <q-layout view="hHh lpR fFf">
    <!-- Cabecera con el logo en la parte izquierda y el botón de cerrar sesión -->
    <q-header elevated class="header">
      <q-toolbar>
        <q-toolbar-title>
          <img src="/icons/Logo_VDI.png" alt="Logo ESAN VDI" height="40" />
          <span class="text-white">BIENVENIDO!</span>
        </q-toolbar-title>
        <q-btn flat label="Cerrar Sesión" color="white" @click="cerrarSesion" class="small-btn" />
      </q-toolbar>
    </q-header>

    <!-- Carrusel de imágenes -->
    <div class="carousel-container">
      <q-img
        :src="imageUrls[currentImage]"
        class="carousel-image"
        :alt="'Imagen ' + (currentImage + 1)"
        :key="currentImage"
        style="max-height: 671px; width: 100%; object-fit: cover; margin-top: 20px"
      />
      <!-- Botones de cambio de imagen -->
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

    <!-- Menú desplegable -->
    <q-page-container>
      <q-page class="q-pa-md">
        <!-- Botón para Crear y Listar Publicaciones -->
        <q-btn
          label="Crear y Listar Publicaciones"
          color="secondary"
          class="q-mt-md"
          @click="irACrearListarPublicacion"
        />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MenuLibre',
  data() {
    return {
      openItems: {},
      imageUrls: ['/icons/Portada.png', '/icons/Registro.png'],
      currentImage: 0,
    }
  },
  methods: {
    // Cambia el estado de la expansión para cada sección
    toggleDropdown(section) {
      this.$set(this.openItems, section, !this.openItems[section])
    },

    // Verifica si una sección está abierta
    isOpen(section) {
      return this.openItems[section] || false
    },

    // Función para ir a la imagen anterior
    prevImage() {
      this.currentImage = (this.currentImage - 1 + this.imageUrls.length) % this.imageUrls.length
    },

    // Función para ir a la imagen siguiente
    nextImage() {
      this.currentImage = (this.currentImage + 1) % this.imageUrls.length
    },

    // Método para cerrar sesión y redirigir al login
    cerrarSesion() {
      localStorage.removeItem('jwt')
      this.$router.push('/login')
    },

    // Redirige a la página de Crear y Listar Publicaciones
    irACrearListarPublicacion() {
      this.$router.push('/crear-listar-publicacion')
    },
  },
}
</script>

<style scoped>
.menu-libre {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #000000; /* Fondo negro */
}

.header {
  background-color: #1a1a1a;
  color: white;
}

.q-header {
  padding: 10px;
}

.q-toolbar-title img {
  margin-right: 10px;
}

.q-btn {
  margin-left: auto;
}

/* Estilo del carrusel de imágenes */
.carousel-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-top: 20px;
}

/* Botones para cambiar las imágenes */
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

/* Estilo de la imagen del carrusel */
.carousel-image {
  width: 100%;
  height: 671px; /* Altura ajustada a 671px */
  object-fit: cover;
  border-radius: 10px;
}

/* Estilo de los botones */
.q-btn {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 24px;
}
</style>
