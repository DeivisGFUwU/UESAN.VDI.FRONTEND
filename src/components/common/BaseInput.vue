<template>
  <q-input
    v-model="modelValueProxy"
    :label="label"
    :type="type"
    :rules="rules"
    :dense="dense"
    :outlined="outlined"
    :clearable="clearable"
    :placeholder="placeholder"
    v-bind="$attrs"
  />
</template>

<script>
export default {
  name: 'BaseInput',
  props: {
    modelValue: [String, Number],
    label: String,
    type: { type: String, default: 'text' },
    rules: { type: Array, default: () => [] },
    dense: { type: Boolean, default: false },
    outlined: { type: Boolean, default: true },
    clearable: { type: Boolean, default: false },
    placeholder: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
  computed: {
    modelValueProxy: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      },
    },
  },
}
</script>
