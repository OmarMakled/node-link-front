const API = process.env.VUE_APP_API;
import axios from "axios";

const client = axios.create();

// TODO hook and set state loading
client.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
client.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default {
  get() {
    return client.get(`${API}/api/nodes`);
  },
  add(data) {
    return client.post(`${API}/api/nodes`, data);
  },
  update(id, data) {
    return client.put(`${API}/api/nodes/${id}`, data);
  },
  delete(id) {
    return client.delete(`${API}/api/nodes/${id}`);
  }
};