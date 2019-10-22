<template>
  <div class="field">
    <div class="control">
      <div class="columns">
        <div class="column">
          <input class="input" type="text" v-model="meta.key" placeholder="Key" />
        </div>
        <div class="column">
          <input class="input" type="text" v-model="meta.value" placeholder="Value" />
          <a href="#" class="delete is-small icon--delete" @click="onRemove">&#45;</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["meta"],
  methods: {
    onRemove() {
      this.$emit("remove", this.meta);
    }
  }
};
</script>

<style>
</style>