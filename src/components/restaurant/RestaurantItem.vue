<template>
  <div
    class="restaurant-item"
    v-if="resto !== null"
    :style="{ backgroundImage: `url(${resto.pictures[0]})` }"
  >
    <div>
      <div v-if="showSlide" class="restaurant-item-slide">
        <p>Address:</p>
        <p class="restaurant-item-address">{{ resto.address }}</p>
        <br />
        <router-link
          class="restaurant-item-look"
          :to="{ name: 'Restaurant', params: { id: resto.id } }"
        >Select</router-link
        >
      </div>
      <div class="restaurant-item-main">
        <p class="restaurant-item-title">
          {{ resto.name }}
        </p>
        <p class="restaurant-item-rating">
          {{ convertRatingToStars(resto.rating) }}
          <br />
          {{ convertPriceToDollars(resto.price_range) }}
        </p>
        <button
          v-if="visit === null"
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          :data-bs-target="getModalIdRef()"
          @click="openModal(resto.id)"
        >
          Share my visit
        </button>
        <button
          v-else
          type="button"
          class="btn btn-primary"
          data-bs-toggle="modal"
          :data-bs-target="getModalIdRef()"
          @click="openModal(resto.id)"
        >
          Show Visit Details
        </button>
      </div>
      <Modale :id="getModalId()" v-bind:visit="visit"></Modale>
    </div>
  </div>
</template>

<script>
import { store } from "@/api/store";
import Modale from "@/components/modale/Modale.vue";
import { getRestaurantById } from "@/api/restaurant";
import {AccessDeniedError} from "@/api/accessDeniedError";

export default {
  name: "RestaurantItem",
  components: { Modale },
  props: {
    restaurant: Object,
    restaurantId: String,
    visit: {
      type: Object,
      default: null,
    },
    showSlide: {
      type: Boolean,
      default: true,
    },
  },

  data: function () {
    return {
      resto: null,
      store,
    };
  },

  async created() {
    if (this.visit !== null) {
      try {
        this.resto = await getRestaurantById(this.restaurantId);
      } catch (e) {
        if (e instanceof AccessDeniedError) {
          this.$router.push('/login');
        } else {
          console.log(e);
        }
      }
    } else {
      this.resto = this.restaurant;
    }
  },

  methods: {
    convertRatingToStars(rating) {
      return "★".repeat(rating) + "✩".repeat(6 - rating);
    },

    convertPriceToDollars(price) {
      return "$".repeat(price);
    },

    openModal(id) {
      this.store.currentRestaurant = id;
    },

    topPage() {
      window.scrollTo(0, 0);
    },

    getModalId() {
      if (this.visit !== null) {
        return "m" + this.visit.id;
      }
      return "visitModal";
    },
    getModalIdRef() {
      if (this.visit !== null) {
        return "#m" + this.visit.id;
      }
      return "#visitModal";
    },
  },
};
</script>

<style scoped>
button {
  margin-right: 20px;
}

.btn-primary {
  background-color: #112c86;
  border-color: #112c86;
}

.restaurant-item {
  --area-color: white;
  --area-margin: 15px;
  --area-padding: 25px;
  --area-border-radius: 30px;

  font-family: Arial, Helvetica, sans-serif;
  text-align: left;
  flex-grow: 1;
  justify-content: flex-end;
  position: relative;
  border-radius: var(--area-border-radius);
  border: 7px solid black;
  background-color: lightgrey;
  overflow: hidden;
  margin: 15px;
  white-space: normal;
  padding: 0;

  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-blend-mode: soft-light;

  transition: 250ms;

  width: 97%;
}
.restaurant-item > * {
  padding: 0 0 0 10%;
}

.restaurant-item-main {
  padding: 15px;
  width: 70%;
}

.restaurant-item-rating {
  font-size: smaller;
}

.restaurant-item-title {
  font-family: "Roboto", sans-serif;
  text-align: left;
  margin-top: 3%;
  font-size: 3.5rem;
}

.restaurant-item-address {
  font-style: oblique;
}

.restaurant-item-slide {
  float: right;
  background: #112c86;
  width: 75%;
  height: 100%;
  position: absolute;
  left: 75%;
  z-index: 5;
  box-shadow: -7px 0px 7px 0px rgba(0, 0, 0, 0.2);
  color: #112c86;
  transition: 250ms;
  padding-left: 100px;
  padding-top: 5%;
  text-align: center;
  font-family: "Roboto", sans-serif;

  &:hover,
  &:focus {
    transform: translate3d(-66%, 0, 0);
    background: #39b3b8;
    transition: 350ms;
    color: #222;
  }
}

.restaurant-item-slide::before {
  content: "⫷";
  position: absolute;
  top: 50%;
  left: 8%;
  font-size: 6vw;
  color: #fff;
  transform: translateY(-50%);
  transition: right 0.3s ease;
  transition: 250ms;
}

.restaurant-item-slide:hover::before {
  content: "⫸";
  transition: 250ms;
}

.restaurant-item-look {
  background-color: #f5ebeb;
  border: 2px solid #112c86;
  border-radius: 30px;
  box-shadow: #112c86 4px 4px 0 0;
  color: black;
  cursor: pointer;
  display: inline-block;
  font-size: 18px;
  font-family: "Roboto", sans-serif;
  padding: 0 18px;
  line-height: 50px;
  text-align: center;
  text-decoration: none;
}

.restaurant-item-look:hover {
  background-color: #909297;
  transition: 200ms;
}

.restaurant-item-look:active {
  transform: translate(2px, 2px);
}
</style>
