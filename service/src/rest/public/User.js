import BaseRouter from '../BaseRouter';
import dbModels from '../../db/dbModels';
import Response from "../Response";

export default class User extends BaseRouter{

    getTableName(){
        return 'blogUser';
    }

    initRoutes(dbModel){

    }

    getDefaultListRows(query){
        return {password: 0, createTime: 0, updateTime: 0};
    }
}