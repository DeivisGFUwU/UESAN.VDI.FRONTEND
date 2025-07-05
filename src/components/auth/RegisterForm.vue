<template>
  <div class="register-container">
    <q-card
      class="q-pa-xl q-mx-auto q-mt-xl q-mb-xl shadow-10 register-card"
      style="min-width: 380px; max-width: 480px; background: rgba(255, 255, 255, 0.9)"
    >
      <q-form @submit.prevent="registrarUsuario">
        <p class="text-center q-mb-md text-4xl font-bold text-red-600">Crea tu cuenta</p>

        <!-- Campos del formulario -->
        <q-input filled v-model="nombre" label="Nombre" required class="q-mb-md input-field" />
        <q-input filled v-model="apellido" label="Apellido" required class="q-mb-md input-field" />
        <q-input
          filled
          v-model="correo"
          label="Correo"
          type="email"
          required
          class="q-mb-md input-field"
          :rules="[
            (val) => !!val || 'El correo es obligatorio',
            (val) => /.+@.+\..+/.test(val) || 'Ingresa un correo válido',
          ]"
        />
        <q-input
          filled
          v-model="password"
          label="Contraseña"
          type="password"
          required
          class="q-mb-md input-field"
        />
        <q-input
          filled
          v-model="confirmPassword"
          label="Confirmar contraseña"
          type="password"
          required
          class="q-mb-md input-field"
          :error="passwordError"
          :error-message="passwordErrorMsg"
        />

        <!-- Botón de registro -->
        <q-btn
          label="Registrarse"
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
      nombre: '',
      apellido: '',
      correo: '',
      password: '',
      confirmPassword: '',
      passwordError: false,
      passwordErrorMsg: '',
    }
  },
  methods: {
    registrarUsuario() {
      this.passwordError = false
      this.passwordErrorMsg = ''

      // Validación de contraseñas
      if (this.password !== this.confirmPassword) {
        this.passwordError = true
        this.passwordErrorMsg = 'Las contraseñas no coinciden.'
        return
      }

      const endpointURL = '/usuarios/registrar' // Ajusta la URL según tu backend
      const user = {
        nombre: this.nombre,
        apellido: this.apellido,
        correo: this.correo,
        password: this.password,
      }

      this.$api
        .post(endpointURL, user)
        .then(() => {
          this.$q.notify({
            type: 'positive',
            message: 'Nuevo usuario registrado',
            timeout: 1500,
          })
          setTimeout(() => {
            this.$router.push('/login')
          }, 1500)
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
/* Estilo de la imagen de fondo */
.register-container {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-image: url('/icons/Registro.png'); /* Ajusta la ruta de la imagen */
  background-size: cover;
  background-position: center;
  opacity: 0.85;
  z-index: -1;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Estilos adicionales para la tarjeta de formulario */
.register-card {
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

/* Estilo del botón de registro */
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

/* Validación de contraseñas */
:deep(.q-field--focused .q-field__control:after) {
  border-bottom: 2px solid #b80000 !important;
}

:deep(.q-field__label--active),
:deep(.q-field--focused .q-field__label) {
  color: #b80000 !important;
}
</style>
