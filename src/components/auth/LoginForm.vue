<template>
  <div class="relative min-h-screen w-full flex items-center justify-center font-sans">
    <div class="login-bg" aria-hidden="true"></div>

    <q-card
      class="q-pa-xl q-mx-auto q-mt-xl q-mb-xl shadow-10"
      style="min-width: 320px; max-width: 350px; background: rgba(255, 255, 255, 0.85)"
    >
      <q-form @submit.prevent="iniciarSesion">
        <!-- Título modificado para que sea más grande -->
        <p class="text-center q-mb-md text-4xl font-bold text-red-600">INGRESE SUS DATOS</p>

        <!-- Campo de correo -->
        <q-input filled v-model="Email" label="Correo" type="email" required class="q-mb-md" />

        <!-- Campo de la contraseña -->
        <q-input
          filled
          v-model="Password"
          :type="showPassword ? 'text' : 'password'"
          label="Contraseña"
          required
          class="q-mb-md"
        >
          <template v-slot:append>
            <!-- Opción de mostrar u ocultar contraseña debajo del campo -->
            <q-checkbox
              v-model="showPassword"
              size="sm"
              :label="showPassword ? 'Ocultar' : 'Mostrar'"
              class="ml-1 text-xs p-0"
            />
          </template>
        </q-input>

        <!-- Botón de Ingreso -->
        <q-btn
          label="Ingresar"
          type="submit"
          color="esan-primary"
          class="full-width q-mb-md"
          style="background-color: #b80000"
        />

        <!-- Enlace para registrarse -->
        <div class="q-mb-sm text-center">
          <router-link to="/register" class="text-esan-primary hover:underline text-lg">
            ¿No tienes cuenta? Regístrate
          </router-link>
        </div>

        <!-- Enlace para recuperar la contraseña -->
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
import RespJWT from '../../models/RespJWT'

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
            if (response.data.jwt) {
              localStorage.setItem('jwt', response.data.jwt)
            }
            // Guardar datos de usuario en localStorage (JSON raíz)
            if (response.data) {
              const raw = response.data
              const usuarioMapeado = {
                id: raw.usuarioId,
                nombre: raw.nombre,
                apellido: raw.apellido,
                email: raw.correo,
                rol: raw.roleId,
              }
              console.log('Usuario mapeado:', usuarioMapeado)
              RespJWT.saveToLocalStorage(usuarioMapeado)
              // Redirección según el rol
              if (usuarioMapeado.rol === 3) {
                this.$router.push('/admin')
              } else if (usuarioMapeado.rol === 2) {
                this.$router.push('/profesor')
              } else if (usuarioMapeado.rol === 1) {
                this.$router.push('/alumno/dashboard')
              } else {
                this.$router.push('/')
              }
            }
            this.$q.notify({
              type: 'positive',
              message: 'Inicio de sesión exitoso.',
            })
          } else {
            this.$q.notify({
              type: 'negative',
              message: response.data?.message || 'Error al iniciar sesión.',
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
/* Fondo con imagen Portada.png */
.login-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -2;
  background-image: url('/icons/Portada.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  opacity: 1;
}

/* Estilos adicionales para el card */
.q-card {
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  padding: 30px;
  background-color: rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease-in-out;
}

/* Override Quasar blue with ESAN institutional color for q-input borders and labels */
:deep(.q-field--focused .q-field__control:after) {
  border-bottom: 2px solid #b80000 !important; /* ESAN primary */
}
:deep(.q-field__label--active),
:deep(.q-field--focused .q-field__label) {
  color: #b80000 !important; /* ESAN primary */
}
:deep(.q-field__control:after) {
  border-bottom: 2px solid #b80000 !important;
}
:deep(.q-field__control:before) {
  border-bottom: 1px solid #b80000 !important;
}
:deep(.q-field__native) {
  color: #222 !important;
  font-family: 'Inter', sans-serif !important;
}

/* Override Quasar input label and border colors to use Tailwind palette */
:deep(.q-field--filled .q-field__control) {
  background-color: transparent !important;
}
:deep(.q-field__label) {
  color: theme('colors.esan.primary.DEFAULT') !important;
  color: #b80000 !important;
  font-family: 'Inter', sans-serif !important;
  font-weight: 600 !important;
}
:deep(.q-field--focused .q-field__label) {
  color: theme('colors.esan.primary.DEFAULT') !important;
  color: #b80000 !important;
}
:deep(.q-field__control:after) {
  border-bottom: 2px solid #b80000 !important;
}
:deep(.q-field--focused .q-field__control:after) {
  border-bottom: 2.5px solid #b80000 !important;
}
:deep(.q-field--error .q-field__label) {
  color: #dc2626 !important; /* Tailwind red-600 for error */
}
:deep(.q-field--error .q-field__control:after) {
  border-bottom: 2px solid #dc2626 !important;
}

/* Reducir el tamaño del label del checkbox de mostrar/ocultar contraseña */
:deep(.q-checkbox__label) {
  font-size: 11px !important;
  padding-left: 2px !important;
  margin-left: 0 !important;
  line-height: 1.1 !important;
}
</style>
