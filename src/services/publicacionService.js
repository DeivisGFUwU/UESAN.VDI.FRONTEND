import { api } from 'src/boot/axios'

const publicacionService = {
  getAll() {
    return api.get('/publicaciones')
  },
  getById(id) {
    return api.get(`/publicaciones/${id}`)
  },
  create(data) {
    return api.post('/publicaciones', data)
  },
  update(id, data) {
    return api.put(`/publicaciones/${id}`, data)
  },
  delete(id) {
    return api.delete(`/publicaciones/${id}`)
  },
}

export default publicacionService
