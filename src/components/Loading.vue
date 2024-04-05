<template>
  <div class="loading-spinner" v-if="isLoading">
    <svg class="spinner" viewBox="0 0 50 50">
      <circle
        class="path"
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke-width="5"
      ></circle>
    </svg>
  </div>
</template>

<script>
export default {
  name: "LoadingSpinner",
  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
  },
};
</script>

<style>
.loading-spinner {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.spinner {
  width: 50px;
  height: 50px;
  animation: rotate 2s linear infinite;
}

.path {
  stroke: #333;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}
</style>
