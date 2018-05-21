import axios from './../../utils/axios.js'

const band = {

    getList: function(query) {
        return axios.setAxiosGetPromise('/api/band/band', query);
    },

    insert: function(data){
        return axios.setAxiosPostPromise('/api/band/band', data);
    },

    update: function(condition, data){
        return axios.setAxiosPutPromise('/api/band/band', {condition, data});
    }

};


export default band;