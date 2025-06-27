<template>
  <div class="update-container">
    <q-card
      class="q-pa-xl q-mx-auto q-mt-xl q-mb-xl shadow-10 update-card"
      style="min-width: 380px; max-width: 480px; background: rgba(255, 255, 255, 0.9)"
    >
      <q-form @submit.prevent="recuperarClave">
        <p class="text-center q-mb-md text-2xl font-bold text-red-600">Recuperar contraseña</p>

        <!-- Campo de correo -->
        <q-input
          filled
          v-model="correo"
          label="Correo"
          type="email"
          required
          class="q-mb-md input-field"
          style="font-size: 18px; height: 50px"
          :rules="[
            (val) => !!val || 'El correo es obligatorio',
            (val) => /.+@.+\..+/.test(val) || 'Ingresa un correo válido',
          ]"
        />

        <!-- Botón de envío -->
        <q-btn
          label="Enviar instrucciones"
          type="submit"
          color="esan-primary"
          class="full-width q-mb-md btn-submit"
        />

        <!-- Enlace de inicio de sesión -->
        <div class="q-mb-sm text-center">
          <router-link to="/login" class="text-esan-primary hover:underline text-lg">
            ¿Ya tienes cuenta? Inicia sesión
          </router-link>
        </div>
      </q-form>
    </q-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      correo: '',
    }
  },
  methods: {
    recuperarClave() {
      if (!this.correo) {
        this.$q.notify({
          type: 'negative',
          message: 'El correo es obligatorio.',
        })
        return
      }
      const endpointURL = '/api/usuarios/recuperar-clave'
      const data = {
        correo: this.correo,
      }
      this.$api
        .post(endpointURL, data, {
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then(() => {
          this.$q.notify({
            type: 'positive',
            message:
              'Si el correo está registrado, una contraseña temporal ha sido enviada a tu correo electrónico.',
          })
          this.$router.push('/login')
        })
        .catch((error) => {
          let msg = 'Error de conexión.'
          if (error.response) {
            msg = error.response.data?.message || error.message || msg
          } else if (error.message) {
            msg = error.message
          }
          this.$q.notify({
            type: 'negative',
            message: msg,
          })
        })
    },
  },
}
</script>

<style scoped>
/* Asegúrate de que la imagen de fondo cubra toda la pantalla */
.update-container {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-image: url('/icons/Portada.png'); /* Ajusta la ruta de la imagen */
  background-size: cover;
  background-position: center;
  opacity: 0.85;
  z-index: -1;
  display: flex;
  justify-content: center; /* Centra el contenido horizontalmente */
  align-items: center; /* Centra el contenido verticalmente */
}

/* Estilos adicionales para la tarjeta de formulario */
.update-card {
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease-in-out;
}

/* Estilo de los campos de entrada */
.input-field {
  font-size: 18px;
  height: 50px;
}

/* Estilo del botón de recuperación */
.btn-submit {
  font-size: 18px;
  padding: 15px;
  background-color: #b80000;
  color: white;
  border-radius: 12px;
}

.q-btn:hover {
  background-color: #a60000;
}

/* Validación de campos de entrada */
:deep(.q-field--focused .q-field__control:after) {
  border-bottom: 2px solid #b80000 !important;
}

:deep(.q-field__label--active),
:deep(.q-field--focused .q-field__label) {
  color: #b80000 !important;
}
</style>
