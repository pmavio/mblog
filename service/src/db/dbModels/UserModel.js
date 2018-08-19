import BaseDbModel from '../BaseDbModel';
import Response from "../../rest/Response";

/**
 * blogUser表的数据库连接类
 */
export default class UserModel extends BaseDbModel{

    getTableName(){
        return 'blogUser';
    }

    getTableStructure(){
        return {
            username:String,            //log记录的类型
            password: String,         //记录的来源
        }
    }

}