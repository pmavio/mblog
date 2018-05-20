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
GlobalConfigs.prototype.getLocalIpv4 = function() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
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
GlobalConfigs.prototype.getIpv4 = function(platform) {
    if (!platform) platform = this.platform;
    let ip = configs.ip[platform];
    if (ip === 'auto') {
        ip = this.getLocalIpv4();
    }
    let prefix = configs.https[platform] ? 'https' : 'http';
    return prefix + '://' + ip + ':' + this.getPort(platform);
};

/**
 * 根据platform读取port配置,若传入platform为空，则使用this.platform
 * @param platform
 */
GlobalConfigs.prototype.getPort = function(platform) {
    if (!platform) platform = this.platform;
    let port = configs.port[platform];
    if(!port) port = configs.port.default;
    return port;
};

GlobalConfigs.prototype.getMongoDBUrl = function(dbName) {
    var mongoConfig = configs.mongodb;
    var ip = mongoConfig.ip;
    if (!dbName || mongoConfig.forceUseDefault) {
        dbName = mongoConfig.defaultDBName;
    }
    if (mongoConfig.auto) ip = this.getLocalIpv4();
    return 'mongodb://' + ip + ':' + mongoConfig.port + '/' + dbName;
};

GlobalConfigs.prototype.getDNS = function(platform) {
    var dnsConfig = configs.dns;
    if (!dnsConfig.enable) {
        return this.getIpv4(platform);
    }
    if (dnsConfig.forceUseDefault) {
        return dnsConfig.default;
    }
    if (!platform) platform = this.platform;
    var dns = dnsConfig[platform];
    if (!dns) dns = dnsConfig.default;
    return dns;
};

module.exports = GlobalConfigs;