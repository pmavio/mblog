import DB from './db/DB';
import Koa from 'koa';
import Response from "./rest/Response";
import dbModels from './db/dbModels';

// 初始化module对应的db连接配置 TODO
DB.registerModule('mblog', {
    dbUrl: 'mongodb://192.168.31.99:27017/mblog',
});
DB.registerModule('band', {
    dbUrl: 'mongodb://192.168.31.99:27017/band',
});
DB.registerModule('default', {
    dbUrl: 'mongodb://192.168.31.99:27017/default',
});
DB.registerModule('public', {
    dbUrl: 'mongodb://192.168.31.99:27017/public',
});

// 捕获未处理的Promise异常，并记录log
const logModel = dbModels.from('default', 'log');
process.on('unhandledRejection', function (err, p) {
    logModel.logUnhandledRejection(err);
    console.error('unhandledRejection :', err); //TODO
    console.error(p);
});


const service = new Koa();

service.use(async (ctx, next) => {
    const start = Date.now();
    try{
        await next();
        // 统一使用Response包装返回结果
        let body = ctx.body;
        if(!ctx.body) body = '未获得返回内容，请确认路由' + ctx.request.method + ':' + ctx.originalUrl + '是否注册';
        ctx.body = Response
            .format(body)
            .setDuration(Date.now() - start);
        logModel.logResponse(ctx);
    }catch (err){
        // 记录主线未捕获的异常
        const errMessage = logModel.logUncaughtException(err);
        // 统一封装返回结果
        ctx.body = new Response()
            .failure(errMessage)
            .setDuration(Date.now() - start);
    }
});

//注册module的路由
const systemRouters = require('./rest/public');
const mblogRouters = require('./rest/mblog');
const bandaiRouters = require('./rest/band');

const routers = [
    systemRouters,
    mblogRouters,
    bandaiRouters,
];
for(let router of routers){
    service.use(router.routes(), router.allowedMethods());
}
export default service;