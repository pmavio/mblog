const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const moduleConfigs = {};
const mongoConnections = {};
const mongoDbModels = {};

class DB{
    static registerModule(moduleName, config){
        moduleConfigs[moduleName] = config;
    }

    static fromModule(moduleName){
        const config = moduleConfigs[moduleName];
        if(config){
            return new DB(config);
        }else{
            throw `未找到名为${moduleName}的module对应的config，请先调用registerModule以注册`;
        }
    }

    static getMongoConnection(dbUrl){
        let connection = null;
        if(!mongoConnections[dbUrl]) {
            connection = mongoose.createConnection(dbUrl);

            connection.on('connected', function (err) {
                if (err)
                    return err;
            });

            connection.on('error', function (err) {
                return err;
            });

            connection.on('disconnected', function () {
                return "Mongoose disconnected";
            });

            process.on('SIGINT', function () {
                connection.close(function () {
                    process.exit(0);
                });
            });

            mongoConnections[dbUrl] = connection;
        }else{
            connection = mongoConnections[dbUrl];
        }
        return connection;
    }

    static getMongoDbModel(tableName, tableStructure, connection){
        if(!tableName || typeof tableName !== 'string') throw 'DB.getDbModel tableName不能为空，且必须是字符串';
        else if(!tableStructure || typeof tableStructure !== 'object') throw 'DB.getDbModel tableStructure不能为空，且必须是对象';

        let model = mongoDbModels[tableName];

        if (!model) {
            //构建用户信息表结构
            const schema = new mongoose.Schema(tableStructure);

            //构建model
            model = mongoose.model(tableName, schema, tableName, {connection});
            if(connection){
                //根据mongoose.model方法的源码，若传入的connection不为空，需要手动执行init
                model.init();
            }

            mongoDbModels[tableName] = model;
        }
        return model;
    }

    get dbUrl() {
        return this._dbUrl;
    }

    set dbUrl(value) {
        this._dbUrl = value;
    }

    constructor(config = {
        dbUrl: null,
    }){
        if(!config.dbUrl) throw '未获得dbUrl';
        this._dbUrl = config.dbUrl;

        this.connection = DB.getMongoConnection(this._dbUrl);
    }

    getDbModel(tableName, tableStructure){
        return DB.getMongoDbModel(tableName, tableStructure, this.connection);
    }

}

module.exports = DB;