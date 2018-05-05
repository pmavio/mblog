import BaseDbModel from '../BaseDbModel';

/**
 * menu表的数据库连接类
 */
export default class Menu extends BaseDbModel{

    getTableName(){
        return 'menu';
    }

    getTableStructure(){
        return {
            name: String,       //菜单名称
            path: String,       //菜单路径
            component: String,  //vue文件位置
            sort: Number,       //排序
            remark: String,     //注释

            children: Object,   //子菜单
            platform: String,   //平台类型
        }
    }
}