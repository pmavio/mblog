import DB from './DB';

const allModels = {};

/**
 * db数据库表连接基础类
 */
export default class BaseDbModel{

    /**
     * 构造方法，传入db对象，或模块名称
     * @param db DB类的实例
     * @param moduleName 模块名称
     */
    constructor(db, moduleName){
        if(!db) db = DB.fromModule(moduleName);

        const tableStructure = Object.assign(
            this.getDefaultTableStructure(),
            this.getTableStructure()
        );

        this.dbModel = db.getDbModel(
            this.getTableName(),
            tableStructure
        );
    }

    /**
     * 返回表名，继承后必须重载
     * @returns {string}
     */
    getTableName() {
        return '';
    }

    /**
     * 返回表结构，继承后必须重载
     * @returns {{}}
     */
    getTableStructure() {
        return {};
    }

    /**
     * 所有表的通用结构
     */
    getDefaultTableStructure() {
        return {
            createTime: {      //创建时间
                type: Date,
                default: Date.now
            },
            updateTime: {      //更新时间
                type: Date,
                default: Date.now
            },
            disabled: {         //禁用状态
                type: Boolean,
                default: false
            },
        }
    }

    //全真七子
    getList(conditions, rows) {
        return this.dbModel.find(conditions, rows);
    }

    getCount(conditions) {
        return this.dbModel.count(conditions);
    }

    getById(_id, rows) {
        return this.dbModel.findOne({ _id }, rows);
    }

    insert(data) {
        const newData = new this.dbModel(data);
        return newData.save();
    }

    insertMany(dataArr) {
        return this.dbModel.insertMany(dataArr);
    }

    upsertMany(conditions, dataArr) {
        return this.dbModel.updateMany(conditions, dataArr, { upsert: true, multi: true });
    }

    updateById(data, _id) {
        if(!_id) _id = data._id;
        if(data._id) delete data._id;
        return this.dbModel.findByIdAndUpdate(_id, { $set: data });
    }

    update(conditions, data) {
        return this.dbModel.update(conditions, { $set: data }, { multi: true });
    }

    remove(conditions) {
        return this.dbModel.remove(conditions, { multi: true });
    }

    removeById(_id) {
        return this.dbModel.remove({ _id });
    }

}