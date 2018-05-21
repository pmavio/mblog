/**
 * Created by mavio on 2018/1/12
 */

import apiService from '../../../apis'

// initial state
const state = {
    bandEditor: {
        band: null,
    },
};
const bandApi = apiService.band;
const actions = {

    resetBandEditorPage(store){
        store.commit('onResetBandEditorPage');
        return true;
    },

    saveBandEditorPage(store, {band}){
        if(store.state.bandEditor.band === band) return false;
        store.commit('onSaveBandEditorPage', {band});
        return true;
    }

};
const funcKeys = Object.keys(bandApi);
for(let key of funcKeys){
    const func = bandApi[key];
    if(!actions[key]){
        actions[key] = function (_, query) {
            return func(query)
                .then(res => res.data);
        }
    }
}

// mutations
const mutations = {

    onResetBandEditorPage(state){
        state.bandEditor.band = null;
    },

    onSaveBandEditorPage(state, {band}){
        state.bandEditor.band = band;
    }
};

export default {
    namespaced: true,
    state,
    actions,
    mutations
}