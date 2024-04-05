<template>
  <div class="col-lg-4">
    <div class="card mb-4">
      <div class="card-body text-center">
        <h2 class="my-3">{{ user.name }}</h2>
        <h4 v-if="rating" class="my-3">Score: {{ user.rating }}</h4>
        <p class="text-muted mb-4">Email: {{ user.email }}</p>
        <div class="d-flex flex-column buttons">
          <button v-if="createFavorite" type="button" class="btn btn-outline-primary btn-blue mb-2" data-bs-toggle="modal" data-bs-target="#createFavorite">
            Create a new favorites list
          </button>
          <button v-if="favoriteList" type="button" @click="showFavorites()" class="btn btn-outline-primary btn-blue mb-2">
            Favorites
          </button>
          <button v-if="recentlyVisited" type="button" @click="showVisit()" class="btn btn-outline-primary btn-blue mb-2">
            Recent visits
          </button>
          <button v-if="followers" type="button" @click="showFollowers()" class="btn btn-outline-primary btn-blue mb-2">
           Followers
          </button>
          <button v-if="following" type="button" @click="showFollowing()" class="btn btn-outline-primary btn-blue">
            Following
          </button>
          <button v-if="unfollow" type="button" @click="unfollowing(); $emit('deleteFollowing');" class="btn btn-outline-danger mb-2">
            Unfollow
          </button>
          <button v-if="follow" type="button" @click="followUser(); $emit('addFollowing');" class="btn btn-outline-success mb-2">
            Follow
          </button>
          <button v-if="profile" type="button" @click="goToProfile()" class="btn btn-outline-secondary">
            Profile
          </button>
          <button v-if="backToMe" type="button" @click="goToMyProfile()" class="btn btn-primary btn-blue mt-4">
            Go back to my profile
          </button>
        </div>
        <ModaleNewFavorites id="createFavorite"></ModaleNewFavorites>
      </div>
    </div>
  </div>
</template>

<script>
import ModaleNewFavorites from "@/components/modale/ModaleNewFavorites.vue";
import { store } from "@/api/store";
import {follow, unfollow} from "@/api/follow";
import {AccessDeniedError} from "@/api/accessDeniedError";

export default {
  name: "UserItem",
  components: {ModaleNewFavorites},
  data() {
    return {
      store,
    }
  },
  props: {
    user: Object,
    rating: {
      type: Boolean,
      default: false,
    },
    recentlyVisited: {
      type: Boolean,
      default: false
    },
    favoriteList: {
      type: Boolean,
      default: false,
    },
    createFavorite: {
      type: Boolean,
      default: false,
    },
    followers: {
      type: Boolean,
      default: false,
    },
    following: {
      type: Boolean,
      default: false,
    },
    unfollow: {
      type: Boolean,
      default: false,
    },
    follow: {
      type: Boolean,
      default: false,
    },
    profile: {
      type: Boolean,
      default: false,
    },
    backToMe: {
      type: Boolean,
      default: false,
    }
  },
  methods: {
    showFavorites() {
      this.store.showFavorite = true;
      this.store.showVisit = false;
      this.store.showFollowers = false;
      this.store.showFollowing = false;
      this.store.search = false;
    },

    showVisit() {
      this.store.showVisit = true;
      this.store.showFavorite = false;
      this.store.showFollowers = false;
      this.store.showFollowing = false;
      this.store.search = false;
    },

    showFollowers() {
      this.store.showVisit = false;
      this.store.showFollowing = false;
      this.store.showFollowers = true;
      this.store.showFavorite = false;
      this.store.search = false;
    },

    showFollowing() {
      this.store.showVisit = false;
      this.store.showFollowing = true;
      this.store.showFollowers = false;
      this.store.showFavorite = false;
      this.store.search = false;
    },

    async unfollowing() {
      try {
        await unfollow(this.user.id);
      } catch (e) {
        if (e instanceof AccessDeniedError) {
          this.$router.push('/login');
        } else {
          console.log(e);
        }
      }
    },

    async followUser() {
      try {
        await follow(this.user.id);
      } catch (e) {
        if (e instanceof AccessDeniedError) {
          this.$router.push('/login');
        } else {
          console.log(e);
        }
      }
    },

    goToProfile() {
      this.showVisit();
      this.store.displayingOther = true;
      this.$router.replace({ path: '/user/'+ this.user.id});
    },

    goToMyProfile() {
      this.store.displayingOther = false;
      this.$router.replace({ path: '/user'});
    }
  }
}
</script>

<style scoped>
.card {
  border-radius: 30px;
  border: 7px solid black;
  width: 100%;
}
.buttons {
  align-items: center;
}
button {
  max-width: 20rem;
  width: 100%;
}

.btn-outline-primary {
  background-color: #ffffff;
  border-color: #112c86;
  color: #112c86;
}
.btn-outline-primary:hover {
  background-color: #112c86;
  border-color: #112c86;
  color: #ffffff;
}
</style>
