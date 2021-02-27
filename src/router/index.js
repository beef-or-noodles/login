import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const router = new Router({
    mode: 'history',
    routes:[ {
        path: '/',
        name: 'login',
        component: resolve => require(['@/view/login/login.vue'], resolve),
        meta: {title: '登陆'},
    }]
});
export default router
