<template>
  <q-card
    class="summary-card q-pa-md flex column items-center justify-center"
    :style="{ background: bgColor }"
  >
    <q-icon :name="icon" :color="iconColor" size="40px" class="q-mb-sm" />
    <div class="summary-value">{{ value }}</div>
    <div class="summary-label">{{ label }}</div>
  </q-card>
</template>

<script setup>
defineProps({
  icon: { type: String, required: true },
  value: { type: [String, Number], required: true },
  label: { type: String, required: true },
  iconColor: { type: String, default: 'primary' },
  bgColor: { type: String, default: '#f8f8fa' },
})
</script>

<style scoped>
.summary-card {
  min-width: 180px;
  min-height: 120px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(34, 34, 34, 0.07);
  transition: box-shadow 0.2s;
  cursor: default;
}
.summary-card:hover {
  box-shadow: 0 4px 16px rgba(34, 34, 34, 0.13);
}
.summary-value {
  font-size: 2.2rem;
  font-weight: 700;
  color: #222;
  margin-bottom: 4px;
}
.summary-label {
  font-size: 1.1rem;
  color: #666;
  text-align: center;
}
</style>
