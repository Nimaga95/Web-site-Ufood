<template>
  <main>
    <div class="area-container">
      <RestaurantItem
        v-bind:restaurant="this.restaurant"
        v-bind:showSlide="false"
        v-bind:favorite="this.favorite"
        class="full-area"
        v-if="this.restaurant"
      ></RestaurantItem>
      <RestaurantDetails
        v-bind:restaurant="this.restaurant"
        class="half-area content-area"
        v-if="this.restaurant"
      ></RestaurantDetails>
      <MapRestaurantPage
        v-bind:restaurant="this.restaurant"
        class="half-area content-area"
        v-if="this.restaurant"
      ></MapRestaurantPage>
      <RestaurantCarousel
        v-bind:restaurant="this.restaurant"
        class="full-area content-area"
        v-if="this.restaurant"
      ></RestaurantCarousel>
    </div>
  </main>
</template>

<script>
import { getRestaurantById } from "@/api/restaurant";

import RestaurantDetails from "@/components/restaurant/RestaurantDetails";
import RestaurantCarousel from "@/components/restaurant/RestaurantCarousel.vue";
import RestaurantItem from "@/components/restaurant/RestaurantItem.vue";
import MapRestaurantPage from "@/components/map/MapRestaurantPage.vue";
import {AccessDeniedError} from "@/api/accessDeniedError";

export default {
  components: {
    RestaurantItem,
    RestaurantCarousel,
    RestaurantDetails,
    MapRestaurantPage,
  },
  async created() {
    await this.loadRestaurant();
  },
  name: "restaurant",
  data: function () {
    return {
      restaurant: null,
      restaurantId: null,
      favorite: false,
    };
  },
  watch: {},
  computed: {},
  methods: {
    async loadRestaurant() {
      try {
        this.restaurant = await getRestaurantById(this.$route.params.id);
        this.restaurantId = this.$route.params.id;
      } catch (e) {
        if (e instanceof AccessDeniedError) {
          this.$router.push('/login');
        } else {
          console.log(e);
        }
      }
    },
  },
};
</script>

<style scoped>
main {
  --area-color: white;
  --area-margin: 15px;
  --area-padding: 25px;
  --area-border-radius: 30px;
  --page-background-color: #eee;

  background-color: var(--page-background-color);

  height: fit-content;
}

.area-container {
  max-width: 100rem;
  margin-left: auto;
  margin-right: auto;
}

.content-area {
  font-family: Arial, Helvetica, sans-serif;
  border: 3px solid black;

  background-color: var(--area-color);
  border-radius: var(--area-border-radius);
  margin: var(--area-margin);
  padding: var(--area-padding);
}

.area-container {
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  align-content: flex-start;
}

.half-area {
  width: calc(50% - 2 * var(--area-margin));
}

.full-area {
  width: calc(100% - 2 * var(--area-margin));
}

@media screen and (max-width: 992px) {
  .area-container > * {
    width: calc(100% - 2 * var(--area-margin));
  }
}
</style>

