<template>
  <div class="area-container">
    <div>
      <img
        class="logo"
        src="../assets/logo_UFood.svg"
        width="260"
        height="260"
        alt="App logo"
      />

      <div v-if="store.firstAccess" class="firstAccess">
        <h1 v-if="isCreating">Welcome to UFood</h1>
        <p>
          Do you already have an account here?
        </p>
        <div>
          <button @click="setupFirstAccess(true)" class="btn btn-primary">Yes</button>
          <button @click="setupFirstAccess(false)" class="btn btn-primary">No</button>
        </div>
      </div>
      <div v-else>
        <h1 v-if="isCreating">Create account</h1>
        <h1 v-if="!isCreating">Sign in</h1>

        <label v-if="isCreating" for="name" class="form-label">Your name :</label>
        <input v-if="isCreating" v-model="inputName" name="name" id="name" class="form-control" />

        <label for="email" class="form-label">Your email :</label>
        <input v-model="inputEmail" type="email" name="email" id="email" class="form-control" />

        <label for="password" class="form-label">Your password :</label>
        <input v-model="inputPassword" type="password" name="password" id="password" class="form-control" />

        <p v-if="error !== null && error.length > 0" class="alert alert-danger" role="alert">{{error}}</p>
        <p v-if="info !== null && info.length > 0" class="alert alert-success" role="alert">{{info}}</p>

        <button v-if="isCreating" @click="createAccount" class="btn btn-primary">Create Account</button>
        <button v-if="isCreating" @click="switchCreateAccount" class="btn btn-secondary">Cancel</button>
        <button v-if="!isCreating" @click="doLogin" class="btn btn-primary">Login</button>
        <button v-if="!isCreating" @click="switchCreateAccount" class="btn btn-secondary">Create Account</button>
      </div>
    </div>
  </div>
</template>

<script>
import * as session from "@/api/session";
import {store} from "@/api/store";

export default {
  name: "Login",
  data: function () {
    return {
      store,
      isCreating : false,

      error : null,
      info : null,
      inputName : "",
      inputEmail : "",
      inputPassword : ""
    };
  },
  methods: {
    clearResults() {
      this.error = null;
      this.info = null;
    },
    async createAccount() {
      this.clearResults();

      if (this.inputName.length < 1) {
        this.error = "Name must not be empty.";
      } else if (this.inputEmail.length < 1) {
        this.error = "Email must not be empty.";
      } else if (this.inputPassword.length < 1) {
        this.error = "Password must not be empty.";
      } else {
        try {
          await session.signup(this.inputName, this.inputEmail, this.inputPassword);

          this.info = "Account successfully created.";
          this.isCreating = false;
        }
        catch (error) {
          this.error = error.message;
        }
      }
    },
    async switchCreateAccount() {
      this.isCreating = !this.isCreating;
    },
    async doLogin() {
      this.clearResults();

      if (this.inputEmail.length < 1) {
        this.error = "Email must not be empty.";
      } else if (this.inputPassword.length < 1) {
        this.error = "Password must not be empty.";
      } else {
        try {
          await session.login(this.inputEmail, this.inputPassword);
          this.info = "Login successful.";

          this.$router.push('/');
        }
        catch (error) {
          this.error = error.message;
        }
      }
    },
    setupFirstAccess(haveAnAccount) {
      this.store.firstAccess = false;
      this.isCreating = !haveAnAccount;
    }
  },
  async created() {
    this.clearResults();

    if (session.getToken() === undefined && this.store.userId !== null) {
      this.store.userId = null;
    }
  }
}
</script>

<style scoped>
  .area-container {
    --page-background-color: #eee;
    --area-color: white;
    --area-margin: 15px;
    --area-padding: 25px;
    --area-border-radius: 30px;

    width: 100%;
    background-color: var(--page-background-color);

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .area-container > * {
    max-width: 50rem;
    width: 100%;

    display: flex;
    flex-direction: column;


    font-family: Arial, Helvetica, sans-serif;
    border: 3px solid black;

    background-color: var(--area-color);
    border-radius: var(--area-border-radius);
    margin: var(--area-margin);
    padding: var(--area-padding);
  }

  label, button, p {
    margin-top: 1rem;
    margin-right: 1rem;
  }
  img {
    align-self: center;
    margin-bottom: 1rem;
  }

  .firstAccess {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
</style>
