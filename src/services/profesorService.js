import { api } from 'src/boot/axios'

const profesorService = {
  // Obtener todos los profesores activos
  getAll() {
    return api.get('/profesores')
  },

  // Obtener un profesor por ID
  getById(id) {
    return api.get(`/profesores/${id}`)
  },

  // Crear profesor individual
  create(data) {
    return api.post('/profesores', data)
  },

  // Actualizar profesor existente
  update(id, data) {
    return api.put(`/profesores/${id}`, data)
  },

  // Eliminar (soft delete) profesor
  delete(id) {
    return api.delete(`/profesores/${id}`)
  },

  // Reactivar profesor eliminado
  reactivate(id) {
    return api.put(`/profesores/reactivar/${id}`)
  },

  // Crear profesor y usuario juntos
  createWithUser(data) {
    return api.post('/profesores/crear-profesor-usuario', data)
  },

  // Crear múltiples profesores + usuarios (lista JSON)
  createManyWithUsers(dataArray) {
    return api.post('/profesores/crear-profesores-usuarios-masivo', dataArray)
  },

  // Crear múltiples profesores + usuarios desde archivo Excel
  uploadExcel(file) {
    const formData = new FormData()
    formData.append('file', file)
    return api.post('/profesores/crear-profesores-usuarios-masivo-excel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export default profesorService
