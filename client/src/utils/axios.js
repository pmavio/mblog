import axios from "axios"
import config from "../../config/basic.config"
import * as qs from "querystring";


axios.defaults.timeout = 10000
axios.defaults.withCredentials = true
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
axios.defaults.baseURL = config.apiDns //api默认路由地址
    // axios.defaults.paramsSerializer = function(params) {
    //     const result = Qs.stringify(params, {arrayFormat: 'repeat'})
    // // console.log('axios paramsSerializer ', result);
    //     return result;
    // };

function getSid() {
    if (!localStorage) return "";
    return localStorage.getItem('sid');
}

function showApiError(url, params, result) {
    if (result
        && result.code !== undefined
        && result.code != 0
        && result.message !== '暂无数据' //过滤掉暂无数据的提醒
    ) {
        //TODO 错误提示样式不成熟

    }
}

export default {
    //获取
    setAxiosGetPromise: (url, params = {}) => {
        const sid = getSid();
        return axios.get(url, {
            params: params,
            headers: { sid:  sid }
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
        const sid = getSid();
        return axios.post(url, data, {
            headers: {
                sid:  sid
            }
        }).then(response => {
            showApiError(url, data, response.data);
            return response
        }).catch(err => {
            throw err
        })
    },
    //更新全部
    setAxiosPutPromise: (url, data) => {
        const sid = getSid();
        return axios.put(url, data, {
            headers: {
                sid:  sid
            }
        }).then(response => {
            showApiError(url, data, response.data);
            return response
        }).catch(err => {
            throw err
        })
    },
    //删除
    setAxiosDeletePromise: (url, params = {}) => {
        const sid = getSid();
        return axios.delete(url, {
            params: params,
            headers: { sid:  sid },
        }).then(response => {
            showApiError(url, params, response.data);
            return response
        }).catch(err => {
            throw err
        })
    },

    setSid: (sid) => {
        localStorage.setItem('sid', sid);
    }
}