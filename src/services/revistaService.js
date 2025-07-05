import { api } from 'src/boot/axios'

const revistaService = {
  // Obtener todas las revistas activas
  getAll() {
    return api.get('/revistas')
  },

  // Obtener revista por ISSN
  getByISSN(issn) {
    return api.get(`/revistas/${issn}`)
  },

  // Crear nueva revista
  create(data) {
    return api.post('/revistas', data)
  },

  // Actualizar revista existente
  update(issn, data) {
    return api.put(`/revistas/${issn}`, data)
  },

  // Eliminar (soft delete) una revista
  delete(issn) {
    return api.delete(`/revistas/${issn}`)
  },
}

export default revistaService
