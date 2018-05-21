import BaseDbModel from '../BaseDbModel';

/**
 * 编织花纹表的数据库连接类
 */
export default class BandModel extends BaseDbModel{

    getTableName(){
        return 'band';
    }

    getTableStructure(){
        return {
            name: String,   //名称
            tags: Object,   //标签

            bunch: Number,  //束数
            length: Number, //长度

            _initSwap: Boolean,    //初始状态，false为先上下，true为先刮搭

            lines: Object,   //
            blockMap: Object, //

            lineSeparator: String,  //文字编织程序的行分隔符
            sideSeparator: String,  //文字编织程序的面分隔符
        }
    }
}