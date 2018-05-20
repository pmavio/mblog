//配置热加载

var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');
var config = require('../webpack.config');


const compiler = webpack(config);

module.exports.webpackDev = webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: { colors: true },
}); 
module.exports.hot = webpackHotMiddleware(compiler);

