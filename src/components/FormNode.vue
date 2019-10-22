<template>
  <form action>
    <notification :errors="errors"></notification>
    <div class="field">
      <div class="control">
        <label class="label">Source</label>
        <input class="input" type="text" v-model="form.name" placeholder="Name" />
      </div>
    </div>
    <button @click.prevent="onAddNeighborhoods" class="button is-small is-success">&#43;</button>
    <label class="label">Neighborhoods</label>
    <div class="box">
      <neighborhood
        :neighborhoods="neighborhoods"
        v-for="(neighborhood, index) in form.neighborhoods"
        :key="index"
        :neighborhood="neighborhood"
        @remove="onRemoveNeighborhood($event)"
      ></neighborhood>
    </div>
    <button @click.prevent="onAddMeta" class="button is-small is-success">&#43;</button>
    <label class="label">Meta</label>
    <div class="box">
      <custom-meta
        v-for="(meta, index) in form.meta"
        :key="index"
        :meta="meta"
        @remove="onRemoveMeta($event)"
      ></custom-meta>
    </div>
    <div class="field">
      <div class="control">
        <button
          type="button"
          @click="onSave"
          :disabled="loading || !isValid"
          class="button is-success is-outlined is-fullwidth"
        >Save</button>
      </div>
    </div>
    <div class="field">
      <div class="control">
        <button type="button" @click="onReset" class="button is-info is-outlined is-fullwidth">Reset</button>
      </div>
    </div>
    <div class="field" v-if="form.id">
      <div class="control">
        <button
          type="button"
          @click="onDelete"
          :disabled="loading"
          class="button is-danger is-outlined is-fullwidth"
        >Delete</button>
      </div>
    </div>
  </form>
</template>

<script>
import _ from "underscore";
import CustomMeta from "./CustomMeta.vue";
import Neighborhood from "./Neighborhood.vue";
import api from "../api";
import { mapState } from "vuex";
export default {
  props: ["node", "neighborhoods"],
  components: {
    CustomMeta,
    Neighborhood
  },
  computed: {
    ...mapState(["loading", "errors"]),
    isValid() {
      return !!this.form.name;
    }
  },
  watch: {
    node: function(n, p) {
      this.form = n;
    }
  },
  data() {
    return {
      form: this.node
    };
  },
  methods: {
    handelRequest(promise) {
      promise
        .then(() => this.$emit("refresh"))
        .catch(error => {
          this.$store.commit("setLoading", false);
          this.$store.commit("setErrors", error.response.data);
        });
    },
    onSave() {
      let promise;
      this.$store.commit("setLoading", true);

      if (this.form.id) {
        promise = api.update(this.form.id, this.form);
      } else {
        promise = api.add(this.form);
      }

      this.handelRequest(promise);
    },
    onRemoveMeta(el) {
      this.form.meta = _.filter(this.form.meta, meta => meta != el);
    },
    onRemoveNeighborhood(el) {
      this.form.neighborhoods = _.filter(
        this.form.neighborhoods,
        neighborhood => neighborhood != el
      );
    },
    onAddMeta() {
      if (!Array.isArray(this.form.meta)) {
        this.form.meta = [];
      }
      this.form.meta.push({
        key: "",
        value: ""
      });
    },
    onAddNeighborhoods() {
      if (!Array.isArray(this.form.neighborhoods)) {
        this.form.neighborhoods = [];
      }
      this.form.neighborhoods.push({
        id: "",
        direction: ""
      });
    },
    onReset() {
      this.form = {
        id: "",
        name: "",
        neighborhoods: [],
        meta: []
      };

      this.$store.commit("setLoading", false);
    },
    onDelete() {
      this.$store.commit("setLoading", true);
      this.handelRequest(api.delete(this.form.id));
    }
  }
};
</script>
