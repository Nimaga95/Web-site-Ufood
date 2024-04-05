<template>
  <div>
    <h2>Address :</h2>
    <p id="address">{{ restaurant.address }}</p>
    <h2>Telephone :</h2>
    <p id="telephone">{{ restaurant.tel }}</p>
    <h2>Rating :</h2>
    <p id="rating">{{ Number.parseFloat(restaurant.rating).toFixed(2) }} / 5</p>
    <h2>Price range :</h2>
    <p id="price-range">{{ restaurant.price_range }} / 5</p>
    <h2>Genre(s) :</h2>
    <ul id="genres">
      <li v-for="genre in restaurant.genres" :key="genre">{{ genre }}</li>
    </ul>
    <button @click="goToHome" class="btn btn-primary">See Suggested Similar Spots</button>
    <br><br>
    <h2>Opening hours :</h2>
    <div id="opening-hours">
      <div>Sunday</div>
      <div v-if="restaurant.opening_hours.sunday !== null">
        {{ restaurant.opening_hours.sunday }}
      </div>
      <div v-else>Closed</div>
      <div>Monday</div>
      <div v-if="restaurant.opening_hours.monday !== null">
        {{ restaurant.opening_hours.monday }}
      </div>
      <div v-else>Closed</div>
      <div>Tuesday</div>
      <div v-if="restaurant.opening_hours.tuesday !== null">
        {{ restaurant.opening_hours.tuesday }}
      </div>
      <div v-else>Closed</div>
      <div>Wednesday</div>
      <div v-if="restaurant.opening_hours.wednesday !== null">
        {{ restaurant.opening_hours.wednesday }}
      </div>
      <div v-else>Closed</div>
      <div>Thursday</div>
      <div v-if="restaurant.opening_hours.thursday !== null">
        {{ restaurant.opening_hours.thursday }}
      </div>
      <div v-else>Closed</div>
      <div>Friday</div>
      <div v-if="restaurant.opening_hours.friday !== null">
        {{ restaurant.opening_hours.friday }}
      </div>
      <div v-else>Closed</div>
      <div>Saturday</div>
      <div v-if="restaurant.opening_hours.saturday !== null">
        {{ restaurant.opening_hours.saturday }}
      </div>
      <div v-else>Closed</div>
    </div>
    <RestaurantFavorites
      v-bind:restaurant="this.restaurant"
    ></RestaurantFavorites>



  </div>

</template>

<script>
import RestaurantFavorites from "@/components/restaurant/RestaurantFavorites.vue";

export default {
  name: "restaurantDetails",
  components: { RestaurantFavorites },
  props: ["restaurant"],

  methods: {
    goToHome() {
      const genre = this.restaurant.genres[0]; // Peut etre modifier ceci car ca prend tjr le premier genre du restau
      this.$router.push({ path: '/', query: { genre: genre, near: true } })
        .then(() => {
          window.scrollTo(0, 0);
        });
    }
  }
};
</script>

<style scoped>
#opening-hours {
  max-width: 20rem;
  min-width: 11rem;
  display: flex;
  flex-wrap: wrap;
}

#opening-hours > * {
  width: 50%;
}
</style>
