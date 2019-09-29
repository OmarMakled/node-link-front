<template>
  <article class="message is-danger" v-if="errors.length >= 1">
    <div class="message-body">
      <p v-for="(error, index) in errors" :key="index">{{error}}</p>
    </div>
  </article>
</template>

<script>
// Todo add notification type
export default {
  props: ["errors"]
};
</script>

<style>
</style>