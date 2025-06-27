<template>
  <div class="relative min-h-screen w-full flex items-center justify-center font-sans bg-gray-100">
    <q-card
      class="q-pa-xl q-mx-auto q-mt-xl q-mb-xl shadow-10 executive-bg"
      style="min-width: 400px; max-width: 480px"
    >
      <q-form @submit.prevent="recuperarClave">
        <p class="text-center q-mb-md">Recuperar contraseña</p>
        <q-input
          filled
          v-model="correo"
          label="Correo"
          type="email"
          required
          class="q-mb-md"
          :rules="[
            (val) => !!val || 'El correo es obligatorio',
            (val) => /.+@.+\..+/.test(val) || 'Ingresa un correo válido',
          ]"
        />
        <q-btn
          label="Enviar instrucciones"
          type="submit"
          color="esan-primary"
          class="full-width q-mb-md"
          style="background-color: #b80000"
        />
        <div class="q-mb-sm text-center">
          <router-link to="/login" class="text-esan-primary hover:underline">
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
      console.log('Enviando JSON:', JSON.stringify(data))
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
:deep(.q-field--focused .q-field__control:after) {
  border-bottom: 2px solid #b80000 !important;
}
:deep(.q-field__label--active),
:deep(.q-field--focused .q-field__label) {
  color: #b80000 !important;
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
  color: #dc2626 !important;
}
:deep(.q-field--error .q-field__control:after) {
  border-bottom: 2px solid #dc2626 !important;
}
.executive-bg {
  background: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  border-radius: 18px;
}
</style>
