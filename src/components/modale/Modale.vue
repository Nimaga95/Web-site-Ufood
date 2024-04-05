<template>
  <div
    class="modal fade"
    id="visitModal"
    tabindex="-1"
    role="dialog"
    aria-labelledby="visitModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 v-if="visit === null" class="modal-title" id="visitModalLabel">
            Please tell us more about your visit
          </h5>
          <h5 v-else class="modal-title" id="visitModalLabel">Visit Details</h5>
          <button
            type="button"
            class="close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeModale()"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <form id="modal-form" @submit="saveVisit()">
          <div class="modal-body">
            <label for="datetime-input" class="form-label"
              >Date and time of your visit</label
            >
            <div>
              <p v-if="visit !== null">{{existingVisitDate}}</p>
              <flat-pickr v-else
                v-model="visitDate"
                :config="dateConfig"
                id="datetime-input"
                class="form-control"
                placeholder="Visit Time"
                required
              />
            </div>

            <label for="visit-rating" class="form-label"
              >Rating {{ visitRating }} ★</label
            >

            <input
              v-if="visit === null"
              type="range"
              class="form-range"
              min="0.1"
              max="5"
              step="0.1"
              id="visit-rating"
              v-model="visitRating"
            />
            <input
              v-else
              disabled
              type="range"
              class="form-range"
              min="0.1"
              max="5"
              step="0.1"
              id="visit-rating"
              v-model="visitRating"
            />

            <label for="visit-comment" class="form-label">Comment</label>

            <textarea
              v-if="visit === null"
              id="visit-comment"
              placeholder="tell us more about your visit"
              rows="5"
              cols="30"
              v-model="visitComment"
            ></textarea>
            <textarea
              v-else
              readonly
              id="visit-comment"
              placeholder="tell us more about your visit"
              rows="5"
              cols="30"
              v-model="visitComment"
            ></textarea>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-secondary"
              data-bs-dismiss="modal"
              @click="closeModale()"
            >
              Close
            </button>
            <button
              v-if="visit === null"
              type="submit"
              :class="btnClass"
              id="button-save-visit"
              :disabled="btnDisabled"
            >
              {{ btnMessage }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { postVisit } from "../../api/visite.js";
import { store } from "../../api/store.js";
import { AccessDeniedError } from "@/api/accessDeniedError";

export default {
  name: "modale",
  components: {
    flatPickr,
  },
  props: {
    visit: {
      type: Object,
      default: null,
    },
  },
  data: function () {
    return {
      visitRating: 0.1,
      existingVisitDate: null,
      visitDate: null,
      visitLocalDateTime: null,
      visitComment: "",
      btnClass: {
        btn: true,
        "btn-primary": true,
        "btn-success": false,
      },
      btnMessage: "Save visit",
      btnDisabled: false,
      dateConfig: {
        allowInput: true,
        enableTime: true,
        altInput: true,
        altFormat: "Y-m-d H:i",
        dateFormat: "Z",
      },
      store,
    };
  },
  mounted() {
    if (this.visit !== null) {
      this.visitRating = this.visit.rating;
      this.visitComment = this.visit.comment;
      this.visitDate = null;

      // src : https://stackoverflow.com/questions/28760254/assign-javascript-date-to-html5-datetime-local-input
      let dateTime = new Date(this.visit.date);
      this.visitDate = new Date(
        dateTime.getTime() - dateTime.getTimezoneOffset() * 60000,
      )
        .toISOString()
        .slice(0, -1);
      this.existingVisitDate = dateTime.toLocaleString();
    }
  },
  methods: {
    closeModale() {
      if (this.visit === null) {
        this.visitComment = "";
        this.visitRating = 0.1;
        this.visitLocalDateTime = null;
        this.visitDate = null;

        this.btnMessage = "Save visit";
        this.btnClass["btn-success"] = false;
        this.btnDisabled = false;
      }
    },

    async saveVisit() {
      try {
        await postVisit({
          idUser: this.store.userId,
          idRestaurant: this.store.currentRestaurant,
          visitComment: this.visitComment,
          visitRating: this.visitRating,
          visitDate: this.visitDate,
        });

        this.btnMessage = "Visit saved";
        this.btnClass["btn-success"] = true;
        this.btnDisabled = true;
      } catch (e) {
        if (e instanceof AccessDeniedError) {
          this.$router.push("/login");
        } else {
          console.log(e);
        }
      }
    },
  },
};
</script>

<style>
  #visit-comment {
    width: 100%;
  }
</style>
