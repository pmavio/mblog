import Vue from 'vue'
import Router from 'vue-router'
// import Axios from 'axios'
import axios from '../utils/axios';
Vue.use(Router)

var menuArray;
var menuDict = {};
var menuPath = '';
//获取菜单的所有数据
var getRemoteToken = function() {
    // return new Promise((resolve, reject) => {
    //     Axios.get('/app/system/systemAccount/menu',{params:{platform:'mobile'}})
    //         .then(function(response) {
    //            var data = response.data;
    //             resolve(data);
    //         })
    //         .catch(function(error) {
    //             resolve(error);
    //         });
    // })

    return axios.setAxiosGetPromise('/app/system/systemAccount/menu', { platform: 'mobile' })
        .then(res => res.data)
        .then(res => {
            // TODO 推入mockAuth
            if (res && res.code === 0) {
                res.result.push({
                    "_id": "5a715a0ba2ef492bbea90a8f",
                    "name": "auth",
                    "path": "/mobile/",
                    "component": "mobile/mockAuth.vue",
                    "hidden": true,
                    "menuStatus": "是",
                    "sorting": 1,
                    "updateTime": "2018-01-99 10:00:00",
                    "children": [],
                    "platform": "mobile",
                    "__v": 0
                });
            }
            return res;
        });
}

var getRouter = () => {
    return getRemoteToken().then(function(data) {
        var vueRouters = getRouterPath(data.result);
        console.log("mobile vueRouters=", vueRouters)
        return new Router({
            mode: 'history',
            routes: vueRouters
        });
    })
}



var getRouterPath = function(data) {
    try {
        var result = data;
        var vueRouters = [];
        for (var i = 0; i < result.length; i++) {

            //获取没有子级菜单的数据
            var path = { path: result[i].path, name: result[i].name, component: require('./../views/mobile_vue/' + result[i].component), hidden: true };
            vueRouters.push(path);


        }
        return vueRouters;

    } catch (err) {
        // vueRouters.push(path);
        return vueRouters;
    }
}

export { getRouter };