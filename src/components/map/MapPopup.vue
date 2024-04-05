<template>
  <button class="btn btn-custom" @click="routing()">
    {{ restaurant.name }}
  </button>
</template>

<script>
export default {
  name: "mapHomePage",
  props: ["restaurant"],
  methods: {
    routing() {
      this.$router.push("restaurant/" + this.restaurant.id);
    },
  },
};
</script>
