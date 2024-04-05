<template>
  <div class="home">
    <filters
      :searchQueryProp="searchQuery"
      :minPriceProp="minPrice"
      :maxPriceProp="maxPrice"
      :genreFilterProp="genreFilter"
      :nearProp="near"
      @updateGenre="updateGenre"
      @updatePrice="updatePrice"
      @updateQuery="updateQuery"
      @updateMode="updateMode"
      @updateNear="updateNear"
    ></filters>
    <div class="list-restaurants">
      <MapHomePage
        v-if="mapMode"
        :key="restaurants"
        :restaurants="restaurants"
      ></MapHomePage>
      <div
        v-else
        v-for="restaurant in restaurants"
        :key="restaurant.id"
        class="restaurant-items"
        :style="{ backgroundImage: `url(${restaurant.pictures[0]})` }"
      >
        <div class="slide-menu" @click="showMoreInfo(restaurant.id)"></div>
        <p class="restaurant-title">
          {{ restaurant.name }}
        </p>
        <p class="restaurant-rating">
          {{ convertRatingToStars(restaurant.rating) }}✩
          <br />
          {{ convertPriceToDollarsAffi(restaurant.price_range) }}
        </p>
        <button
          type="button"
          class="btn btn-custom"
          data-bs-toggle="modal"
          data-bs-target="#visitModal"
          @click="openModal(restaurant.id)"
        >
          Share my visit
        </button>
      </div>
      <page-nav
        :currentPage="currentPage"
        :totalPages="totalPages"
        @updatePage="updatePage"
      ></page-nav>
      <Modale id="visitModal"></Modale>
    </div>
  </div>
</template>

<script>
import { getFilteredRestaurant } from "@/api/restaurant.js";
import Modale from "@/components/modale/Modale.vue";
import Filters from "@/components/home/Filters.vue";
import { store } from "@/api/store.js";
import PageNav from "@/components/home/PageNav.vue";
import MapHomePage from "@/components/map/MapHomePage.vue";
import {AccessDeniedError} from "@/api/accessDeniedError";
export default {
  name: "home",
  components: {
    Modale,
    Filters,
    PageNav,
    MapHomePage,
  },
  data: function () {
    return {
      restaurants: [],
      allRestaurantsList: [],
      currentPage: 1,
      totalPages: 5,
      rowPerPage: 5,
      store,
      genreFilter: "",
      searchQuery: "",
      minPrice: 1,
      maxPrice: 5,
      mapMode: false,
      near: false,
      latitudeUser: 46.829853, //latitude de la ville de Québec
      longitudeUser: -71.254028, //longitude de la ville de Québec
    };
  },
  created() {
  if (this.$route.query.genre) {
    this.genreFilter = this.$route.query.genre;
  }
  if (this.$route.query.near === 'true') {
    this.near = true;
  } else if (this.$route.params.query != null) {
    this.searchQuery = this.$route.params.query;
  }
},
  async mounted() {
    this.findUserLocation();
    await this.updateRestaurants();
  },
  methods: {
    async updateRestaurants() {
      try {
        var query = "&page=" + (this.currentPage - 1);
        query += "&price_range=" + this.priceRangeForQuery();
        if (this.genreFilter != "") {
          query += "&genres=" + this.genreFilter;
        }
        if (this.searchQuery != "") {
          query += "&q=" + this.searchQuery;
        }
        if (this.near) {
          query += "&lon=" + this.longitudeUser.toString();
          query += "&lat=" + this.latitudeUser.toString();
        }
        try {
          const result = await getFilteredRestaurant(query);
          this.restaurants = result.items;
          this.totalPages = Math.ceil(result.total / this.rowPerPage);
          if (this.totalPages < this.currentPage && this.currentPage != 1) {
            this.currentPage = this.totalPages;
            if (this.currentPage == 0) {
              this.currentPage = 1;
            }
            await this.updateRestaurants();
          }
        } catch (e) {
          if (e instanceof AccessDeniedError) {
            this.$router.push('/login');
          } else {
            console.log(e);
          }
        }
      } catch (e) {
        console.log(e);
      }
    },

    priceRangeForQuery() {
      let range = this.minPrice;
      for (
        let i = parseInt(this.minPrice) + 1;
        i <= parseInt(this.maxPrice);
        i++
      ) {
        range += "," + i;
      }
      return range;
    },

    topPage() {
      window.scrollTo(0, 0);
    },

    convertRatingToStars(rating) {
      return "★".repeat(rating) + "✩".repeat(5 - rating);
    },
    convertPriceToDollarsAffi(price) {
      return "$".repeat(price);
    },

    convertPriceToDollars(min, max) {
      let minDollars = "$".repeat(min);
      let maxDollars = "$".repeat(max);
      return `${minDollars} - ${maxDollars}`;
    },

    showMoreInfo(idRestaurant) {
      this.$router.push("restaurant/" + idRestaurant);
      this.topPage();
    },

    updatePage(newPage) {
      this.currentPage = newPage;
      this.updateRestaurants();
    },

    openModal(id) {
      this.store.currentRestaurant = id;
    },

    updateGenre(newGenre) {
      this.genreFilter = newGenre;
      this.updateRestaurants();
    },
    updatePrice(newMin, newMax) {
      this.minPrice = newMin;
      this.maxPrice = newMax;
      this.updateRestaurants();
    },
    updateQuery(newQuery) {
      this.searchQuery = newQuery;
      this.updateRestaurants();
    },
    updateMode(newMode) {
      if (newMode == "Map") {
        this.mapMode = true;
      } else {
        this.mapMode = false;
      }
    },
    updateNear(newNear) {
      this.near = newNear;
      this.updateRestaurants();
    },
    findUserLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          this.geolocationSuccess,
          this.geolocationFailure,
        );
      }
    },
    geolocationSuccess(position) {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      this.latitudeUser = latitude;
      this.longitudeUser = longitude;
    },
    geolocationFailure() {},
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap");

.home {
  display: flex;
  flex-direction: column;
}

#app, html, body {
  height: 100%;
  background-color: #eee;
}

#pagination {
  margin: 10px;
  margin-bottom: 20px;
}

.pagination {
  padding-bottom: 20px;
}

.pagination .page-item.active .page-link {
  background-color: #112c86;
  color: white;
}

.pagination .page-link:hover {
  background-color: rgb(152, 187, 223);
  color: white;
}

.restaurant-title {
  font-family: "Roboto", sans-serif;
  font-size: 3vw;
  text-align: left;
  margin-bottom: -1%;
}

.restaurant-adress {
  font-style: oblique;
  font-size: 0.56vw;
}

.list-restaurants {
  max-width: 100%;
  height: 100%;
  flex: 80%;
  display: table-row;
  text-align: center;
  padding-right: 10%;
  padding-left: 30%;
}

.restaurant-items {
  font-family: Arial, Helvetica, sans-serif;
  font-size: larger;
  text-align: left;
  flex-grow: 1;
  justify-content: flex-end;
  position: relative;
  border: 7px solid black;
  border-radius: 20px;
  margin: 2%;
  background-color: lightgrey;
  overflow: hidden;
  width: 97%;
  padding-left: 5%;
  white-space: nowrap;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-blend-mode: soft-light;
  aspect-ratio: 3.8;
  transition: 250ms;
}

.restaurant-items:hover {
  transform: translateY(-3px);
}

.restaurant-rating {
  font-size: 1.3vw;
}

/* The blue sliding thing on the right */
.slide-menu {
  float: right;
  font-size: 1vw;
  background: #112c86;
  width: 80%;
  height: 100%;
  position: relative;
  left: 55%;
  z-index: 5;
  box-shadow: -7px 0px 7px 0px rgba(0, 0, 0, 0.2);
  color: #222;
  padding-left: 100px;
  padding-top: 5%;
  text-align: center;
  font-family: "Roboto", sans-serif;
  cursor: pointer;
  transition: 250ms;
}

.slide-menu:hover,
.slide-menu:focus {
  transform: translate3d(-10%, 0, 0);
  background: #39b3b8;
  transition: 350ms;
}

.slide-menu::before {
  content: "⫸";
  position: absolute;
  top: 50%;
  left: 8%;
  font-size: 5vw;
  color: #fff;
  transform: translateY(-50%);
  transition: 250ms;
}

.slide-menu:hover::before {
  content: "Go to this\A restaurant";
  white-space: pre;
  text-align: left;
  font-size: 2.2vw;
}

.filter-section {
  margin-bottom: 20px;
}

.look-restaurant {
  background-color: #f5ebeb;
  border: 2px solid #112c86;
  border-radius: 30px;
  box-shadow: 4px 4px 0 0 #112c86;
  color: black;
  cursor: pointer;
  display: inline-block;
  font-size: 18px;
  font-family: "Roboto", sans-serif;
  padding: 0 18px;
  line-height: 50px;
  text-align: center;
  text-decoration: none;
  transition: 200ms;
}

.look-restaurant:active {
  transform: translate(2px, 2px);
}

.btn-custom {
  background-color: #112c86;
  border-color: #112c86;
  color: #ffffff;
  font-size: 1vw;
}

.btn-custom:hover {
  background-color: #39b3b8;
  border-color: #39b3b8;
}

.filter-toggle-button {
  display: none;
}
@media (max-width: 768px) {
  .restaurant-title {
    margin-bottom: 1px;
    font-size: 4vw !important;
  }

  .pagination{
    padding-left: 40%;
  }

  .filters {
    display: none;
    width: 85%;
    background-color: rgba(255, 255, 255, 1);
    z-index: 1003;
    position: fixed;
    margin-top: 16%;
    max-width: 100vw;
    left: 7%;
  }

  .filter-section {
    margin-bottom: 10px;
    font-size: 1em;
  }

  .filters.show {
    display: block;
  }

  .filter-toggle-button {
    display: block;
    position: relative;
    margin-top: 3%;
    margin-bottom: -15%;
    z-index: 1001;
    background-color: #112c86;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 16px;
    left : 40%;
  }

  .filter-toggle-button:hover {
    background-color: #0a1f33;
  }

  .list-restaurants {
    padding-top: 15%;
  }

  .slide-menu::before {
    font-size: 9vw;
  }

  .slide-menu:hover::before {
    content: "Go";
    white-space: pre;
    text-align: left;
    transition: 250ms;
    font-size: 10vw;
  }

  .list-restaurants {
    padding-left: 5%;
    padding-right: 5%;
  }

  .restaurant-items {
    margin: 5% 0;
    height: 110px;
    width: 90%;
    left : 1%;
  }

  .restaurant-rating {
    font-size: 3vw !important;
    margin-bottom: -1%;
  }

  .pagination {
    justify-content: center;
    width: 50%;
    padding-bottom: 20px;
  }

  .btn-custom {
    background-color: #112c86;
    border-color: #112c86;
    color: #ffffff;
    font-size: 2vw;
  }
}
</style>
