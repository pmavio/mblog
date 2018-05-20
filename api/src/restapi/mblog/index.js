import KoaRouter from 'koa-router';

const router = KoaRouter();
const routePrefix = '/mblog';

import menu from './menu';
const apis = [
    menu,
    //继续添加apiRouter

];

for(let api of apis){
    let apiRoute = routePrefix + '/' +  api.prefix;
    console.log(apiRoute);
    router.use(apiRoute, api.routes(), api.allowedMethods());
}

export default router;