import koaRouter from 'koa-router';

//ModelTypes
import weave from './band';

const moduleName = 'band';
const router = koaRouter();
const routerTypes = [
    weave,
    //继续添加routerType
];

routerTypes.forEach(routerType => {
    const childRouter = new routerType(moduleName);
    //每个ChildRouter的路由是/moduleName/tableName
    const route = `/${moduleName}/${childRouter.getTableName()}`;
    router.use(route, childRouter.routes(), childRouter.allowedMethods());
});

export default router;