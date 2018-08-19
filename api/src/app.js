import Response from "./restapi/Response";
const Koa = require('koa');
const koaStatic = require('koa-static'); //加载静态文件
const path = require('path');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const jwt = require('jsonwebtoken');
const jwtKoa = require('koa-jwt');
const util = require('util');

const config = require('./../config/basic.config');
import sessionUtils from './utils/sessionUtils';

const verify = util.promisify(jwt.verify) // 解密

const app = new Koa();
var historyApiFallback = require('./utils/historyFallback/lib/connect-history-api-fallback.js') //jwt错误捕捉验证
app.use(historyApiFallback({
    whiteList: ['/api/'],
    rewrites: [
        {
        from: '/band',
        to: '/band/index.html'
    }]
}));
// //log工具
const logUtil = require('./utils/logUtil');

// 捕获未处理的Promise异常
process.on('unhandledRejection', function(err, p) {
    let logText = '';
    logText += "\n" + "*************** unhandledRejection log start ***************" + "\n";
    //错误名称
    logText += "err name: " + err.name + "\n";
    //错误信息
    logText += "err message: " + err.message + "\n";
    //错误详情
    logText += "err stack: " + err.stack + "\n";
    //错误信息结束
    logText += "*************** unhandledRejection log end ***************" + "\n";
    logUtil.logError(null, logText);
    console.error(logText);
});

//加载静态文件
const koaStaticPath = path.dirname(__dirname) + '/dist';
console.log({koaStaticPath})
app.use(koaStatic(koaStaticPath));

//记录日志
app.use(async(ctx, next) => {
    //响应开始时间
    const start = new Date();
    //响应间隔时间
    var ms;
    try {
        let error = null;
        //开始进入到下一个中间件
        await next()
            .catch(err => {
                error = err
                return err;
            });

        if(error) throw error;

        ms = new Date() - start;
        //记录响应日志
        // logUtil.logResponse(ctx, ms);
    } catch (error) {
        if (error instanceof Response) {
            ctx.body = error;
            return;
        }else if(error.name === 'UnauthorizedError'){
            ctx.body = new Response().failure('用户未登录');
            ctx.body.code = -1;
            return;
        }
        ms = new Date() - start;
        //记录异常日志
        const errorMessage = logUtil.logError(ctx, error, ms);

        //返回错误信息
        ctx.body = new Response().failure(errorMessage);
    }
});

app.use(bodyParser());

//跨域
app.use(cors({
    credentials: true, //Access-Control-Allow-Credentials设置为true
}));

// //使用mongodb保存session
// app.use(sessionUtils.getKoaSession());

app.use(jwtKoa({secret: config.jwtSecret}).unless({
    path: [
        /^\/api\/public\/user\/login/,      //登录接口
        /^\/api\/public\/user\/register/,   //注册接口
        // /^\/api\/band\/band$/,              //縏带列表接口
        /^\/band\/login/,                   //登录页
    ] //数组中的路径不需要通过jwt验证
}));

const router = require('koa-router')();

const mblog = require('./restapi/mblog');
router.use('/api', mblog.routes(), mblog.allowedMethods());

const bandai = require('./restapi/band');
router.use('/api', bandai.routes(), bandai.allowedMethods());

const publicApi = require('./restapi/public');
router.use('/api', publicApi.routes(), publicApi.allowedMethods());

app.use(router.routes(), router.allowedMethods());

module.exports = app;