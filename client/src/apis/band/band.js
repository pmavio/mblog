import axios from './../../utils/axios.js'

const band = {

    getList: function(query) {
        return axios.setAxiosGetPromise('/api/band/band', query);
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
    }

};


export default band;