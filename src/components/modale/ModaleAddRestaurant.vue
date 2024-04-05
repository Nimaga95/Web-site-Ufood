<template>
  <div
    class="modal fade"
    id="addRestaurantModal"
    tabindex="-1"
    role="dialog"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="addRestaurantModalLabel">
            Add a restaurant
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeModale()"
          ></button>
        </div>
        <form id="modal-form" @submit="addRestaurant()">
          <div class="modal-body">
            <label for="autocompleteInput" class="form-label"
              >Restaurant name</label
            >
            <div class="input-group">
              <input
                type="text"
                class="form-control autocomplete"
                id="autocomplete-Input"
                aria-describedby="inputGroupPrepend2"
                required
              />
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="closeModale()"
            >
              Close
            </button>
            <button
              type="submit"
              :class="btnClass"
              id="button-save-restaurant"
              :disabled="btnDisabled"
            >
              {{ btnMessage }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { getAllRestaurants } from "../../api/restaurant.js";
import Autocomplete from "bootstrap5-autocomplete";
import { addRestaurantInFavorites } from "../../api/favoris.js";
import { store } from "@/api/store";
import { AccessDeniedError } from "@/api/accessDeniedError";
export default {
  name: "ModaleAddRestaurant",
  data: function () {
    return {
      restaurantsList: [],
      store,
      restaurantSelected: "",
      btnClass: {
        btn: true,
        "btn-primary": true,
        "btn-success": false,
      },
      btnMessage: "Add restaurant",
      btnDisabled: false,
    };
  },
  async mounted() {
    await this.createList();
    this.generateAutoComplete();
  },
  methods: {
    async createList() {
      try {
        const restaurants = await getAllRestaurants();
        restaurants.forEach((element) => {
          this.restaurantsList.push({
            name: element["name"],
            id: element["id"],
          });
        });
      } catch (e) {
        if (e instanceof AccessDeniedError) {
          this.$router.push("/login");
        } else {
          console.log(e);
        }
      }
    },
    generateAutoComplete() {
      Autocomplete.init("input.autocomplete", {
        items: this.restaurantsList,
        valueField: "id",
        labelField: "name",
        highlightTyped: true,
        onSelectItem: this.onSelectRestaurant,
      });
    },
    onSelectRestaurant(resto) {
      this.restaurantSelected = resto;
    },
    async addRestaurant() {
      const restaurantId = this.restaurantSelected.id;
      try {
        await addRestaurantInFavorites({
          idFavorites: this.store.favoriteId,
          idRestaurant: restaurantId,
        });
        this.btnMessage = "Visit saved";
        this.btnClass["btn-success"] = true;
        this.btnDisabled = true;
      } catch (e) {
        if (e instanceof AccessDeniedError) {
          this.$router.push("/login");
        } else {
          console.log(e);
        }
      }
    },
    closeModale() {
      this.restaurantSelected = "";
      this.btnMessage = "Add restaurant";
      this.btnClass["btn-success"] = false;
      this.btnDisabled = false;
      this.$emit("addedRestaurant");
    },
  },
};
</script>

<style scoped></style>
