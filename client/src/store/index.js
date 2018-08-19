import Vue from 'vue'
import Vuex from 'vuex'

import band from './modules/band/band';
import user from './modules/public/user';

import createPersistedState from 'vuex-persistedstate'; //vuex状态持久化插件

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        band,
        user,
    },
    status: {},
    plugins: [
        createPersistedState({
            key: 'web'
        })
    ],
})