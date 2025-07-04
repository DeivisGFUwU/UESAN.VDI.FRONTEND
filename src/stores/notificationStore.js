import { defineStore } from 'pinia'

export const useNotificationStore = defineStore('notification', {
  state: () => ({
    message: '',
    type: '', // 'positive', 'negative', 'warning', 'info'
    visible: false,
    timeout: 3000,
  }),
  actions: {
    notify({ message, type = 'info', timeout = 3000 }) {
      this.message = message
      this.type = type
      this.timeout = timeout
      this.visible = true
      setTimeout(() => {
        this.visible = false
      }, timeout)
    },
    clear() {
      this.message = ''
      this.type = ''
      this.visible = false
    },
  },
})
