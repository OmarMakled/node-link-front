<template>
  <section class="section">
    <notification :errors="errors"></notification>
    <div class="container">
      <button
        class="button is-primary modal-button"
        data-target="modal"
        aria-haspopup="true"
        @click="showModal = true"
      >Add</button>
      <div id="d3"></div>
      <div class="modal" :class="{'is-active': showModal}">
        <div class="modal-background"></div>
        <div class="modal-card">
          <div class="modal-card-body">
            <form-node :node="node" :targets="data" @refresh="refresh"></form-node>
          </div>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="showModal = false"></button>
      </div>
    </div>
  </section>
</template>

<script>
import FormNode from "./components/FormNode";

import api from "./api";
import d3 from "./d3";
import _ from "underscore";
import { mapState } from "vuex";

export default {
  name: "app",
  components: {
    FormNode
  },
  computed: {
    ...mapState(["errors"])
  },
  data() {
    return {
      showModal: false,
      nodes: [],
      data: [],
      node: {
        name: "",
        previous: {
          id: "",
          direction: ""
        },
        next: {
          id: "",
          direction: ""
        },
        meta: [
          {
            key: "",
            value: ""
          }
        ]
      },
      links: []
    };
  },
  created() {
    this.start();

    // listen for d3 on circle click to show modal
    this.$on("onCircleClick", id => {
      this.node = this.data[id];
      this.node.id = id;
      this.showModal = true;
    });
  },
  methods: {
    refresh() {
      // Todo don't refresh page
      location.reload();
    },
    start() {
      api
        .get()
        .then(response => (this.data = response.data))
        .then(() => this.getD3())
        .then(() => d3.draw(this.nodes, this.links, this));
    },
    getD3() {
      _.each(this.data, (node, i) => {
        this.nodes.push({
          id: i,
          name: node.name,
          target: node.target || ""
        });

        // build links linked by reference and make sure node is exists;
        if (node.previous.id && this.data[node.previous.id]) {
          this.links.push({
            source: _.find(this.nodes, el => el.id == i),
            target: _.find(this.nodes, el => el.id == node.previous.id),
            direction: node.previous.direction
          });
        }

        if (node.next.id && this.data[node.next.id]) {
          this.links.push({
            source: _.find(this.nodes, el => el.id == i),
            target: _.find(this.nodes, el => el.id == node.next.id),
            direction: node.next.direction
          });
        }
      });
    }
  }
};
</script>
