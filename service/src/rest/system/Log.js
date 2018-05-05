import BaseRouter from '../BaseRouter';
import dbModels from '../../db/dbModels';
import Response from "../Response";

export default class Log extends BaseRouter{

    getTableName(){
        return 'log';
    }

    initRoutes(dbModel){
        this.post('/', async ctx => {
            const data = await this.parsePostData(ctx);
            ctx.body = await Response.fromPromise(dbModel.insert(data));
        });
    }

    getDefaultRouteSwitchers(){
        // 仅开启getList路由
        return {
            getList: true,
        }
    }
}