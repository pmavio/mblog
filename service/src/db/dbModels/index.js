import LogModel from './LogModel';
import MenuModel from './MenuModel';

const modelTypes = [
    LogModel,
    MenuModel,
];

//tableName-modelType对应
const modelTypeMap = {};
modelTypes.forEach(modelType => {
    const tableName = modelType.prototype.getTableName();
    modelTypeMap[tableName] = modelType;
});


const modelMap = {};

/**
 * 默认moduleName
 * @type {string}
 */
const defaultModuleName = 'default';

/**
 * 返回一个数据库表连接对象
 * @param moduleName
 * @param tableName
 * @returns {Model}
 */
function from(moduleName, tableName) {
    if(!moduleName) moduleName = defaultModuleName;
    const key = moduleName + '|' + tableName;
    let model = modelMap[key];
    if(model) {
        return model;
    } else{
        const modelType = modelTypeMap[tableName];
        if(modelType === undefined){
            const allKeys = Object.keys(modelTypeMap);
            const errorMessage = `没有找到tableName=${tableName}的modelType\n当前已注册的modelTypes=${allKeys}`;
            throw new Error(errorMessage);
        }
        model = new modelType(null, moduleName);
        modelMap[key] = model;
        return model;
    }
}

export default {
    from,
}