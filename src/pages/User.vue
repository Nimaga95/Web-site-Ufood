<template>
  <div class="container py-5">
    <div class="row">
      <UserItem v-if="store.displayingOther" :user="userInfo" :rating="true" :create-favorite="false" :favorite-list="true" :recently-visited="true" :followers="true" :following="true" :backToMe="true"></UserItem>
      <UserItem v-else :user="userInfo" :rating="true" :create-favorite="true" :favorite-list="true" :recently-visited="true" :followers="true" :following="true" :backToMe="false"></UserItem>

      <div v-if="store.showFavorite" class="col-lg-8">
        <div class="favorite-restaurants">
          <h3>Favorites</h3>
          <FavoritesItems :user-id="this.displayingId" :readOnly="this.store.displayingOther"></FavoritesItems>
        </div>
      </div>

      <div v-if="store.showVisit" class="col-lg-8">
        <div class="favorite-restaurants">
          <h3 class="text-center mb-4">Recently visited</h3>
          <div v-if="visitedRestaurants.length === 0" class="align-items-center align-content-center">No recent visits!</div>
          <div v-for="visit in paginatedVisitedRestaurants" :key="visit">
            <RestaurantItem :restaurantId="visit.restaurant_id" :visit="visit" :show-slide="false"></RestaurantItem>
          </div>
        </div>
        <PageNav :currentPage="currentPage" :totalPages="totalPages" @updatePage="updatePage"></PageNav>
      </div>

      <div v-if="store.showFollowers" class="col-lg-8">
        <div class="favorite-restaurants full-width">
          <h3 class="text-center mb-4">Followers</h3>
          <p v-if="followers.length === 0">No follower!</p>
          <div v-for="follower in paginatedFollowers" :key="follower" class="d-flex justify-content-center full-width">
            <UserItem :user="follower" :profile="true" class="full-width"></UserItem>
          </div>
        </div>
        <PageNav :currentPage="currentPageFollowers" :totalPages="totalPagesFollowers" @updatePage="updatePageFollowers"></PageNav>
      </div>

      <div v-if="store.showFollowing" class="col-lg-8">
        <div class="favorite-restaurants">
          <h3 class="text-center mb-4">Followings</h3>
          <div v-if="!store.displayingOther" class="input-group mb-3">
            <input type="text" onfocus="this.value=''" class="form-control" placeholder="Looking for someone to share your taste?" v-model="userSearch">
            <div class="input-group-append">
              <button class="btn btn-outline-secondary" type="button" @click="searchUser()">Search</button>
            </div>
          </div>
          <div v-if="!store.search" class="full-width">
            <p v-if="following.length === 0">No following!</p>
            <div v-for="follow in paginatedFollowing" :key="follow" class="d-flex full-width">
              <UserItem v-if="store.displayingOther" :user="follow" :unfollow="false" :profile="true" @deleteFollowing="reloadFollowing()" class="full-width"></UserItem>
              <UserItem v-else  :user="follow" :unfollow="true" :profile="true" @deleteFollowing="reloadFollowing()" class="full-width"></UserItem>
            </div>
          </div>
          <div v-if="store.search">
            <p v-if="userList.length === 0">No matching result found!</p>
            <div v-for="user in userList" :key="user" class="d-flex full-width">
              <UserItem :user="user" :follow="true" :profile="true" @addFollowing="reloadFollowing()" class="full-width"></UserItem>
            </div>
          </div>
        </div>
        <PageNav :currentPage="currentPageFollowing" :totalPages="totalPagesFollowing" @updatePage="updatePageFollowing"></PageNav>
      </div>

    </div>
  </div>
</template>

<script>
import FavoritesItems from "@/components/favorites/FavoritesItems.vue";
import {getUserInfo, getUsersFiltered} from "@/api/user";
import { getVisitedRestaurant } from "@/api/visite";
import { store } from "@/api/store";
import RestaurantItem from "@/components/restaurant/RestaurantItem.vue";
import PageNav from "@/components/home/PageNav.vue";
import UserItem from "@/components/UserItem.vue";
import {AccessDeniedError} from "@/api/accessDeniedError";

export default {
  name: "user",
  components: {
    UserItem,
    RestaurantItem,
    FavoritesItems,
    PageNav,
  },
  data() {
    return {
      visitedRestaurants: [],
      paginatedVisitedRestaurants: [],
      paginatedFollowers: [],
      paginatedFollowing: [],
      rowPerPage: 3,
      totalPages: 0,
      userInfo: {},
      followers: [],
      following: [],
      userList: {},
      userSearch: '',
      store,
      displayingId: null,
      currentPage: 1,
      currentPageFollowers: 1,
      currentPageFollowing: 1,
      totalPagesFollowing: 0,
      totalPagesFollowers: 0,

    };
  },
  watch: {
    '$route.params': 'loadPage',
  },

  async created() {
    await this.loadPage();
  },

  methods: {
    async loadPage() {
      this.followers = [];
      this.following = [];
      this.store.search = false;

      if (this.$route.params.id) {
        this.displayingId = this.$route.params.id;
      }
      else {
        this.displayingId = this.store.userId;
      }
      try {
        this.userInfo = await getUserInfo(this.displayingId);
      } catch (e) {
        if (e instanceof AccessDeniedError) {
          this.$router.push('/login');
        } else {
          console.log(e);
        }
      }

      try {
        this.visitedRestaurants = await getVisitedRestaurant(this.displayingId);
        this.totalPages = Math.ceil(this.visitedRestaurants.length / this.rowPerPage);

        this.updatePage(1);

        for (let follower of this.userInfo.followers) {
          this.followers.push(follower);
        }

        for (let following of this.userInfo.following) {
          this.following.push(following);
        }

        this.totalPagesFollowers = Math.ceil(this.followers.length / this.rowPerPage);
        this.totalPagesFollowing = Math.ceil(this.following.length / this.rowPerPage);

        this.updatePageFollowers(1);
        this.updatePageFollowing(1);

      } catch (e) {
        if (e instanceof AccessDeniedError) {
          this.$router.push('/login');
        } else {
          console.log(e);
        }
      }
    },
    updatePage(newPage) {
      this.currentPage = newPage;
      const startIdx = (newPage - 1) * this.rowPerPage;
      const endIdx = startIdx + this.rowPerPage;
      this.paginatedVisitedRestaurants = this.visitedRestaurants.slice(startIdx, endIdx);
    },

    updatePageFollowers(newPage) {
      this.currentPageFollowers = newPage;
      const startIdx = (newPage - 1) * this.rowPerPage;
      const endIdx = startIdx + this.rowPerPage;
      this.paginatedFollowers = this.followers.slice(startIdx, endIdx);
    },

    updatePageFollowing(newPage) {
      this.currentPageFollowing = newPage;
      const startIdx = (newPage - 1) * this.rowPerPage;
      const endIdx = startIdx + this.rowPerPage;
      this.paginatedFollowing = this.following.slice(startIdx, endIdx);
    },

    async reloadFollowing() {
      try {
        this.following = [];
        this.userInfo = await getUserInfo(this.displayingId);
        for (let following of this.userInfo.following) {
          this.following.push(following);
        }
        this.store.search = false;
      } catch (e) {
        if (e instanceof AccessDeniedError) {
          this.$router.push('/login');
        } else {
          console.log(e);
        }
      }
    },

    async searchUser() {
      this.store.search = true;
      const query = this.userSearch.split(" ");
      try {
        this.userList = await getUsersFiltered(query);
        for (let user in this.following) {
          this.userList = this.userList.filter(element => element.id !== this.following[user].id);
        }
      } catch (e) {
        if (e instanceof AccessDeniedError) {
          this.$router.push('/login');
        } else {
          console.log(e);
        }
      }
    }
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@700&display=swap");

.recents-restaurants h3 {
  font-size: 3rem;
  color: #112c86;
}

body {
  background-color: #eee;
}

.favorite-restaurants h3 {
  font-size: 2.5rem;
  color: #112c86;
  margin-bottom: 20px;
  text-transform: uppercase;
  font-weight: bold;
  border-bottom: 2px solid #112c86;
  padding-bottom: 10px;
  justify-content: center;
  display: flex;
}
.full-width{
  width: 100%;
}
</style>
