import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import Notification from "./components/Notification";

import './assets/app.scss';

Vue.config.productionTip = false

Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    loading: false,
    errors: []
  },
  mutations: {
    setLoading(state, status) {
      state.loading = status
    },
    setErrors(state, errors) {
      state.errors = errors
    }
  }
})

Vue.component('notification', Notification)
new Vue({
  store,
  render: h => h(App),
}).$mount('#app')