const generatedConfig = require('./config.json');

const config = {
    apiPort: generatedConfig.apiPort,
    clientDns: generatedConfig.clientDns,
    apiDns: generatedConfig.apiDns,
    apiDns2: generatedConfig.apiDns,

    //输出路径
    publicPath: "../../api/dist/",

};
console.log({config});

//生产环境
if (process.env.NODE_ENV === 'production') {
}

module.exports = config;