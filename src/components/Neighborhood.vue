<template>
  <div class="field">
    <div class="control">
      <div class="columns has-background-light">
        <div class="column">
          <div class="is-fullwidth select">
            <select v-model="neighborhood.id">
              <option
                v-for="(neighborhood, index) in neighborhoods"
                :key="index"
                :value="index"
              >{{neighborhood.name}}</option>
            </select>
          </div>
        </div>
        <div class="column">
          <div class="control">
            <label class="radio">
              <input type="radio" value="left" v-model="neighborhood.direction" checked />
              Left
            </label>
            <label class="radio">
              <input type="radio" value="right" v-model="neighborhood.direction" />
              Right
            </label>
          </div>
        </div>
        <a href="#" class="delete is-small icon--delete" @click="onRemove">&#45;</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["neighborhood", "neighborhoods"],
  methods: {
    onRemove() {
      this.$emit("remove", this.neighborhood);
    }
  }
};
</script>

<style>
</style>