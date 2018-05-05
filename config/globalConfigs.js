var os = require('os');
var configs = require('./configs.json');

/**
 *
 * @param nodeEnv   node环境名称
 * @param platform  读取配置的平台名称 client/api/service
 * @varructor
 */
function GlobalConfigs(nodeEnv, platform) {
    this.nodeEnv = nodeEnv;
    this.platform = platform;
}

/**
 * 获取本机ip地址
 * @returns {*}
 */
GlobalConfigs.prototype.getLocalIpv4 = function(){
    var interfaces = require('os').networkInterfaces();
    for(var devName in interfaces){
        var iface = interfaces[devName];
        for(var i=0;i<iface.length;i++){
            var alias = iface[i];
            if(alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal){
                return alias.address;
            }
        }
    }
    return '127.0.0.1';
};

/**
 * 根据auto属性和platform读取ip配置
 * @returns {*}
 */
GlobalConfigs.prototype.getIpv4 = function (platform) {
    if(!platform) platform = this.platform;
    var auto = configs.ip.auto;
    if(!platform) auto = true;
    if(auto){
        return this.getLocalIpv4();
    }else{
        return configs.ip[platform];
    }
};

/**
 * 根据platform读取port配置,若传入platform为空，则使用this.platform
 * @param platform
 */
GlobalConfigs.prototype.getPort = function (platform) {
    if(!platform) platform = this.platform;
    return configs.port[platform];
};

GlobalConfigs.prototype.getMongoDBUrl = function (dbName) {
    var mongoConfig = configs.mongodb;
    var ip = mongoConfig.ip;
    if(!dbName || mongoConfig.forceUseDefault) {
        dbName = mongoConfig.defaultDBName;
    }
    if(mongoConfig.auto) ip = this.getLocalIpv4();
    return 'mongodb://' + ip + ':' + mongoConfig.port + '/' + dbName;
};

GlobalConfigs.prototype.getThirdPartConfigs = function () {
    var thirdParts = configs.thirdParts;
    var environment = configs.environment;
    console.log('environment of thirdParts is', environment);
    return thirdParts[environment];
};

GlobalConfigs.prototype.getDNS = function(platform){
    var dnsConfig = configs.dns;
    if(dnsConfig.forceUseDefault){
        return dnsConfig.default;
    }
    if(!platform) platform = this.platform;
    var dns = dnsConfig[platform];
    if(!dns) dns = dnsConfig.default;
    return dns;
};

GlobalConfigs.prototype.getSSO = function(){
    var environment = configs.environment;
    var ssoConfigs = configs.sso;
    var sso = ssoConfigs[environment];
    if(environment === 'sichuang'){
        sso.ssoUrl = 'http://' + this.getIpv4('api') + ':' + this.getPort('api') + sso.ssoUrl;
    }
    sso.returnurl = 'http://' + this.getIpv4('api') + ':' + this.getPort('api') + sso.returnurl;
    return sso;
};

module.exports = GlobalConfigs;