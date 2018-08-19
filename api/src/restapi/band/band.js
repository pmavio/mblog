/**
 * 菜单路由
 */

import KoaRouter from 'koa-router';
import Response from "../Response";
import band from '../dao/bandDao';

const router = new KoaRouter();
router.prefix = 'band';

band.bindRouter(router, {
    getList: true,
    getCount: true,
    getById: true,
    insert: true,
    updateById: true,
    update: true,
    remove: false,
    removeById: true,
});
export default router;