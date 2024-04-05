<template>
  <!-- @todo center picture with different aspect ratio (Ex:PFK) + Fix arrows with white background -->
  <div>
    <div id="images-carousel" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner">
        <div
          v-for="image in restaurant.pictures.slice(0, 1)"
          :key="image.id"
          class="carousel-item active"
        >
          <img
            class="d-block mw-100"
            :src="image"
            alt="Restaurant image No. 1"
          />
        </div>
        <div
          v-for="(image, index) in restaurant.pictures.slice(1)"
          :key="image.id"
          class="carousel-item"
        >
          <img
            class="d-block mw-100"
            :src="image"
            :alt="generateCarouselAlt(index + 2)"
          />
        </div>
      </div>
      <a
        class="carousel-control-prev"
        href="#images-carousel"
        role="button"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="sr-only">Previous</span>
      </a>
      <a
        class="carousel-control-next"
        href="#images-carousel"
        role="button"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="sr-only">Next</span>
      </a>
    </div>
  </div>
</template>

<script>
export default {
  name: "RestaurantCarousel",
  props: ["restaurant"],
  methods: {
    generateCarouselAlt(number) {
      return "Restaurant Image No. " + number;
    },
  },
};
</script>

<style scoped>
.carousel-item {
  max-height: 90vh;
}
</style>
