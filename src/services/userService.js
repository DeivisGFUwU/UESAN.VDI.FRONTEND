import { api } from 'src/boot/axios'

const userService = {
  login(user) {
    return api.post('/usuarios/signIn', user)
  },
  register(user) {
    return api.post('/Usuarios', user)
  },
  getProfile() {
    return api.get('/profile')
  },
  getAll() {
    // Devuelve todos los usuarios (GET /usuarios)
    return api.get('/usuarios')
  },
}

export default userService
