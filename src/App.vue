<template>
  <div id="app">
    <nav-menu></nav-menu>
    <router-view class="page" :key="$route.fullPath"></router-view>
  </div>
</template>

<script>
import Navigation from "@/components/Navigation";
import "leaflet/dist/leaflet.css";
import "flatpickr/dist/flatpickr.css";
export default {
  name: "app",
  components: {
    "nav-menu": Navigation,
  },
};
</script>

<style>
.page {
  height: 100%;
}
</style>
