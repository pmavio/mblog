/**
 * 格式化的响应类型
 */
export default class Response{

    static format(response) {
        if (response === undefined || response === null) {
            return new Response();
        }
        //     return new Response().failure('Reponse.format 接受了一个空对象', response);
        // }else
        if(response instanceof Error){
            return new Response().failure(response.stack);
        }
        if (response.code !== undefined) {
            return new Response(response.result, response.code, response.message, response.source);
        } else {
            return new Response(response);
        }
    }

    static async fromPromise(promise) {
        if (!promise || !promise instanceof Promise) {
            throw '传入参数不是一个Promise'
        }
        return await promise
            .then(res => {
                return Response.format(res).success();
            })
            .catch(err => {
                let message = '';
                if (err && err.message) message = err.message;
                if(err instanceof Error) message += err.stack
                return Response.format(err).failure(message);
            })
    }

    static isSuccess(response) {
        if (response &&
            // response instanceof Response &&
            response.code === 0) {
            return true;
        } else {
            return false;
        }
    }

    constructor(result = '', code = null, message = null, source = null){
        this.success(result);
        if(code) this.code = code;
        if(message) this.message = message;
        if(source) this.source = source;
        else{
            this.source = 'service';
        }
    }

    success(result){
        this.code = 0;
        if (result !== undefined) {
            this.result = result;
        }
        return this;
    }

    failure(message = '', code = 1){
        this.message = message;
        this.code = code;
        return this;
    }

    setDuration(ms){
        this.duration = ms;
        return this;
    }

    get(){
        return {
            code: this.code,
            message: this.message,
            result: this.result,
            source: this.source,
            duration: this.duration,
        }
    }

    toString(){
        return JSON.stringify(this.get())
    }
}