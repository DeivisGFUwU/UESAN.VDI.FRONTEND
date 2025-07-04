<template>
  <q-table
    :rows="rows"
    :columns="columns"
    :row-key="rowKey"
    :title="title"
    :loading="loading"
    flat
    :filter="filter"
    :pagination="pagination"
    @request="onRequest"
  >
    <template v-for="(_, slotName) in $slots" #[slotName]="slotProps">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </q-table>
</template>

<script>
export default {
  name: 'BaseTable',
  props: {
    rows: { type: Array, required: true },
    columns: { type: Array, required: true },
    rowKey: { type: String, default: 'id' },
    title: { type: String, default: '' },
    loading: { type: Boolean, default: false },
    filter: { type: String, default: '' },
    pagination: { type: Object, default: () => ({}) },
    onRequest: { type: Function, default: null },
  },
}
</script>
