<template>
  <div>
    <!-- Botón flotante -->
    <q-btn round color="primary" icon="chat" class="q-pa-sm chat-float-btn" @click="toggleChat" />

    <!-- Ventana del chat -->
    <q-dialog v-model="isOpen" persistent>
      <q-card style="width: 400px; max-width: 90vw">
        <!-- Encabezado -->
        <q-bar class="bg-esan text-white">
          <div class="text-h6">Asistente IA</div>
          <q-space />
          <q-btn flat icon="close" dense v-close-popup />
        </q-bar>

        <!-- Cuerpo del chat -->
        <q-card-section class="scroll q-pa-sm" style="max-height: 320px">
          <!-- FAQs -->
          <div class="q-mb-md">
            <div class="text-subtitle2 text-grey-8 q-mb-xs">Preguntas frecuentes:</div>
            <q-list dense bordered separator>
              <q-item v-for="(faq, idx) in faqs" :key="idx" clickable @click="handleSend(faq)">
                <q-item-section>{{ faq }}</q-item-section>
              </q-item>
            </q-list>
          </div>

          <!-- Mensajes -->
          <div v-for="(msg, i) in messages" :key="i" class="q-mb-sm">
            <div :class="msg.sender === 'user' ? 'message message-user' : 'message message-ai'">
              <div>{{ msg.text }}</div>
              <div class="timestamp">{{ msg.time }}</div>
            </div>
          </div>

          <!-- Cargando -->
          <div v-if="loading" class="text-center text-grey q-mt-sm">Escribiendo...</div>
        </q-card-section>

        <!-- Campo de entrada -->
        <q-card-actions align="around">
          <q-input
            outlined
            v-model="input"
            placeholder="Escribe tu pregunta..."
            dense
            class="col-grow"
            @keyup.enter="handleSend"
          />
          <q-btn
            color="esan"
            label="Enviar"
            @click="handleSend"
            :disable="loading || !input.trim()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { sendMessageToGemini } from './useGemini.js'

// Estado
const isOpen = ref(false)
const input = ref('')
const loading = ref(false)
const messages = ref([])

// Preguntas frecuentes
const faqs = [
  '¿Cómo registro una nueva publicación?',
  '¿Cómo edito mi perfil?',
  '¿Qué hago si olvidé mi contraseña?',
  '¿Cómo contacto a soporte?',
  '¿Cómo veo mis proyectos asignados?',
]

// Hora actual formateada
function getTime() {
  const now = new Date()
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Enviar mensaje
async function handleSend(faqText) {
  let userMessage = ''
  if (faqText) {
    userMessage = faqText
    input.value = faqText
  } else {
    if (!input.value.trim()) return
    userMessage = input.value
  }

  messages.value.push({ sender: 'user', text: userMessage, time: getTime() })
  input.value = ''
  loading.value = true

  try {
    const aiResponse = await sendMessageToGemini(userMessage)
    messages.value.push({ sender: 'ai', text: aiResponse, time: getTime() })
  } catch {
    messages.value.push({
      sender: 'ai',
      text: '⚠️ Error al conectar con Gemini',
      time: getTime(),
    })
  } finally {
    loading.value = false
  }
}

// Abrir/cerrar chat
function toggleChat() {
  isOpen.value = !isOpen.value
}
</script>

<style lang="scss" scoped>
@import 'src/css/esan.variables.scss';
/* Botón flotante a la derecha */
.chat-float-btn {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
}
/* Colores institucionales */
// Colores institucionales
.bg-esan {
  background-color: $esan-red;
}
.text-esan {
  color: $esan-red;
}
.message {
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.4;
  position: relative;
  word-wrap: break-word;
  white-space: pre-wrap;
}

// Mensaje del usuario
.message-user {
  background-color: $esan-red;
  color: white;
  margin-left: auto;
  margin-right: 4px;
  border-bottom-right-radius: 0;
  text-align: right;
}

// Mensaje de la IA
.message-ai {
  background-color: $esan-light-grey;
  color: $esan-black;
  margin-right: auto;
  margin-left: 4px;
  border-bottom-left-radius: 0;
  text-align: left;
}

.timestamp {
  font-size: $esan-font-size-small;
  color: $esan-grey;
  margin-top: 4px;
  text-align: right;
}
</style>
