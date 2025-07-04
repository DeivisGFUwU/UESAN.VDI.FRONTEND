import { api } from 'src/boot/axios'

const profesorService = {
  getAll() {
    return api.get('/profesores')
  },
  getById(id) {
    return api.get(`/profesores/${id}`)
  },
  create(data) {
    return api.post('/profesores', data)
  },
  update(id, data) {
    return api.put(`/profesores/${id}`, data)
  },
  delete(id) {
    return api.delete(`/profesores/${id}`)
  },
}

export default profesorService
