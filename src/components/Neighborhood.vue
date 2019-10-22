<template>
  <div class="columns">
    <div class="column">
      <div class="field">
        <div class="control">
          <label class="label">Neighborhoods</label>
          <input class="input" type="text" v-model="neighborhood.id" />
        </div>
      </div>
    </div>
    <div class="column">
      <div class="field">
        <div class="control">
          <label class="label">Direction</label>
          <input class="input" type="text" v-model="neighborhood.direction" />
          <a href="#" class="icon--delete" @click="onRemove">&#45;</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["neighborhood"],
  methods: {
    onRemove() {
      this.$emit("remove", this.neighborhood);
    }
  }
};
</script>

<style>
</style>