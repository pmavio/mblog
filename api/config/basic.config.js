const GlobalConfigs = require('../../config/globalConfigs');
const nodeEnv = process.env.NODE_ENV;
const globalConfigs = new GlobalConfigs(nodeEnv, 'api');

const service_port = globalConfigs.getPort('service');
const app_port = globalConfigs.getPort('api');
const config = {

    jwtSecret: 'Battlecruiser operational',

    //服务状态，有可能会出现服务器维护中
    systemState: {
        inService: true,
        defaultMessage: '服务器维护中',
        message: null,
    },

    //域名(服务器域名，分模块设置)
    system_dns: globalConfigs.getIpv4('service'),
    dns: globalConfigs.getDNS(),
    service_port: service_port,
    app_port: app_port,
    ejsExcel: 'ejsExcel',

    // 静态资源路径
    resource_url: '/build',

    //是否加载第三方插件配置
    webpack_hot: false,
    //jwt加密私钥
    sign: "byltest",

    //session过期时间，8小时
    session_max_age: 28800000, //3600*8*1000
    //客户端session请求间隔，10分钟
    client_session_age: 600000,//10*60*1000
    // client_session_age: 10000,//10*60*1000

};

//生产环境
if (process.env.NODE_ENV === 'production') {
    //程序运行端口
}

module.exports = config;