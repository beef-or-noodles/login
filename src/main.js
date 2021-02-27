// The Vue build version to load with the `import` command
/* jshint esversion: 6 */
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router/index';
import store from './tool/vuex/store/store.js';
import tool from './tool/public.js';
import "../static/iconfont/iconfont.css"
import {
  post,
  get,
  uploadImg
} from './tool/axios/axiosPost.js';
import api from './tool/api/apiurl.js';
//将axios挂载到Vue实例中的$ajax上面,在项目中的任何位置通过this.$post使用
Vue.prototype.$post = post;
Vue.prototype.$get = get;
Vue.prototype.$uploadImg = uploadImg;
Vue.prototype.$api = api;
Vue.prototype.$tool = tool;//工具类
Vue.config.productionTip = false;
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
});


store.commit("setToast")
//路由守卫
