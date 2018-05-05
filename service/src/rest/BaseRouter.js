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
            const query = this.getQuery(ctx);
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
        this.get('/:id', async ctx => {
            const _id = ctx.params.id;
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
            const data = await this.parsePostData(ctx);
            //自动填入更新时间
            if (data && !data.updatetime) {
                data.updatetime = Date.now();
            }
            ctx.body = await Response.fromPromise(dbModel.updateOne(data).exec());
        });

        //条件删除,逻辑删除，仅把enable字段设为false
        if(switchers.remove)
        this.delete('/', async ctx => {
            const query = ctx.query;
            const conditions = this.getDefaultConditions(query);
            ctx.body = await Response.fromPromise(dbModel.update(conditions, { enable: false }).exec());
        });

        //id删除,逻辑删除，仅把enable字段设为false
        if(switchers.removeById)
        this.delete('/:id', async ctx => {
            const _id = ctx.params.id;
            const updateData = {
                enable: false,
                updatetime: Date.now(),
            };
            ctx.body = await Response.fromPromise(dbModel.update({ _id }, updateData).exec());
        });

        //条件删除，物理删除，慎用
        if(switchers.kill)
        this.delete('/kill', async ctx => {
            const query = ctx.query;
            const conditions = this.getDefaultConditions(query);
            ctx.body = await Response.fromPromise(dbModel.remove(conditions).exec());
        });

    }

    /**
     * 转换带有美元符$的字符串为对象
     * @param ctx
     */
    getQuery(ctx){
        let query = ctx.query;
        if(query){
            //TODO 待优化
            const keys = Object.keys(query);
            keys.forEach(key => {
                let value = query[key];
                if(typeof value === 'string'){
                    if(value.startsWith('{') && value.endsWith('}')){
                        value = JSON.parse(value);
                    }else if(value.startsWith('[') && value.endsWith(']')){
                        value = JSON.parse(value);
                    }
                    query[key] = value;
                }
            });
        }
        return query;
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
            enable: {
                $ne: false, //默认筛选掉enable=false的数据
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