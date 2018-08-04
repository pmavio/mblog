import axios from './../../utils/axios.js'

const band = {

    getList: function(query) {
        return axios.setAxiosGetPromise('/api/band/band', query);
    },

    getById(query){
        if(!query) return new Promise((res, rej) => rej(new Error('没有获得id')));
        let {_id} = query;
        return axios.setAxiosGetPromise('/api/band/band/'+_id);
    },

    insert: function(data){
        return axios.setAxiosPostPromise('/api/band/band', data);
    },

    update: function({condition, data}){
        return axios.setAxiosPutPromise('/api/band/band', {condition, data});
    },

    updateById: function({_id, data}){
        if(!_id) _id = data._id;
        return axios.setAxiosPutPromise('/api/band/band/'+_id, data);
    },

    deleteById: function({_id}){
        if(!_id) return;
        return axios.setAxiosDeletePromise('/api/band/band/'+_id);
    },
};


export default band;