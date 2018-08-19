import KoaRouter from 'koa-router';

const router = KoaRouter();
const routePrefix = '/public';

import user from './user';
const apis = [
    user,
    //继续添加apiRouter

];

for(let api of apis){
    let apiRoute = routePrefix + '/' +  api.prefix;
    console.log(apiRoute);
    router.use(apiRoute, api.routes(), api.allowedMethods());
}

export default router;