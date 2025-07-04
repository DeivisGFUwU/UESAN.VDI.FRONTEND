<template>
  <q-select
    v-model="modelValueProxy"
    :label="label"
    :options="options"
    :rules="rules"
    :dense="dense"
    :outlined="outlined"
    :clearable="clearable"
    :placeholder="placeholder"
    emit-value
    map-options
    v-bind="$attrs"
  />
</template>

<script>
export default {
  name: 'BaseSelect',
  props: {
    modelValue: [String, Number, Object, Array],
    label: String,
    options: { type: Array, default: () => [] },
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
