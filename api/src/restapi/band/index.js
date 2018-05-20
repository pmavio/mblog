import KoaRouter from 'koa-router';

const router = KoaRouter();
const routePrefix = '/band';

import bandai from './band';
const apis = [
    bandai,
    //继续添加apiRouter

];

for(let api of apis){
    let apiRoute = routePrefix + '/' +  api.prefix;
    console.log(apiRoute);
    router.use(apiRoute, api.routes(), api.allowedMethods());
}

export default router;