<template>
  <!-- Este componente no debe renderizar nada, solo escucha el store y lanza notificaciones -->
  <div style="display: none"></div>
</template>

<script>
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useQuasar } from 'quasar'
import { useNotificationStore } from 'src/stores/notificationStore'

export default {
  name: 'GlobalNotification',
  setup() {
    const notification = useNotificationStore()
    const { message, type, visible, timeout } = storeToRefs(notification)
    const $q = useQuasar()
    watch(visible, (val) => {
      if (val) {
        $q.notify({
          type: type.value,
          message: message.value,
          timeout: timeout.value,
          position: 'top-right',
          color:
            type.value === 'positive'
              ? 'green-5'
              : type.value === 'negative'
                ? 'red-7'
                : type.value === 'warning'
                  ? 'orange-5'
                  : 'primary',
          textColor: type.value === 'negative' ? 'white' : 'black',
          icon:
            type.value === 'positive'
              ? 'check_circle'
              : type.value === 'negative'
                ? 'error'
                : type.value === 'warning'
                  ? 'warning'
                  : 'info',
        })
        if (typeof notification.hide === 'function') {
          notification.hide()
        }
      }
    })
    return {}
  },
}
</script>
