var config = require('../../config/basic.config');
const path = require('path');
const fs = require('fs');
var axios = require('./axios');
var querystring = require('querystring');
var stringUtil = function() {};
//是否包含
stringUtil.prototype.isContains = function(str, substr) {
        return str.indexOf(substr) >= 0;
    },
    //对路由进行处理（针对没有业务逻辑的controller代理路由跳转）
    //步骤(1、获取当前页面的文件名称，与配置js文件中的name来对比；2、获取路由数据，遍历所有路由，进行转发)
    stringUtil.prototype.loadFile = function(file_path) {
        const arr = file_path.split('\\');
        let name = ''
        if (arr.length === 1) {
            const MacArr = file_path.split('\/');
            name = MacArr[MacArr.length - 1];
        } else {
            name = arr[arr.length - 1];
        }
        return './' + name + '.service';
    }
stringUtil.prototype.getVuePath = function(system_service, file_name) {
    var file_n = file_name.split('.')[0];
    var str;
    var s = system_service.route.filter(function(element) {
        if (element.file_name === file_n) {
            str = element.path;
            return element;
        }

    });

    var arr = s[0].routes.map(function(ele) {
        return ele;
    });
    return {
        "serviceBasePath": system_service.prefix + str,
        "vuePath": arr
    };
}
const getControllerMethod = function(dns_data, serviceBasePath, serviceRoute) {
    var data_path = dns_data.dns + serviceBasePath + serviceRoute.servicePath;
    return async ctx => {
        switch (serviceRoute.method) {
            case "get":
                ctx.body = await axios.setAxiosGetPromise(data_path, serviceRoute.params === "false" ? {} : ctx.query);
                break;
            case "delete":
                ctx.body = await axios.setAxiosDeletePromise(data_path, serviceRoute.params === "false" ? {} : ctx.query);
                break;
            case "put":
                ctx.body = await axios.setAxiosPutPromise(data_path, serviceRoute.params === "false" ? {} : querystring.stringify(ctx.request.body));
                break;
            case "post":
                ctx.body = await axios.setAxiosPostPromise(data_path, serviceRoute.params === "false" ? {} : querystring.stringify(ctx.request.body));
                break;
            default:
                break;
        }

    }
}
stringUtil.prototype.loadRoutes = function(dns_data, vuePath, serviceRoute) {
    return getControllerMethod(dns_data, vuePath, serviceRoute)
}

//对日期进行处理
stringUtil.prototype.Format = function(date, fmt) { //author: meizz 
    var o = {
        "M+": date.getMonth() + 1, //月份 
        "d+": date.getDate(), //日 
        "h+": date.getHours(), //小时 
        "m+": date.getMinutes(), //分 
        "s+": date.getSeconds(), //秒 
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
        "S": date.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;

}

//获取从给定到 after 分钟前的时间
stringUtil.prototype.beforeNowtime = function(date, fmt, beforetime) {
        date.setMinutes(date.getMinutes() - beforetime);
        return this.Format(date, fmt);

    }
    //处理特殊字符  正则校验
    //只能输入汉字
stringUtil.only_chinese = "^[\u4e00-\u9fa5]{0,}$";
//url校验
stringUtil.url_check = "^http://([\w-]+\.)+[\w-]+(/[\w-./?%&=]*)?$";
//tel校验
stringUtil.tel_check = "^(\d{3,4}-)\d{7,8}$";
//匹配首尾空格
stringUtil.blank_check = "(^\s*)|(\s*$)";

stringUtil.trims = function(ctx) {
        return ctx.replace('/(^\s*)|(\s*$)/g', "");
    }
    //特殊字符窜（验证是否含有^%&',;=?$\"等字符）
stringUtil.special_check = "[^%&',;=?$\x22]+";
//匹配首尾空白字符(可以用来删除行首行尾的空白字符(包括空格、制表符、换页符等等)
stringUtil.First_last = "^\s*|\s*$";


module.exports = new stringUtil();