import axios from 'axios';
import Response from './Response';
import KoaRouter from 'koa-router';
import querystring from 'querystring'; //post请求处理参数
import postParse from '../utils/postParse'

export default class ServerDao {

    constructor(serverBaseUrl, moduleName, tableName) {
        this.serverBaseUrl = serverBaseUrl;
        this.tableName = tableName;
        this.moduleName = moduleName;
        this.tableBaseUrl = `/${moduleName}/${tableName}`;
    }

    getTableUrl() {
        return this.serverBaseUrl + this.tableBaseUrl;
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

    async getList(conditions = {
        currentPage: null,
        pageSize: null,
        sort: null,
    }) {
        return await Response.fromPromise(
            axios.get(this.getTableUrl(), { params: conditions })
            .then(res => res.data)
        );
    }

    async getListByIds(ids) {
        if (!Array.isArray(ids) && ids.length === 0) {
            return new Response().failure('未获得ids');
        }
        ids = ids.join(',');
        return await Response.fromPromise(
            axios.get(this.getTableUrl() + '/getListByIds', { params: { ids } })
            .then(res => res.data)
        );
    }

    async getCount(conditions) {
        return await Response.fromPromise(
            axios.get(this.getTableUrl() + '/count', { params: conditions })
            .then(res => res.data)
        );
    }

    async getById(id) {
        const url = this.getTableUrl() + '/' + id;
        //TODO 验证id是否不为空，以及类型和长度
        return await Response.fromPromise(
            axios.get(url)
            .then(res => res.data)
        );
    }

    async insert(data) {
        // if (typeof data !== 'string') {
        //     data = querystring.stringify(data);
        // }
        return await Response.fromPromise(
            axios.post(this.getTableUrl(), data)
            .then(res => res.data)
        );
    }

    async update(data) {
        if (typeof data !== 'string') {
            data = querystring.stringify(data);
        }
        return await Response.fromPromise(
            axios.put(this.getTableUrl(), data)
            .then(res => res.data)
        );
    }

    /**
     * 使用条件进行逻辑删除
     * @param conditions
     * @returns {Promise.<*>}
     */
    async remove(conditions) {
        return await Response.fromPromise(
            axios.delete(this.getTableUrl(), { params: conditions })
            .then(res => res.data)
        );
    }

    /**
     * 使用id进行逻辑删除
     * @param id
     * @returns {Promise.<*>}
     */
    async removeById(id) {
        return await Response.fromPromise(
            axios.delete(this.getTableUrl() + '/' + id)
            .then(res => res.data)
        );
    }

    /**
     * 物理删除,慎用
     * @param conditions
     * @returns {Promise.<*>}
     */
    async kill(conditions) {
        return await Response.fromPromise(
            axios.delete(this.getTableUrl() + '/kill', { params: conditions })
            .then(res => res.data)
        );
    }

    /**
     * 绑定七种基础restApi方法
     */
    bindRouter(router = undefined, options = {
        getList: true,
        getListByIds: false,
        getCount: true,
        getById: true,
        insert: true,
        update: true,
        remove: false,
        removeById: false,
        kill: false, //物理删除开关，打开此路由需谨慎
    }) {
        if (!router || !router instanceof KoaRouter) {
            throw 'ServerDao.bindRouter 传入参数不是一个KoaRouter'
        }

        const self = this;
        if (options.getList) {
            router.get('/', async ctx => {
                ctx.body = await self.getList(ctx.query);
            })
        }

        if (options.getListByIds) {
            router.get('/getListByIds', async ctx => {
                ctx.body = await self.getListByIds(ctx.query.ids);
            })
        }

        if (options.getCount) {
            router.get('/count', async ctx => {
                ctx.body = await self.getCount(ctx.query);
            })
        }

        if (options.getById) {
            router.get('/:id', async ctx => {
                const _id = ctx.params.id;
                ctx.body = await self.getById(_id);
            });
        }

        if (options.insert) {
            router.post('/', async ctx => {
                // const queryData = querystring.stringify(ctx.request.body);
                const queryData = ctx.request.body;
                ctx.body = await self.insert(queryData);
            })
        }

        if (options.update) {
            router.put('/', async ctx => {
                const queryData = querystring.stringify(ctx.request.body);
                ctx.body = await self.update(queryData);
            })
        }

        if (options.remove) {
            router.delete('/', async ctx => {
                ctx.body = await self.remove(ctx.query);
            })
        }

        if (options.removeById) {
            router.delete('/:id', async ctx => {
                const _id = ctx.params.id;
                ctx.body = await this.removeById(_id);
            })
        }

        if (options.kill) {
            router.delete('/kill', async ctx => {
                ctx.body = await self.kill(ctx.query);
            })
        }
    }
}