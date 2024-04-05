<template>
  <nav>
    <ul class="pagination justify-content-center" id="pagination">
      <li class="page-item">
        <a class="page-link" @click="updatePage(currentPage - 1)">Previous</a>
      </li>

      <li class="page-item" v-if="currentPage == totalPages && totalPages > 2">
        <a class="page-link" @click="updatePage(currentPage - 2)">{{
          currentPage - 2
        }}</a>
      </li>
      <li class="page-item" v-if="currentPage > 1">
        <a class="page-link" @click="updatePage(currentPage - 1)">{{
          currentPage - 1
        }}</a>
      </li>

      <li class="page-item active" aria-current="page">
        <span class="page-link">{{ currentPage }}</span>
      </li>

      <li class="page-item" v-if="currentPage < totalPages">
        <a class="page-link" @click="updatePage(currentPage + 1)">{{
          currentPage + 1
        }}</a>
      </li>
      <li class="page-item" v-if="currentPage == 1 && totalPages > 2">
        <a class="page-link" @click="updatePage(currentPage + 2)">{{
          currentPage + 2
        }}</a>
      </li>

      <li class="page-item">
        <a class="page-link" @click="updatePage(currentPage + 1)">Next</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "filters",
  props: ["currentPage", "totalPages"],
  methods: {
    updatePage(newPage) {
      if (newPage > 0 && newPage <= this.totalPages) {
        this.$emit("updatePage", newPage);
      }
    },
  },
};
</script>
