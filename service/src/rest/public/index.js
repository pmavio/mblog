import koaRouter from 'koa-router';

//ModelTypes
import log from './Log';
import user from './User';

const moduleName = 'public';
const router = koaRouter();
const routerTypes = [
    log,
    user,
    //继续添加routerType
];

routerTypes.forEach(routerType => {
    const childRouter = new routerType(moduleName);
    //每个ChildRouter的路由是/moduleName/tableName
    const route = `/${moduleName}/${childRouter.getTableName()}`;
    router.use(route, childRouter.routes(), childRouter.allowedMethods());
});

export default router;