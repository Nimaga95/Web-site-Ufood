<template>
  <nav class="navbar navbar-expand-lg bg-dark navbar-dark">
    <div class="container-fluid">
      <a class="navbar-brand p-0" href="#">
        <img class="logo" src="../assets/logo-white.svg" width="100" height="100" alt="App logo"/>
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <form class="d-flex" role="search" v-on:submit="search">
          <input
            type="search"
            v-model="searchQuery"
            v-on:keyup.enter="search"
            placeholder="Search your taste..."
            class="form-control autocomplete"
            id="autocomplete-Input"
            aria-describedby="inputGroupPrepend2"
          />
        </form>
        <div class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle user-menu"
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <img v-if="isLogin"
                 id="icon-user"
                 src="https://img.icons8.com/material/24/FFFFFF/checked-user-male--v2.png"
                 width="24"
                 height="24"
                 alt="User profile"
            />
            <img v-else
              id="icon-user"
              src="https://img.icons8.com/material-sharp/24/FFFFFF/user.png"
              width="24"
              height="24"
              alt="User profile"
            />
            <p>Profile</p>
          </a>
          <ul class="dropdown-menu dropdown-menu-lg-end">
            <li v-if="isLogin">
              <a
                class="dropdown-item"
                @click="
                  $router.push('/user');
                  showRecentlyVisited();
                "
                >Profile</a
              >
            </li>
            <li>
              <a class="dropdown-item" v-on:click="changeIcon()">
                {{ showLoginOrLogout() }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { store } from "@/api/store";

import { getAllRestaurants } from "@/api/restaurant";

import Autocomplete from "bootstrap5-autocomplete";
import {logout} from "@/api/session";
import * as session from "@/api/session";

export default {
  name: "navigation",
  data: function () {
    return {
      restaurantsList: [],
      store,
      searchQuery: "",
    };
  },

  async created() {
    if(await session.validLogin())
    {
      await this.createList();
      this.generateAutoComplete();
    }
  },
  computed: {
    isLogin() {
      return this.store.userId !== null;
    }
  },
  methods: {
    async createList() {
      const restaurants = await getAllRestaurants();
      restaurants.forEach((element) => {
        this.restaurantsList.push({
          name: element["name"],
          id: element["id"],
        });
      });
    },
    changeIcon() {
      if (this.isLogin) {
        try {
          logout();
        } catch (e) {
          console.log(e);
        }
      }
      this.$router.push('/login');
    },

    onSelectItem(resto){
      this.searchQuery = resto.name
    },

    generateAutoComplete() {
      Autocomplete.init("#autocomplete-Input", {
        items: this.restaurantsList,
        valueField: "id",
        labelField: "name",
        highlightTyped: true,
        onSelectItem: this.onSelectItem,
      });
    },

    showLoginOrLogout() {
      if (this.isLogin) {
        return "Log out";
      } else {
        return "Log in";
      }
    },

    showRecentlyVisited() {
      this.store.showVisit = true;
    },

    search() {
      this.$router.push("/" + this.searchQuery);
    }
  },
};
</script>

<style>
li:hover {
  cursor: pointer;
}

nav p {
  color: white;
  margin: 0;
}

form {
  flex-grow: 1;
}

.user-menu {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
}

.input-search {
  padding-left: 30px;
  background: white url("../assets/search.svg") no-repeat left;
  background-position-x: 8px;
  border-radius: 2rem;
}

@media screen and (max-width: 992px) {
  .input-search {
    margin-top: 0.5rem;
  }

  .user-menu {
    flex-direction: row;
  }

  .nav-link {
    padding-left: 0;
  }
}
</style>
