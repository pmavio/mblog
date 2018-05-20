//实现koa session
//https://github.com/Secbone/koa-session2
const { randomBytes } = require('crypto');
import config from '../../config/basic.config';
import axios from './axios';
import ServerDao from '../restapi/ServerDao';
import Response from '../restapi/Response';

// session数据结构
// {
//     "sid": "String",
//     "content": "String",
//     "timestamp": "String",
//     "activeTime": "Number",
//     "timeout": "Number",
//     "platform": "String"
// }

class SessionDao extends ServerDao{
    async get(sid){
        let result = await axios.setAxiosGetPromise(
            this.getTableUrl() + '/' + sid
        );
        if(Response.isSuccess(result)){
            try {
                result = result.result;
                if (typeof result.content === 'string') {
                    result.content = JSON.parse(result.content);
                }
                return result;
            } catch (e) {
                console.log('api/utils/sessionUtils/MongoSessionController error', e.toString());
                return undefined;
            }
        }else{
            return undefined;
        }
    }

    async set(data){
        let postData = Object.keys(data)
            .map(key=>{
                let value = data[key];
                if (value || value instanceof Boolean) {
                    if (typeof value === 'object') value = JSON.stringify(value);
                    return key + '=' + value;
                }else return null;
            })
            .filter(s => s!==null)
            .join('&');
        const result = await axios.setAxiosPostPromise(this.getTableUrl(), postData);
        if (Response.isSuccess(result)) return result.result;
        else return undefined;
    }

    async remove(sid){
        let result = await axios.setAxiosDeletePromise(
            this.getTableUrl() + '/' + sid
        );
        if(Response.isSuccess(result)){
            return result.result;
        }else{
            return undefined;
        }
    }
}
const sessionDao = new SessionDao(config.system_dns, 'meeting', 'session');

//session保存的仓库，通过service层调用mongodb实现
class Store {
    constructor() {
        this.sessions = sessionDao;
    }

    getID(length) {
        return randomBytes(length).toString('hex');
    }

    async get(sid) {
        const session = await this.sessions.get(sid);
        if (!session) return undefined;
        if (session.timeout && session.timeout < Date.now()) {
            //session已过期
            this.destroy(sid);
            return undefined;
        } else {
            //TODO
        }
        // }

        return session;
    }

    async set(sessionContent, { sid, platform = '' } = {}) {
        if(!sid) sid = this.getID(24);

        let session = await this.sessions.get(sid);
        const now = Date.now();
        if (!session) {
            //新session
            session = {
                sid,
            }
        } else if (sid.indexOf('webapp')<0 && session.timeout > 0 && session.timeout < now) {
            //web session已过期
            this.destroy(sid);
            return;
        }
        //设置session内容
        if(!session.activeTime){
            session.activeTime = now + config.client_session_age;
        }
        if(!session.timeout){
            session.timeout = now + config.session_max_age;
        }
        session.content = sessionContent;
        session.platform = platform;

        try {
            this.sessions.set(session);
        } catch (err) {
        }

        return sid;
    }

    async save(session){
        try {
            return this.sessions.set(session);
        } catch (err) {
            return false;
        }
    }

    destroy(sid) {
        return this.sessions.remove(sid);
    }
}

const defaultKey = 'sid';

class SessionUtils {

    constructor(key = defaultKey, store = new Store()) {
        this.opts = { key, store};
        this.key = key;
        this.store = store;
    }

    getStore() {
        return this.store;
    }

    getKoaSession() {
        const { key, store } = this.opts;
        return async(ctx, next) => {
            // 从header中获取sessionid
            let id = this.getSessionId(ctx);
            ctx.sid = id;
            let session = await store.get(id);
            if (!id || !session || !session.content) {
                ctx.session = {};
            } else {
                ctx.session = session.content;
                // check session must be a no-null object
                if (typeof ctx.session !== "object" || ctx.session === null) {
                    ctx.session = {};
                }
            }

            const old = JSON.stringify(ctx.session);

            await next();

            // if not changed
            if (old === JSON.stringify(ctx.session)) return;

            // if is an empty object
            if (ctx.session instanceof Object && !Object.keys(ctx.session).length) {
                ctx.session = null;
            }

            // need clear old session
            if (id && !ctx.session) {
                await store.destroy(id, ctx);
                return;
            }

            ctx.sid = await this.generateSession(ctx, ctx.session, id);
        }
    }

    getSessionId(ctx) {
        let key = this.opts.key;
        let sid = null;
        if(ctx.headers[key]){
            sid = ctx.headers[key];
        }
        if(!sid || sid==='null') {
            sid = ctx.cookies.get(key, this.opts);
        }
        return sid;
    }

    /**
     * 生成session，返回sessionId
     * @param ctx
     * @param session
     * @param token
     * @returns {Promise.<*>}
     */
    async generateSession(ctx, session, token) {
        const timestamp = new Date().getTime();
        if (!session) session = {};
        session.timestamp = timestamp;

        let sid = token;
        sid = await this.store.set(session, Object.assign({sid: sid}, this.opts));
        ctx.cookies.set(this.key, sid, this.opts);
        return sid;
    }

    async clearSession(ctx) {
        const { key, store } = this.opts;
        let sid = this.getSessionId(ctx);
        if (sid) {
            const result = await this.store.destroy(sid);
            if (result.code === 0) {
                return true
            }
            return result.message;
        }
        return 'sessionUtils未获得sid';
    }

    /**
     * 设置session过期时间
     * @param ctx
     * @param timeout
     * @returns {Promise.<Boolean>}
     */
    async setSessionTimeout(ctx, timeout){
        const { store } = this.opts;
        let sid = this.getSessionId(ctx);
        let session = await store.get(sid);
        if(!session) return false;
        session.timeout = timeout;
        session.content = ctx.session;
        if(session.content) session.content.timeout = timeout;
        return await store.save(session);
    }
}

export default new SessionUtils();