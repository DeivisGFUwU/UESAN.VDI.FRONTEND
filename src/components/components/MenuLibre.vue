<template>
  <q-layout view="hHh lpR fFf">
    <!-- Cabecera con el logo y el texto en la parte izquierda, y el botón de cerrar sesión -->
    <q-header elevated class="header">
      <q-toolbar>
        <q-toolbar-title class="title">
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
        <div class="user-section">
          <h3 class="text-white">Hola, Fabrissio Keith Fasabi Rivera</h3>
        </div>

        <!-- Menú desplegable: Recursos -->
        <q-item clickable @click="toggleDropdown('recursos')">
          <q-item-section>Recursos</q-item-section>
          <q-item-side :arrow="isOpen('recursos') ? 'down' : 'right'" />
        </q-item>
        <q-expansion-item v-if="isOpen('recursos')" label="Recursos para el Investigador">
          <q-item clickable><q-item-section>1</q-item-section></q-item>
          <q-item clickable><q-item-section>2</q-item-section></q-item>
          <q-item clickable><q-item-section>3</q-item-section></q-item>
        </q-expansion-item>

        <!-- Menú desplegable: Proyectos -->
        <q-item clickable @click="toggleDropdown('proyectos')">
          <q-item-section>Proyectos</q-item-section>
          <q-item-side :arrow="isOpen('proyectos') ? 'down' : 'right'" />
        </q-item>
        <q-expansion-item v-if="isOpen('proyectos')" label="Proyectos en Desarrollo">
          <q-item clickable><q-item-section>1</q-item-section></q-item>
          <q-item clickable><q-item-section>2</q-item-section></q-item>
          <q-item clickable><q-item-section>3</q-item-section></q-item>
        </q-expansion-item>

        <!-- Menú desplegable: Publicaciones -->
        <q-item clickable @click="toggleDropdown('publicaciones')">
          <q-item-section>Publicaciones</q-item-section>
          <q-item-side :arrow="isOpen('publicaciones') ? 'down' : 'right'" />
        </q-item>
        <q-expansion-item v-if="isOpen('publicaciones')" label="Publicaciones Recientes">
          <q-item clickable><q-item-section>1</q-item-section></q-item>
          <q-item clickable><q-item-section>2</q-item-section></q-item>
          <q-item clickable><q-item-section>3</q-item-section></q-item>
        </q-expansion-item>

        <!-- Menú desplegable: Políticas Institucionales -->
        <q-item clickable @click="toggleDropdown('politicas')">
          <q-item-section>Políticas Institucionales</q-item-section>
          <q-item-side :arrow="isOpen('politicas') ? 'down' : 'right'" />
        </q-item>
        <q-expansion-item v-if="isOpen('politicas')" label="Políticas Institucionales">
          <q-item clickable><q-item-section>1</q-item-section></q-item>
          <q-item clickable><q-item-section>2</q-item-section></q-item>
          <q-item clickable><q-item-section>3</q-item-section></q-item>
        </q-expansion-item>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'MenuLibre',
  data() {
    return {
      openItems: {}, // Aquí guardamos el estado de los elementos abiertos
      imageUrls: ['/icons/Portada.png', '/icons/Registro.png'], // Las imágenes del carrusel
      currentImage: 0, // Índice de la imagen actual
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
  },
}
</script>

<style scoped>
.menu-libre {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #2d2d2d; /* Fondo oscuro */
}

.header {
  background-color: #1a1a1a; /* Fondo más oscuro para la cabecera */
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

.user-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  color: white;
}

h3 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
}

.q-btn {
  width: 200px;
}

.menu-section {
  margin-top: 20px;
}

.q-item-section {
  font-size: 16px;
}

.q-item-side {
  margin-left: auto;
}

/* Estilos para el carrusel de imágenes */
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
  background-color: rgba(0, 0, 0, 0.5); /* Fondo semi-transparente */
  color: white;
  font-size: 24px;
}
</style>
