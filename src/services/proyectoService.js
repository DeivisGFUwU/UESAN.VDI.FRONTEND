import { api } from 'src/boot/axios'

const proyectoService = {
  getAll() {
    return api.get('/proyectos')
  },
  getById(id) {
    return api.get(`/proyectos/${id}`)
  },
  create(data) {
    return api.post('/proyectos', data)
  },
  update(id, data) {
    return api.put(`/proyectos/${id}`, data)
  },
  delete(id) {
    return api.delete(`/proyectos/${id}`)
  },
}

export default proyectoService
