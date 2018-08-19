//加密解密
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const config = require('../../config/basic.config');

//sha1签名
exports.sha1 = (str) => {
    const sha1 = crypto.createHash('sha1')
    sha1.update(str)
    return sha1.digest('hex')
};

//md5加密
exports.md5 = function (data) {
    return crypto.createHash("md5").update(data, 'utf-8').digest("hex");
};