<template>
  <div class="modal fade" id="createFavoritesModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="visitModalLabel">New favorites list</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form id="modal-form" @submit="createFavoritesList()">
          <div class="modal-body">
            <label for="list-name" class="form-label">List name*</label>
            <div class="input-group">
              <input type="text" class="form-control" aria-describedby="inputGroupPrepend2" v-model="nameFavorite" required/>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModale()">Close</button>
            <button v-if="!create" type="submit" class="btn btn-primary">Create list</button>
            <button v-if="create" type="submit" class="btn btn-primary btn-success" disabled>Favorite created</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { createNewFavoritesList } from "@/api/favoris";
import {AccessDeniedError} from "@/api/accessDeniedError";

export default {
  name: "ModaleNewFavorites",

  data: function() {
    return {
      create: false,
      nameFavorite: ""
    };
  },

  methods: {
    async createFavoritesList() {
      try {
        await createNewFavoritesList({
          name: this.nameFavorite,
          owner: "roger@gmail.com",
        });

        this.create = true;
      } catch (e) {
        if (e instanceof AccessDeniedError) {
          this.$router.push('/login');
        } else {
          console.log(e);
        }
      }
    },

    closeModale() {
      this.create = false;
      this.nameFavorite = "";
    },
  },
};
</script>

<style>
.btn-primary {
  background-color: #112c86;
  border-color: #112c86;
}

.btn-primary:hover {
  background-color: #112c86;
  border-color: #112c86;
}
</style>
