<template>
  <div>
    <div id="map"></div>
    <MapPopup
      v-for="restaurant of restaurants"
      :key="restaurant.id"
      :restaurant="restaurant"
      :ref="restaurant.id"
    ></MapPopup>
  </div>
</template>

<script>
import L from "leaflet";
import restoIcon from "../../assets/resto.png";
import personIcon from "../../assets/human.png";
import MapPopup from "./MapPopup.vue";
export default {
  name: "mapHomePage",
  props: {
    restaurants: Object,
  },
  components: {
    MapPopup,
  },
  data: function () {
    return {
      currentMap: null,
      latitudeUser: 46.829853, //latitude de la ville de Québec
      longitudeUser: -71.254028, //longitude de la ville de Québec
    };
  },
  async mounted() {
    this.updateMap();
    this.loadRestaurant();
    this.findUserLocation();
  },
  methods: {
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
      this.addUserToMap();
    },
    geolocationFailure() {
      this.addUserToMap();
    },
    initializeLeafletMap() {
      const map = L.map("map", {
        zoomControl: true,
        zoom: 1,
        zoomAnimation: false,
        fadeAnimation: true,
        markerZoomAnimation: true,
      }).setView([this.latitudeUser, this.longitudeUser], 10);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      this.currentMap = map;
    },
    loadRestaurant() {
      for (const restaurant of this.restaurants) {
        const latitude = restaurant.location.coordinates[1];
        const longitude = restaurant.location.coordinates[0];
        const idRestaurant = restaurant.id;
        const iconResto = L.icon({
          iconUrl: restoIcon,
          iconSize: [32, 32],
        });
        const marker = L.marker([latitude, longitude], {
          icon: iconResto,
        }).addTo(this.currentMap);
        marker.bindPopup(() => this.$refs[idRestaurant][0].$el).openPopup();
        marker.closePopup();
      }
    },
    updateMap() {
      if (this.currentMap != null) {
        this.currentMap.remove();
        this.initializeLeafletMap();
      } else {
        this.initializeLeafletMap();
      }
    },
    addUserToMap() {
      const iconPerson = L.icon({
        iconUrl: personIcon,
        iconSize: [32, 32],
      });
      const marker = L.marker([this.latitudeUser, this.longitudeUser], {
        icon: iconPerson,
      }).addTo(this.currentMap);
      marker.bindPopup("You").openPopup();
      this.currentMap.setView([this.latitudeUser, this.longitudeUser], 10);
    },
  },
};
</script>

<style scoped>
#map {
  font-family: Arial, Helvetica, sans-serif;
  font-size: larger;
  text-align: left;
  flex-grow: 1;
  justify-content: flex-end;
  position: relative;
  border: 7px solid;
  border-radius: 20px;
  border-color: black;
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

@media (max-width: 768px) {
  #map {
    margin: 5% 0;
    height: 30rem;
    width: 100%;
    padding-left: 5%;
    padding-right: 5%;
  }
}
</style>
