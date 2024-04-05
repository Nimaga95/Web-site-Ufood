<template>
  <div class="card mb-4 p-2">
    <h4>{{ favorite.name }}</h4>
    <div class="mt-3 mb-3" v-if="isEmpty(restaurantNameList)">
      This list doesn't contain any restaurant yet!
    </div>
    <div
      class="d-inline mt-3 mb-3"
      v-for="restaurant in restaurantNameList"
      :key="restaurant.name"
    >
      <a
        class="link-offset-2 link-underline link-underline-opacity-25"
        type="button"
        @click="this.$router.push('/restaurant/' + restaurant.id)"
        >{{ restaurant.name }}</a
      >
      <a v-if="!readOnly"
        class="remove-button"
        @click="deleteRestaurant(favorite.id, restaurant.id)"
        >Remove</a
      >
    </div>
    <div v-if="!readOnly" class="d-flex justify-content-end margin-right">
      <button
        type="button"
        class="btn btn-outline-success margin-right"
        data-bs-toggle="modal"
        data-bs-target="#addRestaurant"
        @click="openModale(favorite.id, favorite.owner.email)"
      >
        Add restaurant
      </button>
      <button
        type="button"
        class="btn btn-outline-secondary margin-right"
        data-bs-toggle="modal"
        data-bs-target="#renameFavorite"
        @click="openModale(favorite.id, favorite.owner.email)"
      >
        Rename
      </button>
      <button
        type="button"
        class="btn btn-outline-danger"
        @click="
          deleteList();
          $emit('deletedRestaurant');
        "
      >
        Delete
      </button>
    </div>
    <ModaleRenameFavorite id="renameFavorite"></ModaleRenameFavorite>
    <ModaleAddRestaurant
      id="addRestaurant"
      @addedRestaurant="notifyParent()"
    ></ModaleAddRestaurant>
  </div>
</template>

<script>
import {
  deleteFavorites,
  deleteRestaurantFromFavorites,
  getRestaurantsFromFavorite,
} from "@/api/favoris";
import ModaleRenameFavorite from "@/components/modale/ModaleRenameFavorite.vue";
import { getRestaurantById } from "@/api/restaurant";
import { store } from "@/api/store";
import ModaleAddRestaurant from "@/components/modale/ModaleAddRestaurant.vue";
import {AccessDeniedError} from "@/api/accessDeniedError";

export default {
  name: "FavoritesItem",
  components: { ModaleRenameFavorite, ModaleAddRestaurant },
  props: ["favorite", "readOnly"],

  data: function () {
    return {
      restaurantNameList: [],
      store,
    };
  },

  async mounted() {
    await this.loadRestaurants();
  },

  methods: {
    async loadRestaurants() {
      try {
        let restaurantList = await getRestaurantsFromFavorite({
          idList: this.favorite.id,
        });
        await this.getRestaurant(restaurantList);
      } catch (e) {
        if (e instanceof AccessDeniedError) {
          this.$router.push('/login');
        } else {
          console.log(e);
        }
      }
    },

    async getRestaurant(restaurantList) {

      for (let restaurant of restaurantList) {
        let id = restaurant.id;
        try {
          let result = await getRestaurantById(id);
          this.restaurantNameList.push(result);
        } catch (e) {
          if (e instanceof AccessDeniedError) {
            this.$router.push('/login');
          } else {
            console.log(e);
          }
        }
      }
    },

    isEmpty(obj) {
      return Object.keys(obj).length === 0;
    },

    async deleteList() {
      try {
        await deleteFavorites({ id: this.favorite.id });
      } catch (e) {
        if (e instanceof AccessDeniedError) {
          this.$router.push('/login');
        } else {
          console.log(e);
        }
      }
    },

    openModale(id, owner) {
      this.store.favoriteId = id;
      this.store.owner = owner;
    },

    async deleteRestaurant(idFavorite, idRestaurant) {
      try {
        await deleteRestaurantFromFavorites({
          idFavorites: idFavorite,
          idRestaurant: idRestaurant,
        });
        await this.updateRestaurantsList();
      } catch (e) {
        if (e instanceof AccessDeniedError) {
          this.$router.push('/login');
        } else {
          console.log(e);
        }
      }
    },
    async updateRestaurantsList() {
      try {
        this.restaurantNameList = [];
        await this.loadRestaurants();
      } catch (e) {
        console.log(e);
      }
    },
    notifyParent() {
      this.$emit("addedRestaurant");
    },
  },
};
</script>

<style>
.margin-right {
  margin-right: 0.5rem;
}

.remove-button {
  margin-left: 0.5rem;
  font-size: small;
  color: red;
  text-decoration: none;
  cursor: pointer;
}

.remove-button:hover {
  color: red;
  text-decoration: underline;
}

.card {
  border-radius: 30px;
  border: 7px solid black;
  width: 100%;
}
</style>
