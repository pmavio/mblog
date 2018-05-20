import koaRouter from 'koa-router';
import postParse from '../utils/postParse';
import Response from './Response';
import dbModels from '../db/dbModels';

export default class BaseRouter extends koaRouter {

    get dbModel() {
        if(!this._dbModel){
            this.dbModel = this.getDbModel(this.moduleName);
        }
        return this._dbModel;
    }

    set dbModel(value) {
        this._dbModel = value;
    }

    constructor(moduleName) {
        super();
        this.moduleName = moduleName;

        const dbModel = this.dbModel;
        this.initRoutes(dbModel);

        this.initDefaultRoutes(dbModel);
    }

    /**
     * 返回数据库表连接对象
     * @param moduleName
     * @returns {null}
     */
    getDbModel(moduleName){
        return dbModels.from(moduleName, this.getTableName());
    }

    /**
     * 返回所连接的数据库表名，用于匹配数据库表连接对象
     * @returns {string}
     */
    getTableName(){
        return '';
    }

    /**
     * 子类在此方法下注册其他路由
     * @param dbModel
     */
    initRoutes(dbModel) {}

    getDefaultRouteSwitchers(){
        return {
            getList: true,
            getCount: true,
            findById: true,
            insert: true,
            update: true,
            remove: true,
            removeById: true,
            kill: false,
        };
    }

    /**
     * 初始化默认rest路由
     * @param dbModel
     */
    initDefaultRoutes(dbModel){
        const switchers = this.getDefaultRouteSwitchers();

        //列表
        if(switchers.getList)
        this.get('/', async ctx => {
            const query = await this.getRequestParams(ctx);
            const currentPage = parseInt(query.currentPage);
            const pageSize = parseInt(query.pageSize);
            const skipNum = pageSize * (currentPage - 1);

            const conditions = this.getDefaultConditions(query);

            const sortOrder = this.getDefaultSortOrder(query);

            const promise = dbModel.getList(conditions);
            if (skipNum) promise.skip(skipNum);
            if (pageSize) promise.limit(pageSize);
            if (sortOrder) promise.sort(sortOrder);

            ctx.body = await Response.fromPromise(promise.exec());
        });

        //计数
        if(switchers.getCount)
        this.get('/count', async ctx => {
            const conditions = this.getDefaultConditions(ctx.query);
            ctx.body = await Response.fromPromise(dbModel.getCount(conditions).exec());
        });

        //id查找
        if(switchers.findById)
        this.get('/:_id', async ctx => {
            const {_id} = await this.getRequestParams(ctx);
            if(!_id){
                ctx.body = new Response().failure('_id不能为空');
                return;
            }
            // console.log(this.getTableName() + ' getById ' + _id);
            ctx.body = await Response.fromPromise(dbModel.getById(_id).exec());
        });

        //插入
        if(switchers.insert)
        this.post('/', async ctx => {
            const data = await this.parsePostData(ctx);
            ctx.body = await Response.fromPromise(dbModel.insert(data));
        });

        //id更新
        if(switchers.update)
        this.put('/', async ctx => {
            const data = await this.getRequestParams(ctx);
            //自动填入更新时间
            if (data && !data.updateTime) {
                data.updatTime = Date.now();
            }
            ctx.body = await Response.fromPromise(dbModel.updateOne(data).exec());
        });

        //条件删除,逻辑删除，仅把disabled字段设为true
        if(switchers.remove)
        this.delete('/', async ctx => {
            const query = ctx.query;
            const conditions = this.getDefaultConditions(query);
            ctx.body = await Response.fromPromise(dbModel.update(conditions, { disabled: true }).exec());
        });

        //id删除,逻辑删除，仅把disabled字段设为true
        if(switchers.removeById)
        this.delete('/:_id', async ctx => {
            const {_id} = await this.getRequestParams(ctx);
            const updateData = {
                disabled: true,
                updateTime: Date.now(),
            };
            ctx.body = await Response.fromPromise(dbModel.update({ _id }, updateData).exec());
        });

        //条件删除，物理删除，慎用
        if(switchers.kill)
        this.delete('/kill', async ctx => {
            const {query} = await this.getRequestParams(ctx);
            const conditions = this.getDefaultConditions(query);
            ctx.body = await Response.fromPromise(dbModel.remove(conditions).exec());
        });

    }

    async getRequestParams(ctx){
        if(ctx.method === 'GET' || ctx.method === 'DELETE'){
            return Object.assign({}, ctx.params, ctx.query);
        }else if(ctx.method === 'POST' || ctx.method === 'PUT'){
            return await this.parsePostData(ctx);
        }
    }

    async parsePostData(ctx){
        return await postParse.parsePostData(ctx);
    }

    /**
     * 获得默认列表的query conditions
     * @param query
     * @returns {{}}
     */
    getDefaultConditions(query) {
        let c = {
            disabled: {
                $ne: true, //默认筛选掉disabled=true的数据
            },
        };
        if (query) {
            if (query.conditions) {
                let conditions = query.conditions;
                if(typeof conditions === 'string') conditions = JSON.parse(conditions);
                c = Object.assign(c, conditions);
            } else {
                c = Object.assign(c, query);
                //TODO
                delete c.pageSize;
                delete c.currentPage;
                delete c.sort;
            }
        }
        delete c.Timestamp;
        return c;
    }

    /**
     * 获得默认列表的query sortOrder
     * @param query
     * @returns {{_id: number}}
     */
    getDefaultSortOrder(query) {
        if (query && query.sort) {
            if (typeof query.sort === 'string') {
                query.sort = JSON.parse(query.sort);
            }
            return query.sort;
        }
        return { _id: -1 };
    }
}