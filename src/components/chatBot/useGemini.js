// src/components/chatBot/useGimini.js
export async function sendMessageToGemini(message) {
  const endpoint =
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'
  const apiKey = 'AIzaSyA9RTBx0n1fYhYlmfmuGkFtRe_ktU6-kNE' // <-- Reemplaza por tu API KEY real

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
