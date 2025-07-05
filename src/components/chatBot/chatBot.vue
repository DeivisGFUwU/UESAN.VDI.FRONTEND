<template>
  <div>
    <!-- Botón flotante en la esquina inferior derecha -->
    <q-btn
      round
      color="primary"
      icon="chat"
      class="q-pa-sm chat-float-btn right"
      @click="toggleChat"
    />

    <!-- Ventana del chat tipo WhatsApp -->
    <transition name="fade">
      <div v-if="isOpen" class="whatsapp-chat-float right">
        <q-card class="whatsapp-chat-card">
          <!-- Encabezado -->
          <q-bar class="bg-esan text-white whatsapp-header">
            <div class="text-h6">Asistente IA</div>
            <q-space />
            <q-btn flat icon="close" dense @click="toggleChat" />
          </q-bar>

          <!-- Cuerpo del chat -->
          <q-card-section class="whatsapp-chat-body">
            <!-- Mensajes -->
            <div class="whatsapp-messages">
              <div
                v-for="(msg, i) in messages"
                :key="i"
                :class="
                  msg.sender === 'user' ? 'wa-message wa-message-user' : 'wa-message wa-message-ai'
                "
              >
                <div class="wa-bubble">
                  <span>{{ msg.text }}</span>
                  <span class="wa-timestamp">{{ msg.time }}</span>
                </div>
              </div>
              <div v-if="loading" class="wa-message wa-message-ai wa-bubble wa-bubble-loading">
                Escribiendo...
              </div>
            </div>
          </q-card-section>

          <!-- Campo de entrada -->
          <q-card-actions class="whatsapp-input-row">
            <q-input
              outlined
              v-model="input"
              placeholder="Escribe tu mensaje..."
              dense
              class="wa-input"
              @keyup.enter="handleSend"
              :disable="loading"
            />
            <q-btn
              color="esan"
              icon="send"
              round
              @click="handleSend"
              :disable="loading || !input.trim()"
              class="wa-send-btn"
            />
          </q-card-actions>
        </q-card>
      </div>
    </transition>
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

// Botón flotante a la derecha
.chat-float-btn.right {
  position: fixed;
  bottom: 32px;
  right: 32px;
  left: auto;
  z-index: 10001;
}
// Flotante tipo WhatsApp, ahora abajo a la derecha y sobre el botón
.whatsapp-chat-float.right {
  position: fixed;
  bottom: 90px; // justo encima del botón flotante
  right: 32px;
  left: auto;
  z-index: 10000;
  width: 370px;
  max-width: 95vw;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
}
.whatsapp-chat-card {
  width: 100%;
  height: 100%;
  border-radius: 18px 18px 8px 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #fff;
}
.whatsapp-header {
  border-radius: 18px 18px 0 0;
  min-height: 48px;
  display: flex;
  align-items: center;
  background: $esan-red;
  color: #111;
}
.whatsapp-chat-body {
  background: #fff;
  flex: 1 1 auto;
  overflow-y: auto;
  padding: 16px 8px 8px 8px;
  min-height: 220px;
  max-height: 340px;
}
.whatsapp-messages {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.wa-message {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.wa-message-user {
  align-items: flex-end;
}
.wa-bubble {
  background: $esan-red;
  color: #111;
  border-radius: 18px 18px 4px 18px;
  padding: 8px 14px;
  max-width: 80%;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  font-size: 15px;
  position: relative;
  margin-bottom: 2px;
  word-break: break-word;
  white-space: pre-line;
}
.wa-message-user .wa-bubble {
  background: #fff;
  color: #111;
  border: 1.5px solid $esan-red;
  border-radius: 18px 18px 18px 4px;
  align-self: flex-end;
}
.wa-message-ai .wa-bubble {
  background: $esan-red;
  color: #111;
  border-radius: 18px 18px 4px 18px;
  align-self: flex-start;
}
.wa-timestamp {
  display: block;
  font-size: 11px;
  color: #888;
  margin-top: 2px;
  text-align: right;
}
.wa-bubble-loading {
  background: #fff;
  color: #888;
  font-style: italic;
  border-radius: 18px 18px 4px 18px;
  padding: 8px 14px;
  max-width: 60%;
  align-self: flex-start;
  border: 1.5px solid $esan-red;
}
.whatsapp-input-row {
  background: #fff;
  padding: 8px 8px 8px 12px;
  border-radius: 0 0 8px 8px;
  display: flex;
  align-items: center;
}
.wa-input {
  flex: 1 1 auto;
  margin-right: 8px;
}
.wa-send-btn {
  min-width: 36px;
  min-height: 36px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
