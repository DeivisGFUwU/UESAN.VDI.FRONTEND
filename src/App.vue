<template>
  <router-view />
  <GlobalNotification />
</template>

<script setup>
import GlobalNotification from 'src/components/common/GlobalNotification.vue'
import './css/tailwind.css'
</script>
