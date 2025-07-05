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
  const role = getUserRole()
  const msg = (message || '').toLowerCase()

  // Proyectos
  if (msg.includes('mis proyectos') || msg.includes('ver proyectos')) {
    try {
      if (role === 'PROFESOR') {
        const userRaw = localStorage.getItem('user')
        const id = userRaw ? JSON.parse(userRaw)?.usuarioId : null
        if (!id) return 'No se pudo identificar al usuario.'
        const { data } = await proyectoService.getAll()
        const proyectos = Array.isArray(data) ? data.filter((p) => p.profesorId === id) : []
        return proyectos.length
          ? proyectos.map((p) => `• ${p.titulo} (${p.estatus})`).join('\n')
          : 'No tienes proyectos asignados aún.'
      } else if (role === 'ADMIN') {
        const { data } = await proyectoService.getAll()
        return `Total de proyectos: ${Array.isArray(data) ? data.length : 0}`
      }
    } catch {
      return '⚠️ Error al consultar proyectos.'
    }
  }

  // Revistas
  if ((msg.includes('revistas') || msg.includes('cuartil')) && revistaService) {
    try {
      const { data } = await revistaService.getAll()
      const resumen = Array.isArray(data)
        ? data.map((r) => `• ${r.titulo} (ISSN: ${r.issn}, Q: ${r.cuartil})`).slice(0, 5)
        : []
      return resumen.length
        ? `Estas son algunas revistas:\n${resumen.join('\n')}...`
        : 'No hay revistas registradas.'
    } catch {
      return '⚠️ Error al consultar revistas.'
    }
  }

  // Publicaciones
  if (msg.includes('publicaciones')) {
    try {
      const { data } = await publicacionService.getAll()
      const resumen = Array.isArray(data)
        ? data.map((p) => `• ${p.titulo} (${(p.fechaPublicacion || '').slice(0, 10)})`).slice(0, 5)
        : []
      return resumen.length
        ? `Últimas publicaciones:\n${resumen.join('\n')}...`
        : 'No hay publicaciones registradas.'
    } catch {
      return '⚠️ Error al consultar publicaciones.'
    }
  }

  // Fallback Gemini con contexto
  try {
    const contexto = `Eres un asistente virtual para la plataforma de gestión académica y de investigación VDI-ESAN.\nLa plataforma permite a administradores, profesores y postulantes gestionar proyectos, publicaciones, revistas académicas y formularios de investigación.\nResponde de manera clara, útil y breve, en español, y si la pregunta es sobre funcionalidades, procesos o ayuda sobre la plataforma, responde con instrucciones o pasos concretos. Si la pregunta es general, responde normalmente.`
    const promptFinal = `${contexto}\n\nPregunta del usuario: ${message}`
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDJa0Qe_JpwaasyFdHXNNjAT-dubqdxcsw',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: promptFinal }] }] }),
      },
    )
    const result = await response.json()
    return result.candidates?.[0]?.content?.parts?.[0]?.text || 'No entendí tu pregunta.'
  } catch {
    return '⚠️ Error al conectar con Gemini'
  }
}
