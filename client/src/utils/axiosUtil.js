import axios from "axios"
import config from "../../config/basic.config"
import * as Qs from "querystring";


function getUserSid() {
    axios.defaults.baseURL = config.apiDns
    return axios.get('/app/system/systemAccount/getLoginedUser' + "?Timestamp=" + Date.now(), {
        params: {},
    }).then(response => {
        return response.data
    }).catch(err => {
        throw err
    })
}
class axiosUtil {

    static getInstance(baseUrl) {
        let instance = axios.create({
            baseURL: baseUrl
        })
        return instance;
    }
    static getSid() {
        if (!localStorage) return "";
        return localStorage.getItem('sid');
    }
    static setSid(sid) {
        localStorage.setItem('sid', sid);
    }
    static showApiError(url, params, result) {
        if (result &&
            result.code !== undefined &&
            result.code != 0 &&
            result.message !== '暂无数据' //过滤掉暂无数据的提醒
        ) {
            //TODO 错误提示样式不成熟
        }
    }

    async setAxiosGetPromise(url, params = {}) {
        const sid_result = await getUserSid();
        let sid = sid_result.result.sid;
        return this.instance.get(url + "?Timestamp=" + Date.now(), {
            params: params,
            headers: { sid: sid }
        }).then(response => {
            axiosUtil.showApiError(url, params, response.data);
            return response
        }).catch(err => {
            throw err
        })
    }
    async setAxiosPostPromise(url, data) {
        const sid_result = await getUserSid();
        let sid = sid_result.result.sid;
        return this.instance.post(url + "?Timestamp=" + Date.now(), data, {
            headers: {
                sid: sid
            }
        }).then(response => {
            axiosUtil.showApiError(url, data, response.data);
            return response
        }).catch(err => {
            throw err
        })
    }
    async setAxiosPutPromise(url, data) {
        const sid_result = await getUserSid();
        let sid = sid_result.result.sid;
        return this.instance.put(url + "?Timestamp=" + Date.now(), data, {
            headers: {
                sid: sid
            }
        }).then(response => {
            axiosUtil.showApiError(url, data, response.data);
            return response
        }).catch(err => {
            throw err
        })
    }
    async setAxiosDeletePromise(url, params = {}) {
        const sid_result = await getUserSid();
        let sid = sid_result.result.sid;
        return this.instance.delete(url + "?Timestamp=" + Date.now(), {
            params: params,
            headers: { sid: sid },
        }).then(response => {
            axiosUtil.showApiError(url, params, response.data);
            return response
        }).catch(err => {
            throw err
        })
    }

    get baseUrl() {
        return this._baseUrl;
    }
    set baseUrl(value) {
        this._baseUrl = value;
    }
    constructor(baseUrl, timeout = 10000) {
        this._baseUrl = baseUrl;
        this.instance = axiosUtil.getInstance(baseUrl)
        this.instance.defaults.timeout = timeout
        this.instance.defaults.withCredentials = true
        this.instance.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
    }
}
export default axiosUtil;