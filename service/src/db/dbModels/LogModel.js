import BaseDbModel from '../BaseDbModel';
import Response from "../../rest/Response";


const TYPE_UNHANDLED_REJECTION = 'unhandledRejection';
const TYPE_UNCAUGHT_EXCEPTION = 'uncaughtException';
const TYPE_RESPONSE = 'response';

const SOURCE_SERVICE = 'service';

/**
 * menu表的数据库连接类
 */
export default class LogModel extends BaseDbModel{

    getTableName(){
        return 'log';
    }

    getTableStructure(){
        return {
            type:String,            //log记录的类型
            source: String,         //记录的来源
            content: Object,        //log内容
        }
    }

    parseLogContent(content){
        if(content instanceof Error){
            content = {
                name: content.name,
                message: content.message,
                stack: content.stack,
            };
        }

        return content;
    }

    log(type, content){
        content = this.parseLogContent(content);
        const data = {
            type: type,
            source: SOURCE_SERVICE,
            content: content,
        };
        if(type === TYPE_UNCAUGHT_EXCEPTION
         ||type === TYPE_UNHANDLED_REJECTION){
            console.error(data);
        }
        this.insert(data);
        return data;
    }

    /**
     * 记录未处理的Promise异常
     * @param error
     * @returns {*}
     */
    logUnhandledRejection(error){
        return this.log(
            TYPE_UNHANDLED_REJECTION,
            error,
        );
    }

    /**
     * 记录未捕获的主线异常
     * @param error
     * @returns {*}
     */
    logUncaughtException(error){
        return this.log(
            TYPE_UNCAUGHT_EXCEPTION,
            error,
        )
    }

    logResponse(ctx){
        const logData = {
            method: ctx.request.method,
            originalUrl: ctx.request.originalUrl,
            ip: ctx.request.ip,
            status: ctx.status,
            body: ctx.body,
        };
        if(logData.method === 'GET'){
            logData.requestParams = ctx.request.query;
        }else{
            logData.requestParams = ctx.request.body;
        }

        if(ctx.request.originalUrl.indexOf('/log') >= 0){
            // 记录log的查询记录时，不记录body
            delete logData.body;
        }

        return this.log(
            TYPE_RESPONSE,
            logData,
        )
    }



}