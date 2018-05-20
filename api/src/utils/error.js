const jwt = require('jsonwebtoken')
const util = require('util')
const verify = util.promisify(jwt.verify)
var config = require('../../config/basic.config')


/**
 * 判断token是否可用
 */
module.exports = function() {
    return async function(ctx, next) {
        try {
            const token = ctx.header.authorization // 获取jwt
            if (token) {
                let payload
                try {
                    payload = await verify(token.split(' ')[1], config.sign) // 解密payload，获取用户名和ID
                        // console.log('我是JWT验证的结果', payload)
                } catch (err) {
                    // console.log('token verify fail: ', err)
                }
            }
            await next()

        } catch (err) {
            // console.log('我是err验证的结果===2err', err)
            if (err.status === 401) {
                ctx.body = {
                    code: -1,
                    message: '认证失败'
                }
            } else {
                err.status = 404
                ctx.body = {
                    code: 404,
                    message: '我是404页面'
                }
            }
        }
    }
}