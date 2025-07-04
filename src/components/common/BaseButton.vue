<template>
  <q-btn
    :label="label"
    :icon="icon"
    :color="color"
    :flat="flat"
    :round="round"
    :class="customClass"
    @click="$emit('click')"
    v-bind="$attrs"
  />
</template>

<script>
export default {
  name: 'BaseButton',
  props: {
    label: { type: String, default: '' },
    icon: { type: String, default: '' },
    color: { type: String, default: 'primary' },
    flat: { type: Boolean, default: false },
    round: { type: Boolean, default: false },
    customClass: { type: String, default: '' },
  },
}
</script>
