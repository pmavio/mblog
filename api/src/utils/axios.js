const axios = require("axios")
const Response = require('../restapi/Response');
const qs = require('querystring');

axios.defaults.timeout = 5000
axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
// axios.defaults.paramsSerializer = function(params) {
//     const result = queryString.stringify(params, {arrayFormat: 'repeat'})
//     console.log('axios paramsSerializer ', result);
//     return result;
// };

function onCatchError(error, url, params) {
    let message = 'requesting ';
    message += JSON.stringify(url);
    message += ' with params=';
    message += JSON.stringify(params);
    message += '\ngot error: ';
    message += error.message;
    return new Response().failure(message);
}

module.exports = {
    //获取
    setAxiosGetPromise: (url, params = {}) => {
        return axios.get(url, { params: params }).then(response => {
            return response.data
        }).catch(err => {
            // throw err
            return onCatchError(err, url, params);
            // return new Response().failure('requesting ' + url + ' with params=' + params + '\ngot error: ' + err.message);
        })
    },
    //新增
    setAxiosPostPromise: (url, data) => {
        return axios.post(url, data).then(response => {
            return response.data
        }).catch(err => {
            // throw err
            return onCatchError(err, url, data);
            // return new Response().failure('requesting ' + url + ' with params=' + params + '\ngot error: ' + err.message);
        })
    },
    //更新全部
    setAxiosPutPromise: (url, data) => {
        return axios.put(url, data).then(response => {
            return response.data
        }).catch(err => {
            // throw err
            return onCatchError(err, url, data);
            // return new Response().failure('requesting ' + url + ' with params=' + params + '\ngot error: ' + err.message);
        })
    },
    //删除
    setAxiosDeletePromise: (url, params = {}) => {
        return axios.delete(url, { params: params }).then(response => {
            return response.data
        }).catch(err => {
            // throw err
            return onCatchError(err, url, params);
            // return new Response().failure('requesting ' + url + ' with params=' + params + '\ngot error: ' + err.message);
        })
    }
}