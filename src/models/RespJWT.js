// src/models/RespJWT.js

export default class RespJWT {
  constructor(data) {
    this.id = data.id || null
    this.nombre = data.nombre || ''
    this.apellido = data.apellido || ''
    this.email = data.email || ''
    this.rol = data.rol || ''
    // Agrega aquí más campos según el JSON de respuesta del backend
  }

  static fromLocalStorage() {
    try {
      const userData = localStorage.getItem('user')
      if (!userData) return null
      return new RespJWT(JSON.parse(userData))
    } catch {
      return null
    }
  }

  static saveToLocalStorage(data) {
    localStorage.setItem('user', JSON.stringify(data))
  }

  static clearLocalStorage() {
    localStorage.removeItem('user')
  }
}
