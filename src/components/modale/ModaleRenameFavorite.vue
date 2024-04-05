<template>
  <div class="modal fade" id="renameFavoriteModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="renameModalLabel">Rename favorite list</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <form id="modal-form" @submit="renameFavoritesList()">
          <div class="modal-body">
            <label for="list-name" class="form-label">New list name*</label>
            <div class="input-group">
              <input type="text" class="form-control" aria-describedby="inputGroupPrepend2" v-model="newName" required/>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModale()">Close</button>
            <button v-if="!rename" type="submit" class="btn btn-primary">Rename</button>
            <button v-if="rename" type="submit" class="btn btn-primary btn-success" disabled>Successfully renamed</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { renameFavoritesList } from "@/api/favoris";
import { store } from "@/api/store";
import {AccessDeniedError} from "@/api/accessDeniedError";

export default {
  name: "ModaleRenameFavorite",

  data: function () {
    return {
      newName: "",
      rename: false,
      store,
    };
  },

  methods: {
    async renameFavoritesList() {
      try {
        await renameFavoritesList({
          id: this.store.favoriteId,
          name: this.newName,
          owner: this.store.owner,
        });

        this.rename = true;
      } catch (e) {
        if (e instanceof AccessDeniedError) {
          this.$router.push('/login');
        } else {
          console.log(e);
        }
      }
    },

    closeModale() {
      this.rename = false;
      this.newName = "";
    },
  },
};
</script>
