//加密解密
const crypto = require('crypto');
const CryptoJS = require('crypto-js');
const config = require('../../config/basic.config');


//sha1签名
exports.sha1 = (str) => {
        const sha1 = crypto.createHash('sha1')
        sha1.update(str)
        return sha1.digest('hex')
    }
    //md5加密
exports.md5 = function(data) {
    return crypto.createHash("md5").update(data, 'utf-8').digest("hex");
}

exports.tripleDesEncrypt = function(data, key, iv) {
    var keyHex = CryptoJS.enc.Utf8.parse(key); //key转码
    var ivHex = CryptoJS.enc.Utf8.parse(iv); //iv转码
    var ciphertext = CryptoJS.TripleDES.encrypt(
        data, //明文
        keyHex, //key
        {
            iv: ivHex, //偏移量iv，加密模式为CBC时有效
            mode: CryptoJS.mode.CBC, //加密模式
            padding: CryptoJS.pad.Pkcs7 //填充方式
        }
    ).toString();
    return ciphertext;
};

exports.tripleDesEncrypt = function(data, key, iv) {
    var keyHex = CryptoJS.enc.Utf8.parse(key); //key转码
    var ivHex = iv ? CryptoJS.enc.Utf8.parse(iv) : null; //iv转码
    var ciphertext = CryptoJS.TripleDES.encrypt(
        data, //明文
        keyHex, //key
        {
            iv: ivHex, //偏移量iv，加密模式为CBC时有效
            mode: CryptoJS.mode.CBC, //加密模式
            padding: CryptoJS.pad.Pkcs7 //填充方式
        }
    ).toString();
    return ciphertext;
};

exports.tripleDesDecrypt = function(data, key, iv) {
    var keyHex = CryptoJS.enc.Utf8.parse(key); //key转码
    var ivHex = iv ? CryptoJS.enc.Utf8.parse(iv) : null; //iv转码
    var decrypted = CryptoJS.TripleDES.decrypt({ //3des解密
        ciphertext: CryptoJS.enc.Base64.parse(data) //传入base64格式密文
    }, keyHex, {
        iv: ivHex,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8);
    return decrypted;
};

// exports.aesEncrypt = function (data, key) {
//     var ciphertext = CryptoJS.AES.encrypt(data, key).toString();
//     return ciphertext;
// };
//
// exports.aesDecrypt = function (data, key){
//     var decrypted = CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
//     return decrypted;
// };

//cipherType:
//aes-128-cbc    aes-128-ecb    aes-192-cbc    aes-192-ecb    aes-256-cbc
//aes-256-ecb

const aesEncrypt = function(data, cipherType, key, iv, charSet = 'utf8', outputType = 'hex') {
    var cipher = iv === undefined ?
        crypto.createCipher(cipherType, key) :
        crypto.createCipheriv(cipherType, key, iv);
    var enc = cipher.update(data, charSet, outputType);
    enc += cipher.final(outputType);
    return enc;
};
exports.aesEncrypt = aesEncrypt;

const aesDecrypt = function(data, cipherType, key, iv, charSet = 'utf8', outputType = 'hex') {
    var decipher = iv === undefined ?
        crypto.createDecipher(cipherType, key) :
        crypto.createDecipheriv(cipherType, key, iv);
    var dec = decipher.update(data, outputType, charSet);
    dec += decipher.final(charSet);
    return dec;
};
exports.aesDecrypt = aesDecrypt;

exports.iGtjaEncrypt = function(data) {
    return aesEncrypt(
        data,
        config.igtja.cipherType,
        config.igtja.aesKey,
        config.igtja.aesIv,
        config.igtja.charSet,
        config.igtja.outputType);
};
exports.iGtjaDecrypt = function(data) {
    return aesDecrypt(
        data,
        config.igtja.cipherType,
        config.igtja.aesKey,
        config.igtja.aesIv,
        config.igtja.charSet,
        config.igtja.outputType);
};