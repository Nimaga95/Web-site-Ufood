import { reactive } from "vue";

export const store = reactive({
  currentRestaurant: 0,
  favoriteId: 0,
  owner: 0,
  userId: null,
  showVisit: true,
  showFavorite: false,
  showFollowers: false,
  showFollowing: false,
  search: false,
  firstAccess: true,
  displayingOther: false
});
