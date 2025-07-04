<template>
  <div class="carousel-container">
    <q-img
      :src="imageUrls[currentImage]"
      class="carousel-image"
      :alt="'Imagen ' + (currentImage + 1)"
      :key="currentImage"
    />
    <div class="carousel-buttons">
      <q-btn
        icon="keyboard_arrow_left"
        color="white"
        round
        @click="$emit('prev')"
        class="carousel-btn-left"
      />
      <q-btn
        icon="keyboard_arrow_right"
        color="white"
        round
        @click="$emit('next')"
        class="carousel-btn-right"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'MainCarousel',
  props: {
    imageUrls: {
      type: Array,
      required: true,
    },
    currentImage: {
      type: Number,
      required: true,
    },
  },
}
</script>

<style scoped>
.carousel-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  margin-top: 20px;
}
.carousel-image {
  width: 100%;
  height: 671px;
  object-fit: cover;
  border-radius: 10px;
}
.carousel-buttons {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  transform: translateY(-50%);
}
.carousel-btn-left {
  position: absolute;
  left: 10px;
}
.carousel-btn-right {
  position: absolute;
  right: 10px;
}
</style>
