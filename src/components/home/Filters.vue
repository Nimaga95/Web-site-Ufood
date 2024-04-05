<template>
  <div>
    <button @click="toggleFilters" class="filter-toggle-button">Filters</button>
    <div :class="['filters', { show: showFilters }]">
      <h2>Filters</h2>

      <div class="filter-section">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search..."
          class="form-control autocomplete"
          id="autocomplete-Input-name-filter"
          aria-describedby="inputGroupPrepend2"
        />
      </div>

      <div class="filter-section">
        Price range:<br />
        <div class="multi-range-slider">
          Minimum :
          {{ convertPriceToDollarsAffi(minPrice) }}
          <input
            type="range"
            v-model="minPrice"
            :min="minLimit"
            :max="maxLimit"
            class="lower"
          />
          Maximum :
          {{ convertPriceToDollarsAffi(maxPrice) }}
          <input
            type="range"
            v-model="maxPrice"
            :min="minLimit"
            :max="maxLimit"
            class="upper"
          />
        </div>
      </div>
      <div class="filter-section">
        Genre:<br />
        <input type="text" v-model="genreFilter" placeholder="Choose your genre"/>
      </div>
      <div class="d-flex">
        <span>List &nbsp;</span>
        <div class="form-check form-switch">
          <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckMap" @change="changeMode">
        </div>
        <span>Map</span>
      </div>
      <div>
        <input class="form-check-input" type="checkbox" v-model="near" id="flexCheckDefault" @click="toggleNear">

        <label class="form-check-label" for="flexCheckDefault">
          &nbsp;Restaurants near me
        </label>
      </div>
      <div class="filter-section validate-section">
        <button class="validate-button" @click="toggleFilters">Apply</button>
      </div>
    </div>
  </div>
</template>

<script>
import Autocomplete from "bootstrap5-autocomplete";

import { getAllRestaurants } from "@/api/restaurant.js";

export default {
  name: "filters",
  props: [
    "showFiltersProp",
    "searchQueryProp",
    "minPriceProp",
    "maxPriceProp",
    "genreFilterProp",
    "nearProp"
  ],
  data: function () {
    return {
      showFilters: false,
      searchQuery: this.searchQueryProp,
      minPrice: this.minPriceProp,
      maxPrice: this.maxPriceProp,
      genreFilter: this.genreFilterProp,
      allRestaurantsList: [],
      minLimit: 1,
      maxLimit: 5,
      mode: "List",
      near: this.nearProp,
    };
  },
  async created() {
    const restaurants = await getAllRestaurants();
      restaurants.forEach((element) => {
        this.allRestaurantsList.push({
          name: element["name"],
          id: element["id"],
        });
      })
    this.generateAutoComplete();
  },
  watch: {
    genreFilter(val) {
      this.$emit("updateGenre", val);
    },
    minPrice(val) {
      if (val > this.maxPrice) {
        this.maxPrice = val;
      }
      this.$emit("updatePrice", this.minPrice, this.maxPrice);
    },
    maxPrice(val) {
      if (this.minPrice > val) {
        this.minPrice = val;
      }
      this.$emit("updatePrice", this.minPrice, this.maxPrice);
    },
    searchQuery(val) {
      this.$emit("updateQuery", val);
    },
    nearProp(newVal) {
    this.near = newVal;
  },
  },
  methods: {
    onSelectItem(resto){
      console.log(resto)
      this.searchQuery = resto.name
      console.log(this.searchQuery)
    },
    generateAutoComplete() {
      Autocomplete.init("#autocomplete-Input-name-filter", {
        items: this.allRestaurantsList,
        valueField: "id",
        labelField: "name",
        highlightTyped: true,
        onSelectItem: this.onSelectItem,
      });
    },

    toggleFilters() {
      this.showFilters = !this.showFilters;
    },
    convertPriceToDollarsAffi(price) {
      return "$".repeat(price);
    },
    changeMode() {
      if (this.mode == "List") {
        this.mode = "Map";
      } else {
        this.mode = "List";
      }
      this.$emit("updateMode", this.mode);
    },
    toggleNear() {
      this.near = !this.near;
      this.$emit("updateNear", this.near);
    },
  },
};
</script>

<style>
.filters {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 5%;
  flex: 20%;
  margin-right: 20%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 1);
  position: fixed;
  top: 17%;
  left: 1%;
  flex-direction: column;
  max-width: 20vw;
}

.filter-section {
  margin-bottom: 20px;
  font-size: 1.2vw;
}

.filter-section input[type="range"] {
  width: 100%;
  margin-top: 10px;
}

.filter-section input[type="checkbox"] {
  margin-left: 10px;
}

.validate-section {
  display: none;
}

@media (max-width: 768px) {
  .validate-section {
    display: block;
  }

  .validate-button {
    background-color: #112c86;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 5%;
    width: 30%;
  }
}
</style>
