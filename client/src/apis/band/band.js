import axios from './../../utils/axios.js'

const band = {

    getList: function(query) {
        return axios.setAxiosGetPromise('/api/band/band', query);
    },

    insert: function(data){
        return axios.setAxiosPostPromise('/api/band/band', data);
    }

};


export default band;