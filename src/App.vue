<template>
  <section class="section">
    <notification :errors="errors"></notification>
    <div class="container">
      <div class="field">
        <div class="control">
          <button
            class="button is-primary modal-button"
            data-target="modal"
            :disabled="shortPathMode.on"
            aria-haspopup="true"
            @click="showModal = true"
          >Add</button>
        </div>
      </div>
      <div class="notification">
        <div class="field">
          <div class="control">
            <label class="checkbox">
              <input type="checkbox" v-model="shortPathMode.on" />
              Short path mode allow you to click on two nodes to get short path
            </label>
          </div>
        </div>
        <p>
          <strong>{{shortPathMode.message}}</strong>
        </p>
        <div class="tags">
          <span
            class="tag is-warning"
            v-for="path in shortPathMode.path"
            :key="path"
          >{{data[path].name}}</span>
        </div>
      </div>
      <div id="d3"></div>
      <div class="modal" :class="{'is-active': showModal}">
        <div class="modal-background"></div>
        <div class="modal-card">
          <div class="modal-card-body p4">
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
      shortPathMode: {
        on: false,
        nodes: [],
        path: [],
        message: ""
      },
      graph: [],
      nodes: [],
      data: [],
      node: {
        name: "",
        meta: [],
        neighborhoods: []
      },
      links: []
    };
  },
  created() {
    this.start();

    // listen for d3 on circle click to show modal
    this.$on("onCircleClick", id => {
      if (this.shortPathMode.on) {
        this.shortPathMode.nodes.push(id);
        let nodes = this.shortPathMode.nodes;

        if (nodes.length == 2) {
          this.bfs(nodes[0], nodes[1]).then(path => {
            if (path.length == 0) {
              this.shortPathMode.message = "We can not find short path";
            } else {
              this.shortPathMode.message = "Here is the short path";
            }
            this.shortPathMode.path = path;
          });
          this.shortPathMode.nodes = [];
        }
      } else {
        this.node = this.data[id];
        this.node.id = id;
        this.showModal = true;
      }
    });
  },
  methods: {
    refresh() {
      // Todo don't refresh page
      location.reload();
    },
    bfs(source, target) {
      return new Promise((resolve, reject) => {
        let queue = [],
          parents = [],
          path = [],
          parent = source;
        queue.push(parent);
        while (queue.length) {
          parent = queue[0];
          if (this.graph[parent] === undefined) {
            queue.shift();
            continue;
          }
          _.forEach(this.graph[parent], child => {
            parents[child] = parent;
            if (child === target) {
              path.push(child);
              path.push(parent);
              while (parent !== source) {
                parent = parents[parent];
                path.push(parent);
              }
              queue = [];
            } else {
              queue.push(child);
            }
            queue.shift();
          });
        }
        resolve(path.reverse());
      });
    },
    start() {
      api
        .get()
        .then(response => (this.data = response.data))
        .then(() => {
          this.buildGraph().then(graph => (this.graph = graph));
        })
        .then(() => d3.draw(this.nodes, this.links, this));
    },
    buildGraph() {
      let graph = {};
      function addEdge(a, b, direction) {
        if (direction == "left") {
          if (graph[a] == undefined) {
            graph[a] = [];
          }
          graph[a].push(b);
        } else {
          if (graph[b] == undefined) {
            graph[b] = [];
          }
          graph[b].push(a);
        }
      }
      return new Promise((resolve, reject) => {
        _.each(this.data, (node, i) => {
          var id = i;
          this.nodes.push({
            id: id,
            name: node.name
          });

          // build links linked by reference and make sure node is exists;
          _.each(node.neighborhoods, neighborhood => {
            this.links.push({
              source: _.find(this.nodes, el => el.id == id),
              target: _.find(this.nodes, el => el.id == neighborhood.id),
              direction: neighborhood.direction
            });
          });

          // addEdge(node.previous.id, i, node.previous.direction);
        });

        resolve(graph);
      });
    }
  }
};
</script>
