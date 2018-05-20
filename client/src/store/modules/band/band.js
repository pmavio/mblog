/**
 * Created by mavio on 2018/1/12
 */

import apiService from '../../../apis'

// initial state
const state = {};
const bandApi = apiService.band;
const actions = {};
const funcKeys = Object.keys(bandApi);
for(let key of funcKeys){
    const func = bandApi[key];
    actions[key] = function (_, query) {
        return func(query)
            .then(res => res.data);
    }
}

// mutations
const mutations = {};

export default {
    namespaced: true,
    state,
    actions,
    mutations
}