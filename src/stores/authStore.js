import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    jwt: localStorage.getItem('jwt') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
  }),
  actions: {
    setAuth(jwt, user) {
      this.jwt = jwt
      this.user = user
      localStorage.setItem('jwt', jwt)
      localStorage.setItem('user', JSON.stringify(user))
    },
    clearAuth() {
      this.jwt = null
      this.user = null
      localStorage.removeItem('jwt')
      localStorage.removeItem('user')
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.jwt,
    userRole: (state) => state.user?.rol || null,
    userName: (state) => state.user?.nombre || '',
  },
})
