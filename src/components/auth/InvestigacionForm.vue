<template>
  <div class="relative min-h-screen w-full flex items-center justify-center font-sans bg-esan-background">
    <div class="login-bg" aria-hidden="true"></div>
    <q-card
      class="q-pa-xl q-mx-auto q-mt-xl q-mb-xl shadow-10 executive-bg"
      style="min-width: 400px; max-width: 500px; background: rgba(255,255,255,0.85)"
    >
      <q-form @submit.prevent="onSubmit">
        <p class="text-center q-mb-md text-esan-primary font-bold text-lg">Registrar Investigación</p>
        <div class="q-gutter-md">
          <!-- ISSN: Select de revistas disponibles -->
          <q-select
            filled
            v-model="form.issn"
            :options="issnOptions"
            label="ISSN de revista"
            required
            :rules="[val => !!val || 'El ISSN es requerido']"
            class="q-mb-md"
          />
          <!-- ProyectoId: Input numérico -->
          <q-input
            filled
            v-model.number="form.proyectoId"
            type="number"
            label="ID de Proyecto"
            required
            :rules="[val => !!val || 'El ID de proyecto es requerido']"
            class="q-mb-md"
          />
          <!-- DOI: Opcional -->
          <q-input filled v-model="form.doi" label="DOI (opcional)" class="q-mb-md" />
          <!-- Medio Publicacion: Opcional -->
          <q-input filled v-model="form.medioPublicacion" label="Medio de Publicación (opcional)" class="q-mb-md" />
          <!-- Presupuesto: Opcional -->
          <q-input filled v-model.number="form.presupuesto" type="number" label="Presupuesto (opcional)" class="q-mb-md" />
          <!-- Tipo Formulario: Opcional -->
          <q-input filled v-model="form.tipoFormulario" label="Tipo de Formulario (opcional)" class="q-mb-md" />
          <!-- Botón de enviar -->
          <q-btn label="Registrar Investigación" type="submit" color="esan-primary" class="full-width q-mb-md" style="background-color: #b80000; color: #fff; font-weight: bold;" />
          <!-- Botón para ir a Login -->
          <q-btn label="Ir a Login" color="esan-primary" class="full-width q-mt-md" style="background-color: #b80000; color: #fff; font-weight: bold;" @click="goToLogin" />
        </div>
      </q-form>
    </q-card>
  </div>
</template>

<script setup>
// Componente de formulario de investigación para usuarios comunes
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import apiInvestigacion from '../../boot/apiInvestigacion'

const router = useRouter()
const $q = useQuasar()

// Modelo de datos del formulario
const form = ref({
  issn: '',
  proyectoId: 0,
  doi: '',
  medioPublicacion: '',
  presupuesto: 0.0,
  tipoFormulario: ''
})

// Opciones ISSN de revistas disponibles (simulado)
const issnOptions = [
  { label: '1234-5678', value: '1234-5678' },
  { label: '8765-4321', value: '8765-4321' },
  { label: '1111-2222', value: '1111-2222' }
]

// Maneja el envío del formulario
async function onSubmit() {
  // Validación simple de campos requeridos
  if (!form.value.issn || !form.value.proyectoId) {
    $q.notify({ type: 'negative', message: 'Completa los campos requeridos.' })
    return
  }
  try {
    // Enviar datos al backend usando Axios
    const response = await apiInvestigacion.post('/', { ...form.value })
    $q.notify({ type: 'positive', message: 'Investigación registrada en backend.' })
    // Limpia el formulario
    form.value = {
      issn: '',
      proyectoId: 0,
      doi: '',
      medioPublicacion: '',
      presupuesto: 0.0,
      tipoFormulario: ''
    }
    // Puedes mostrar la respuesta en consola
    console.log('Respuesta backend:', response.data)
  } catch (error) {
    $q.notify({ type: 'negative', message: 'Error al registrar en backend.' })
    console.error('Error backend:', error)
  }
}

function goToLogin() {
  router.push('/login')
}
</script>

<style scoped>
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
.executive-bg {
  background: rgba(255, 255, 255, 0.7) !important;
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.15);
  border-radius: 18px;
}
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
</style>

<!--
Este componente implementa un formulario de registro de investigaciones.
Los campos formularioId y fechaRegistro no se editan aquí.
No conecta a backend, solo muestra los datos en consola.
-->
