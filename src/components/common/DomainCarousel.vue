<template>
  <div class="domain-carousel-wrapper">
    <!-- Left Drawer -->
    <q-drawer
      v-model="drawer"
      :show-if-above="false"
      side="left"
      :width="220"
      class="esan-drawer custom-drawer-position"
      bordered
      :breakpoint="0"
      :style="
        drawer
          ? 'top: 0; left: 0; height: 100vh; border-radius: 0; box-shadow: 0 4px 24px rgba(34,34,34,0.12);'
          : ''
      "
    >
      <q-list>
        <q-item
          v-for="(item, idx) in items"
          :key="idx"
          clickable
          @click="goTo(idx)"
          :active="idx === current"
        >
          <q-item-section avatar>
            <q-icon :name="item.icon" :color="idx === current ? 'esan-red' : 'grey'" />
          </q-item-section>
          <q-item-section>{{ item.label }}</q-item-section>
        </q-item>
      </q-list>
      <div class="drawer-footer">
        <q-btn
          flat
          dense
          icon="chevron_left"
          @click="drawer = false"
          v-if="drawer"
          class="drawer-close-btn"
        />
      </div>
    </q-drawer>

    <!-- Carousel + Drawer Toggle -->
    <div class="domain-carousel-content">
      <div class="carousel-container">
        <q-btn flat round icon="chevron_left" @click="prev" />
        <q-card class="domain-card">
          <q-icon :name="items[current].icon" size="48px" color="esan-red" />
          <div class="domain-title">{{ items[current].label }}</div>
          <div class="domain-desc">{{ items[current].desc }}</div>
          <q-btn
            v-if="items[current].action && items[current].action.route"
            color="esan-red"
            :label="items[current].action.label"
            @click="handleCardButtonClick"
            class="q-mt-md"
          />
        </q-card>
        <q-btn flat round icon="chevron_right" @click="next" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  items: {
    type: Array,
    required: true,
    // [{ icon, label, desc, action: { label, onClick } }]
  },
  initial: {
    type: Number,
    default: 0,
  },
})

// Unifica imports
const drawer = ref(false)
const drawerOpen = inject('drawerOpen', null)
const current = ref(props.initial)
const router = useRouter()

function goTo(idx) {
  current.value = idx
}

function handleCardButtonClick() {
  const item = props.items[current.value]
  if (item && item.action && item.action.route) {
    router.push(item.action.route)
  }
}

// Sincroniza el estado del drawer con el layout principal
watch(drawer, (val) => {
  if (drawerOpen) drawerOpen.value = val
})
function prev() {
  if (current.value > 0) {
    current.value--
  } else {
    current.value = props.items.length - 1
  }
}
function next() {
  if (current.value < props.items.length - 1) {
    current.value++
  } else {
    current.value = 0
  }
}
</script>

<style lang="scss" scoped>
@import 'src/css/esan.variables.scss';

.domain-carousel-wrapper {
  display: flex;
  flex-direction: row;
  height: 100%;
}
.esan-drawer {
  background: $esan-light-grey;
  font-family: $esan-font-main;
}
.domain-carousel-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
}
.carousel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 340px;
}
.domain-card {
  min-width: 320px;
  max-width: 400px;
  min-height: 220px;
  padding: 32px 24px;
  margin: 0 24px;
  background: white;
  border-radius: 18px;
  box-shadow: 0 2px 12px rgba(34, 34, 34, 0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: $esan-font-main;
}
.domain-title {
  font-size: $esan-font-size-title;
  font-weight: 700;
  color: $esan-red;
  margin-top: 12px;
  margin-bottom: 8px;
  text-align: center;
}
.domain-desc {
  color: $esan-grey;
  font-size: $esan-font-size-base;
  text-align: center;
}
</style>
