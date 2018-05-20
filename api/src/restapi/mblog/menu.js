/**
 * 菜单路由
 */

import KoaRouter from 'koa-router';
import Response from "../Response";
import menuDao from '../dao/menuDao';

const router = new KoaRouter();
router.prefix = 'menu';

menuDao.bindRouter(router, {
    getList: true,
    getCount: true,
    getById: true,
    insert: true,
    update: true,
    remove: false,
    removeById: false,
});
export default router;