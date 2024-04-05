<template>
  <div>
    <h2>In favorite Lists :</h2>
    <ul>
      <li v-for="list in inFavoritesLists" :key="list">{{ list.name }}</li>
    </ul>
    <div class="add-favorite">
      <select
        id="chosenListAdd"
        class="form-select"
        aria-label="Default select example"
        v-model="selectListeId"
      >
        <option
          v-for="list in notInFavoritesLists"
          :key="list"
          :value="list.id"
        >
          {{ list.name }}
        </option>
      </select>
      <button type="button" class="btn btn-primary" v-on:click="addToList">
        Add to List
      </button>
    </div>
  </div>
</template>

<script>
import {
  addRestaurantInFavorites,
  getAllFavoritesFromUser,
} from "@/api/favoris";
import { store } from "@/api/store";
import { AccessDeniedError } from "@/api/accessDeniedError";

export default {
  name: "RestaurantFavorites",
  props: ["restaurant"],
  data: function () {
    return {
      favoritesLists: [],
      inFavoritesLists: [],
      notInFavoritesLists: [],
      selectListeId: " ",
      store,
    };
  },
  async created() {
    await this.loadFavoritesLists();
  },
  methods: {
    async loadFavoritesLists() {
      try {
        this.favoritesLists = await getAllFavoritesFromUser({
          userId: this.store.userId,
        });
        this.fileterListsContainsRestaurant();
      } catch (e) {
        if (e instanceof AccessDeniedError) {
          this.$router.push("/login");
        } else {
          console.log(e);
        }
      }
    },
    fileterListsContainsRestaurant() {
      this.inFavoritesLists = [];
      this.notInFavoritesLists = [];
      for (let list of this.favoritesLists) {
        if (
          list.restaurants.some((listRestaurant) => {
            return listRestaurant.id === this.restaurant.id;
          })
        ) {
          this.inFavoritesLists.push(list);
        } else {
          this.notInFavoritesLists.push(list);
        }
      }
    },
    async addToList() {
      try {
        await addRestaurantInFavorites({
          idFavorites: this.selectListeId,
          idRestaurant: this.restaurant.id,
        });
      } catch (e) {
        if (e instanceof AccessDeniedError) {
          this.$router.push("/login");
        } else {
          console.log(e);
        }
      }
      await this.loadFavoritesLists();
    },
  },
};
</script>

<style scoped>
h2 {
  margin-top: 1rem;
}

.add-favorite {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

select {
  width: 20rem;
}

button {
  background-color: #112c86;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}
</style>
