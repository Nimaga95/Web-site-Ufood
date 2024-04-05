<template>
  <div>
    <div v-if="this.userFavorites.length === 0">No favorites!</div>
    <div v-for="favorite in userFavorites" :key="favorite.id">
      <FavoritesItem
        :favorite="favorite"
        :readOnly="readOnly"
        @addedRestaurant="reloadFavorites()"
        @deletedRestaurant="reloadFavorites()"
      ></FavoritesItem>
    </div>
  </div>
</template>

<script>
import { getAllFavoritesFromUser } from "@/api/favoris";
import FavoritesItem from "@/components/favorites/FavoritesItem.vue";
import {AccessDeniedError} from "@/api/accessDeniedError";

export default {
  components: { FavoritesItem },

  async mounted() {
    await this.loadFavorites();
  },

  name: "FavoritesItems",

  props: ["userId", "readOnly"],

  data: function () {
    return {
      userFavorites: {},
    };
  },

  methods: {
    async loadFavorites() {
      try {
        this.userFavorites = await getAllFavoritesFromUser({
          userId: this.userId,
      });
      } catch (e) {
        if (e instanceof AccessDeniedError) {
          this.$router.push('/login');
        } else {
          console.log(e);
        }
      }
    },
    async reloadFavorites() {
      this.userFavorites = {};
      await this.loadFavorites();
    },
  },
};
</script>

<style scoped></style>
