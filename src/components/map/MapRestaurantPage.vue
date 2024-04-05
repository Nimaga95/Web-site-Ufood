<template>
  <div class="map-container">
    <div id="map"></div>
    <input
      type="text"
      id="starting-address"
      placeholder="Enter your current location"
      v-model="addressInput"
    />
    <button
      type="button"
      class="btn btn-primary"
      id="button-direction"
      @click="changeUserLocation"
    >
      Get directions
    </button>
    <div id="directions">
      <li
        v-for="direction in directionList"
        :key="direction"
        class="list-group-item"
      >
        {{ direction }}
      </li>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import restoIcon from "../../assets/resto.png";
import personIcon from "../../assets/human.png";
import { setLocation, getLocation, getDirection } from "../../api/mapORS.js";
export default {
  name: "mapRestaurantPage",
  props: {
    restaurant: Object,
  },
  data: function () {
    return {
      currentMap: null,
      addressInput: "",
      directionList: [],
    };
  },
  async mounted() {
    this.changeDirection();
    this.updateMap();
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
      this.addUserToMap(latitude, longitude);
      this.loadUserLocation(latitude, longitude);
    },
    geolocationFailure() {},
    initializeLeafletMap() {
      const latitude = this.restaurant.location.coordinates[1];
      const longitude = this.restaurant.location.coordinates[0];
      const restaurantName = this.restaurant.name;
      const map = L.map("map").setView([latitude, longitude], 10);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);
      const iconResto = L.icon({
        iconUrl: restoIcon,
        iconSize: [32, 32],
      });
      const marker = L.marker([latitude, longitude], { icon: iconResto }).addTo(
        map,
      );
      marker.bindPopup(`${restaurantName}`).openPopup();
      this.currentMap = map;
    },
    async addUserToMap(latitude, longitude) {
      const iconPerson = L.icon({
        iconUrl: personIcon,
        iconSize: [32, 32],
      });
      const marker = L.marker([latitude, longitude], {
        icon: iconPerson,
      }).addTo(this.currentMap);
    },
    async loadUserLocation(latitude, longitude) {
      const address = await setLocation(latitude, longitude);
      this.addressInput = address;
      const coordinates = [longitude, latitude];
      this.displayDirection(coordinates, this.restaurant.location.coordinates);
    },
    async changeUserLocation() {
      console.log(this.addressInput);
      const address = this.addressInput;
      this.changeDirection();
      this.updateMap();
      const coordinates = await getLocation(address);
      const latitude = coordinates[1];
      const longitude = coordinates[0];
      this.addUserToMap(latitude, longitude);
      await this.displayDirection(
        coordinates,
        this.restaurant.location.coordinates,
      );
    },
    async displayDirection(startAddress, endAddress) {
      const { polylinePoints, steps } = await getDirection(
        startAddress,
        endAddress,
      );
      L.polyline(polylinePoints).addTo(this.currentMap);
      for (let i = 0; i < steps.length; i++) {
        this.directionList.push(steps[i]["instruction"]);
      }
    },
    changeDirection() {
      this.directionList.length = 0;
    },
    updateMap() {
      if (this.currentMap != null) {
        this.currentMap.remove();
        this.initializeLeafletMap();
      } else {
        this.initializeLeafletMap();
      }
    },
  },
};
</script>

<style>
.map-container {
  width: 100%;
  height: 100%;
  background-color: white;
}
#map {
  width: 100%;
  height: 28rem;
  max-height: 80vh;
}

#directions {
  max-height: 20rem;
  overflow: scroll;
}

#starting-address {
  width: 50%;
  height: 3rem;
}

#button-direction {
  width: 50%;
  height: 3rem;

  background-color: #112c86;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
}
</style>
