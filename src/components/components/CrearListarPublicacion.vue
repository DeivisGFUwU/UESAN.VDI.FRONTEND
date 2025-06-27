<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="bg-page q-pa-md">
        <!-- Título -->
        <div class="titulo-container">
          <h2 class="text-h4">Bienvenido - Crear y Listar Publicación</h2>
        </div>

        <!-- Formulario -->
        <q-form @submit.prevent="registrarRevista" class="formulario">
          <q-input
            filled
            v-model="form.nombre"
            label="Nombre de la Revista"
            class="q-mb-md"
            color="white"
            label-color="white"
            lazy-rules
            :rules="[(val) => !!val || 'Campo obligatorio']"
          />

          <q-input
            filled
            v-model="form.issn"
            label="Código ISSN"
            class="q-mb-md"
            color="white"
            label-color="white"
            lazy-rules
            :rules="[(val) => !!val || 'Campo obligatorio']"
          />

          <q-input
            filled
            v-model="form.categoria"
            label="Categoría o Área Temática"
            class="q-mb-md"
            color="white"
            label-color="white"
            lazy-rules
            :rules="[(val) => !!val || 'Campo obligatorio']"
          />

          <q-select
            filled
            v-model="form.estado"
            label="Estado"
            :options="['Activa', 'Inactiva']"
            class="q-mb-md"
            color="white"
            label-color="white"
            emit-value
            map-options
          />

          <div class="q-mt-lg">
            <q-btn label="Registrar Revista" color="primary" type="submit" />
          </div>

          <!-- Mensajes -->
          <div class="q-mt-md" v-if="mensaje" :class="mensajeColor">
            {{ mensaje }}
          </div>
        </q-form>

        <!-- Lista cerrada -->
        <div class="q-mt-xl text-white">
          <h4>Revistas Registradas</h4>
          <q-list bordered class="bg-grey-9 text-white">
            <q-item v-for="(revista, index) in revistas" :key="index">
              <q-item-section>
                {{ revista.nombre }} - {{ revista.issn }} ({{ revista.estado }})
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: 'CrearListarPublicacion',
  data() {
    return {
      form: {
        nombre: '',
        issn: '',
        categoria: '',
        estado: 'Activa',
      },
      revistas: [],
      mensaje: '',
      mensajeColor: '',
    }
  },
  methods: {
    registrarRevista() {
      const yaExiste = this.revistas.some((r) => r.issn === this.form.issn)

      if (yaExiste) {
        this.mensaje = 'Error: El ISSN ya está registrado.'
        this.mensajeColor = 'text-red'
        return
      }

      this.revistas.push({ ...this.form })
      this.mensaje = 'Revista registrada exitosamente.'
      this.mensajeColor = 'text-green'

      this.form = {
        nombre: '',
        issn: '',
        categoria: '',
        estado: 'Activa',
      }
    },
  },
}
</script>

<style scoped>
.bg-page {
  background-image: url('/icons/Portada.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  min-height: 100vh;
  color: white;
}

.titulo-container {
  background-color: rgba(0, 0, 0, 0.7);
  padding: 16px;
  border-radius: 8px;
  max-width: 600px;
  margin-bottom: 24px;
}

.formulario {
  background-color: rgba(0, 0, 0, 0.6);
  padding: 24px;
  border-radius: 10px;
  max-width: 600px;
}
</style>
