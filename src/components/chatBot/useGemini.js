import proyectoService from 'src/services/proyectoService'
import publicacionService from 'src/services/publicacionService'
let revistaService = null
try {
  revistaService = require('src/services/revistaService').default
} catch {
  // Si no existe, no pasa nada
}

// Simulación de rol actual (debería venir del authStore o JWT)
const getUserRole = () => localStorage.getItem('userRole') // 'ADMIN' o 'PROFESOR'

export async function sendMessageToGemini(message) {
  const endpoint =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
  const apiKey = 'AIzaSyD6h2GYQbbOe1POE5Y_VMPewkHdL-GkACw' // Cámbialo por tu clave real

  const response = await fetch(`${endpoint}?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: message }] }],
    }),
  })

  if (!response.ok) throw new Error('Error en Gemini')

  const data = await response.json()
  return (
    (data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts &&
      data.candidates[0].content.parts[0] &&
      data.candidates[0].content.parts[0].text) ||
    '[Sin respuesta]'
  )
}
