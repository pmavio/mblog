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
            length: Number, //长度,摆数

            _initSwap: Boolean,    //初始状态，false为先上下，true为先刮搭

            lines: Object,   //
            blockMap: Object, //
            encryptedStr: String,   //压缩的内容
            bitmapBase64: String,   //图片内容
            bitData: Object,   //图片内容
        }
    }


    getList(conditions, rows = {name: 1, tags: 1, bunch: 1, length:1, _initSwap: 1, bitmapBase64: 1}) {
        return this.dbModel.find(conditions, rows);
    }
}