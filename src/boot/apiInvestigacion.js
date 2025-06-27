// src/boot/apiInvestigacion.js
// Módulo de conexión para investigaciones (Axios)
import axios from 'axios'

const apiInvestigacion = axios.create({
  baseURL: 'http://localhost:5000/api/investigaciones' // Cambia la URL según tu backend
})

export default apiInvestigacion
