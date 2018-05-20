import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import Vuex from 'vuex'
import App from './App.vue'
import router from '../../routes/band_router'
import store from './../../store/index.js'
import polyfill from 'babel-polyfill'

Vue.use(ElementUI) // Vue全局使用
Vue.use(Vuex)
Vue.use(polyfill) // Vue全局使用

const app = new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');