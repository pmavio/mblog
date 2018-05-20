var JsonUtil = function() {};

/**
 * 返回成功,包含页数
 * @param result 数据对象
 * @param result 数据页数
 */
JsonUtil.prototype.returnTotalSuccessJson = function(result, total) {
    if (result) {
        if (result.length > 0) {
            return `{"code":0,"message":"","total":${total},"result": ${JSON.stringify(result)}}`
        } else if (result.length === 0) {
            return '{"code":1,"message":"暂无数据","total":0,"result":""}'
        } else {
            return `{"code":0,"message":"","total":${total},"result":['${JSON.stringify(result)}']}`
        }
    } else {
        return '{"code":1,"message":"暂无数据","total":0,"result":""}'
    }

};


/**
 * 返回成功
 * @param result 数据对象
 */
JsonUtil.prototype.returnSuccessJson = function(result) {
    if (result) {
        if (result.length > 0) {
            return '{"code":0,"message":"","result":' + JSON.stringify(result) + '}'
        } else if (result.length === 0) {
            return '{"code":1,"message":"暂无数据","result":""}'
        } else {
            return '{"code":0,"message":"","result":[' + JSON.stringify(result) + ']}'
        }
    } else {
        return '{"code":1,"message":"暂无数据","result":""}'
    }

};



/**
 * 返回失败
 * @param result 数据对象
 */
JsonUtil.prototype.returnFailureJson = function(message) {
        return '{"code":1,"message":"' + message + '","result":""}'
    }
    //判断是否为json对象
JsonUtil.prototype.isJson = function(obj) {
    var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() === "[object object]" && !obj.length;
    return isjson;
}

//判断是否为json空对象
JsonUtil.prototype.isEmptyObject = function(obj) {
    for (var key in obj) {
        if (key !== '' || key != null) {
            return false;
        }

    }
    return true
}




module.exports = new JsonUtil();