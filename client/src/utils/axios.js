import axios from "axios"
import config from "../../config/basic.config"
import * as qs from "querystring";
import router from '../routes/band_router'
import store from '../store/index';

axios.defaults.timeout = 30000
axios.defaults.withCredentials = true
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
// axios.defaults.baseURL = config.apiDns //api默认路由地址
    // axios.defaults.paramsSerializer = function(params) {
    //     const result = Qs.stringify(params, {arrayFormat: 'repeat'})
    // // console.log('axios paramsSerializer ', result);
    //     return result;
    // };

function getJwtToken() {
    if (!localStorage) return "";
    return localStorage.getItem('jwtToken');
}

function showApiError(url, params, result) {
    if(!result || result.code === 0) return;
    if(result.code === -1){
        // 处理用户未登录
        store.dispatch('user/shouldLogin');
    }
}

export default {
    //获取
    setAxiosGetPromise: (url, params = {}) => {
        const jwtToken = getJwtToken();
        return axios.get(url, {
            params: params,
            headers: { Authorization:  'Bearer ' + jwtToken }
        }).then(response => {
            showApiError(url, params, response.data);
            console.log(url, 'get response', response);
            return response
        }).catch(err => {
            throw err
        })
    },
    //新增
    setAxiosPostPromise: (url, data) => {
        const jwtToken = getJwtToken();
        return axios.post(url, data, {
            headers: { Authorization:  'Bearer ' + jwtToken }
        }).then(response => {
            showApiError(url, data, response.data);
            return response
        }).catch(err => {
            throw err
        })
    },
    //更新全部
    setAxiosPutPromise: (url, data) => {
        const jwtToken = getJwtToken();
        return axios.put(url, data, {
            headers: { Authorization:  'Bearer ' + jwtToken }
        }).then(response => {
            showApiError(url, data, response.data);
            return response
        }).catch(err => {
            throw err
        })
    },
    //删除
    setAxiosDeletePromise: (url, params = {}) => {
        const jwtToken = getJwtToken();
        return axios.delete(url, {
            params: params,
            headers: { Authorization:  'Bearer ' + jwtToken }
        }).then(response => {
            showApiError(url, params, response.data);
            return response
        }).catch(err => {
            throw err
        })
    },

    setJwtToken: (jwtToken) => {
        localStorage.setItem('jwtToken', jwtToken);
    }
}