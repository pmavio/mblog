const GlobalConfigs = require('../../config/globalConfigs');
const nodeEnv = process.env.NODE_ENV;
const globalConfigs = new GlobalConfigs(nodeEnv, 'service');

const config = {
    //程序运行端口
    service_port: globalConfigs.getPort('service'),
    app_port: globalConfigs.getPort('api'),
    //域名
    service_dns: globalConfigs.getIpv4('service'),
    app_dns: globalConfigs.getIpv4('api'),
    // 静态资源路径
    resource_url: '/build',
    //数据库地址
    mongodb_meeting: globalConfigs.getMongoDBUrl('MEETINGDB'),
    dns: "http://meeting.ctron.com.cn/",
    //是否加载第三方插件配置项
    webpack_hot: false,
    //jwt加密私钥
    sign: "byltest",

    thirdParts: globalConfigs.getThirdPartConfigs(nodeEnv),
    isDealLdapSync: false,

    schedule: {
        ldapSynchroSchedule: { //ldap同步任务
            enable: false, //为保证麻绍微的用作ldap服务器的电脑不爆掉，请在成功拉取组织人员信息后把此开关关掉
            // cycleSpec: '0 */1 * * * *',         //任务周期cron参数，每分钟触发一次
            cycleSpec: '0 0 4 * * *', //任务周期cron参数，每天上午4点触发一次
        }
    },

};


if (process.env.NODE_ENV === 'production') {
}

module.exports = config;