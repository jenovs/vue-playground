import Vue from 'vue';
import Navbar from './Navbar.vue';
import router from './router';

import './index.css';

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(Navbar),
}).$mount('#app');
