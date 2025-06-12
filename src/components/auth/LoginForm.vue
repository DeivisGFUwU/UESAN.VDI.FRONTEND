<template>
  <q-form @submit.prevent="iniciarSesion">
    <q-input filled v-model="Email" label="Correo" type="email" required />
    <q-input filled v-model="Password" label="Contraseña" type="password" required />
    <q-checkbox v-model="acceptTerms" label="Acepto los términos y condiciones" class="q-mt-sm" />
    <q-btn label="Ingresar" type="submit" color="primary" class="q-mt-md" />
    <div class="q-mt-sm">
      <router-link to="/register">¿No tienes cuenta? Regístrate</router-link>
    </div>
  </q-form>
</template>

<script>
export default {
  data() {
    return {
      Email: '',
      Password: '',
      acceptTerms: false,
    }
  },
  methods: {
    iniciarSesion() {
      if (!this.acceptTerms) {
        this.$q.notify({
          type: 'negative',
          message: 'Debes aceptar los términos y condiciones para continuar.',
        })
        return
      }

      const endpointURL = '/api/usuarios/signIn' // Ajusta la URL según tu backend
      const user = {
        Correo: this.Email,
        Password: this.Password,
      }

      this.$api
        .post(endpointURL, user)
        .then((response) => {
          if (response.data && (response.data.success || response.status === 200)) {
            this.$q.notify({
              type: 'positive',
              message: 'Inicio de sesión exitoso.',
            })
            this.$router.push('/')
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
      this.acceptTerms = false
    },
  },
}
</script>

<style scoped>
.q-form {
  max-width: 350px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
