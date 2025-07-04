<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.4">Oops. Nothing here...</div>

      <BaseButton
        class="q-mt-xl"
        color="white"
        textColor="blue"
        unelevated
        :to="'/'"
        label="Go Home"
        noCaps
      />
    </div>
  </div>
</template>

<script setup>
import BaseButton from 'src/components/common/BaseButton.vue'
</script>
