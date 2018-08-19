/**
 * Created by mavio on 2018/8/19
 */

import apiService from '../../../apis'
import axios from '../../../utils/axios';

// initial state
const state = {
    activeTime: Date.now(),
    user: null,
    showLoginDialog: false,
};

const userApi = apiService.user;
const actions = {

    reload(store){
        store.commit('onReload');
    },

    checkUserLogin(store, showDialogIfNot=false){
        let result = store.state.user;
        if(!result && showDialogIfNot){
            store.commit('changeLoginDialogState', true);
        }
        return result!==null;
    },

    async login(store, {username, password}){
        let result = await userApi.login({username, password}).then(res => res.data);
        if(result.code === 0){
            let user = result.result;
            axios.setJwtToken(user.token);
            store.commit('onUserLogin', user);
        }
        store.commit('changeLoginDialogState', false);
        return result;
    },

    logout(store){
        axios.setJwtToken(null);
        store.commit('onReload');
        store.commit('onUserLogin', null);
        return true;
    },

    shouldLogin(store){
        if(store.state.showLoginDialog) return;
        store.commit('changeLoginDialogState', true);
    },

    closeLoginDialog(store){
        store.commit('changeLoginDialogState', false);
    },
};
const funcKeys = Object.keys(userApi);
for(let key of funcKeys){
    const func = userApi[key];
    if(!actions[key]){
        actions[key] = function (_, query) {
            return func(query)
                .then(res => res.data);
        }
    }
}

// mutations
const mutations = {
    onReload(state){
        state.activeTime = Date.now();
    },

    onUserLogin(state, user){
        state.user = user;
    },

    changeLoginDialogState(state, showDialog){
        state.showLoginDialog = showDialog;
    },
};

export default {
    namespaced: true,
    state,
    actions,
    mutations
}