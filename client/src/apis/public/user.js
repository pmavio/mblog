import axios from './../../utils/axios.js'

const user = {

    login: query => {
        return axios.setAxiosPostPromise('/api/public/user/login', query);
    },

};


export default user;