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
    // Axios.get('/app/system/systemAccount/menu', { params: { keywords: 'menu' } })
    //     .then(function(response) {
    //         var data = response.data;
    //         resolve(data);
    //     })
    //     .catch(function(error) {
    //         resolve(error);
    //     });
    // })
    return axios.setAxiosGetPromise('/app/system/systemAccount/menu', { platform: 'pc' })
        .then(res => res.data);
};

var getRouter = () => {
    return getRemoteToken().then(function(data) {
        var vueRouters = getRouterPath(data.result);
        return new Router({
            mode: 'history',
            routes: vueRouters
        });

    })

}


var getRouterPath = function(data) {
    var result = data;
    var vueRouters = [];
    for (var i = 0; i < result.length; i++) {
        try {
            if (!result[i].children || result[i].children.length == 0) {
                //获取没有子级菜单的数据
                var path = {
                    path: result[i].path,
                    component: require('./../views/components/' + result[i].component),
                    hidden: result[i].hidden,
                    meta: result[i].meta
                };
                vueRouters.push(path);
            } else {
                var parentState = true //父级菜单显示的状态 当子级全不展示，让其父级也在侧边栏隐藏
                var childrenArray = result[i].children;
                var childrenPath = []; //存放子级菜单的空数组
                for (var j = 0; j < childrenArray.length; j++) {
                    var state = true //子级菜单的显示状态 ,如果menuStatus==是并且hidden==false让其不隐藏
                    if (childrenArray[j].menuStatus == '是' && childrenArray[j].hidden == false) {
                        state = false
                        parentState = false;
                    }
                    //拼接子级菜单路由的基本数据
                    var path = {
                        path: childrenArray[j].path,
                        component: require('./../views/components/' + childrenArray[j].component),
                        hidden: state,
                        name: childrenArray[j].name,
                        show: childrenArray[j].show,
                        meta: childrenArray[j].meta,
                    };
                    childrenPath.push(path)
                }
                //如果自己菜单没有图标，默认显示一个
                if (result[i].iconCls == null) {
                    result[i].iconCls = 'el-icon-message'
                }
                //拼接含有子级菜单的完整路由信息
                var path = {
                    path: result[i].path,
                    name: result[i].name,
                    component: require('./../views/components/' + result[i].component),
                    iconCls: result[i].iconCls,
                    menuShow: result[i].menuShow,
                    hidden: parentState,
                    noDropdown: result[i].noDropdown,
                    children: childrenPath,
                    meta: result[i].meta,
                };
                vueRouters.push(path);
            }
        } catch (err) {
            console.log('client/src/routes/router.getRouterPath error :', err.message);
            console.log('when parsing menu data :', result[i]);
        }
    }
    return vueRouters;

}

export { getRouter };