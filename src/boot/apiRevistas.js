// src/boot/apiRevistas.js
// Módulo de conexión para revistas científicas (Axios)
import axios from 'axios'

const apiRevistas = axios.create({
  baseURL: 'http://localhost:5000/api/revistas' // Cambia la URL según tu backend
})

export default apiRevistas
