<template>
  <form action>
    <notification :errors="errors"></notification>
    <div class="field">
      <div class="control">
        <label class="label">Source</label>
        <input class="input" type="text" v-model="form.name" placeholder="Name" />
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <div class="field">
          <div class="control">
            <label class="label">Previous</label>
            <div class="is-fullwidth select">
              <select v-model="form.previous.id">
                <option
                  v-for="(target, index) in targets"
                  :value="index"
                  :key="index"
                >{{ target.name }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="field">
          <div class="control">
            <label class="label">Direction</label>
            <div class="is-fullwidth select">
              <select v-model="form.previous.direction">
                <option
                  v-for="(direction, index) in directions"
                  :value="direction.value"
                  :key="index"
                >{{ direction.name }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <div class="field">
          <div class="control">
            <label class="label">Next</label>
            <div class="is-fullwidth select">
              <select v-model="form.next.id">
                <option
                  v-for="(target, index) in targets"
                  :value="index"
                  :key="index"
                >{{ target.name }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="field">
          <div class="control">
            <label class="label">Direction</label>
            <div class="is-fullwidth select">
              <select v-model="form.next.direction">
                <option
                  v-for="(direction, index) in directions"
                  :value="direction.value"
                  :key="index"
                >{{ direction.name }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="field">
      <div class="field">
        <a href="#" @click="onAddMeta">&#43;</a>
      </div>
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
import api from "../api";
import { mapState } from "vuex";
export default {
  props: ["node", "targets"],
  components: {
    CustomMeta
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
      form: this.node,
      directions: [
        { value: "left", name: "Left" },
        { value: "right", name: "Right" }
      ]
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
      this.form.meta = _.filter(this.form.meta, node => node != el);
    },
    onAddMeta() {
      this.form.meta.push({
        key: "",
        value: ""
      });
    },
    onReset() {
      this.form = {
        id: "",
        name: "",
        next: { id: "", direction: "" },
        previous: { id: "", direction: "" },
        meta: [
          {
            key: "",
            value: ""
          }
        ]
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
