<template>
  <div class="login-container">
    <q-card
      class="q-pa-xl q-mx-auto q-mt-xl q-mb-xl shadow-10 login-card"
      style="min-width: 380px; max-width: 450px; background: rgba(255, 255, 255, 0.9)"
    >
      <q-form @submit.prevent="iniciarSesion">
        <!-- Texto de bienvenida cambiado y con tamaño aumentado -->
        <p class="text-center q-mb-md text-4xl font-bold text-red-600">INGRESE SUS DATOS</p>

        <!-- Campo para correo -->
        <q-input filled v-model="Email" label="Correo" type="email" required class="q-mb-md" />

        <!-- Campo para la contraseña -->
        <q-input
          filled
          v-model="Password"
          :type="showPassword ? 'text' : 'password'"
          label="Contraseña"
          required
          class="q-mb-md"
        />

        <!-- Opción para mostrar u ocultar la contraseña debajo del campo de la contraseña -->
        <div class="q-mt-md text-left">
          <q-checkbox
            v-model="showPassword"
            size="sm"
            :label="showPassword ? 'Ocultar' : 'Mostrar'"
            class="text-xs p-0"
          />
        </div>

        <!-- Botón de ingreso -->
        <q-btn
          label="Ingresar"
          type="submit"
          color="esan-primary"
          class="full-width q-mb-md"
          style="background-color: #b80000"
        />

        <!-- Enlace de registro -->
        <div class="q-mb-sm text-center">
          <router-link to="/register" class="text-esan-primary hover:underline text-lg">
            ¿No tienes cuenta? Regístrate
          </router-link>
        </div>

        <!-- Enlace de recuperación de contraseña -->
        <div class="text-center">
          <router-link to="/recuperar" class="text-esan-accent hover:underline text-lg">
            ¿Olvidaste tu contraseña?
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
      Email: '',
      Password: '',
      showPassword: false,
    }
  },
  methods: {
    iniciarSesion() {
      const endpointURL = '/api/usuarios/signIn' // Ajusta la URL según tu backend
      const user = {
        Correo: this.Email,
        Password: this.Password,
      }

      this.$api
        .post(endpointURL, user)
        .then((response) => {
          if (response.data && (response.data.success || response.status === 200)) {
            // Guardar el JWT en localStorage
            if (response.data.token) {
              localStorage.setItem('jwt', response.data.token)
            }

            // Verificar el rol del usuario
            const rol = response.data.rol // Asegúrate de que el backend envíe el rol
            if (rol === 'Administrador') {
              this.$router.push('/menu-admin')
            } else if (rol === 'Profesor') {
              this.$router.push('/menu-profesor')
            } else {
              this.$router.push('/menu-libre')
            }

            this.$q.notify({
              type: 'positive',
              message: 'Inicio de sesión exitoso.',
            })
          } else {
            this.$q.notify({
              type: 'negative',
              message: 'Correo o Contraseña errónea.',
            })
          }
        })
        .catch((error) => {
          let msg = 'Error de conexión.'
          if (error.response) {
            if (error.response.status === 401) {
              msg = 'Credenciales incorrectas. Verifica tu correo y contraseña.'
            } else {
              msg = error.response.data?.message || error.message || msg
            }
          } else if (error.message) {
            msg = error.message
          }
          this.$q.notify({
            type: 'negative',
            message: msg,
          })
        })
    },
    onReset() {
      this.Email = ''
      this.Password = ''
    },
  },
}
</script>

<style scoped>
/* Asegúrate de que la imagen de fondo cubra toda la pantalla */
.login-container {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-image: url('/icons/Portada.png'); /* Ajusta la ruta de la imagen aquí */
  background-size: cover;
  background-position: center;
  opacity: 0.85;
  z-index: -1; /* Asegúrate de que la imagen de fondo esté detrás del formulario */
  display: flex;
  justify-content: center; /* Centra el contenido horizontalmente */
  align-items: center; /* Centra el contenido verticalmente */
}

/* Estilos adicionales para el card */
.q-card {
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease-in-out;
}

.q-input {
  font-size: 18px;
  height: 50px;
}

.q-btn {
  background-color: #b80000;
  color: white;
  font-weight: bold;
  border-radius: 15px;
  transition: background-color 0.3s ease;
  font-size: 18px;
  padding: 15px;
}

.q-btn:hover {
  background-color: #a60000;
}

:deep(.q-field--focused .q-field__control:after) {
  border-bottom: 2px solid #b80000 !important;
}

:deep(.q-field__label--active),
:deep(.q-field--focused .q-field__label) {
  color: #b80000 !important;
}
</style>
