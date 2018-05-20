//生成client的配置
const GlobalConfigs = require('../../config/globalConfigs');
const nodeEnv = process.env.NODE_ENV;
const globalConfigs = new GlobalConfigs(nodeEnv, 'client');
const apiDns = globalConfigs.getDNS('api');
const clientDns = globalConfigs.getDNS('client');
const apiPort = globalConfigs.getPort('api');
const ip = globalConfigs.getIpv4();
const fs = require('fs');
const configContent = JSON.stringify({ apiPort, ip, apiDns, clientDns});
fs.writeFileSync('./config/config.json', configContent);

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
//文件copy插件
const CopyWebpackPlugin = require('copy-webpack-plugin');
const vuxLoader = require('vux-loader');
const config = require('../config/basic.config');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

let webpackConfig = {
    //打包入口文件

    entry: {
        band: ["babel-polyfill", './src/views/band_vue/main.js'],
    },
    //输出文件设置
    output: {
        path: path.resolve(__dirname, config.publicPath),
        publicPath: config.publicPath,
        filename: '[name]/[name].js' // 每个入口js文件的生成配置
    },
    //注意webpack2.0中loader中必须写成vue-loader而不是vue
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        css: ExtractTextPlugin.extract({
                            loader: 'css-loader',
                            fallback: 'vue-style-loader'
                        }),
                        scss: 'style-loader!css-loader!sass-loader',
                        sass: 'style-loader!css-loader!sass-loader?indentedSyntax',
                    }
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                loader: 'css-loader',
            },
            {
                test: /\.(png|jpg|gif|svg|ico)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&mimetype=application/font-woff" },
            { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" }
        ]
    },
    plugins: [
        new CommonsChunkPlugin({
            name: "common",
            filename: "common.js" //忽略则以name为输出文件的名字，否则以此为输出文件名字
        }),
        new webpack.HotModuleReplacementPlugin(), //配置热加载
        new ExtractTextPlugin("[name]/[name].css"),
        new CopyWebpackPlugin([
            { from: './src/assets/img/band', to: './band/img' }
        ]),

    ],

    resolve: {
        extensions: [' ', '.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue/dist/vue',
            'src': resolve('src')
        }
    },
    //将vue的文件的访问的url设置成与后端端口一致
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        proxy: {
            '/': {
                target: config.apiDns
            }
        }
    },
    devtool: '#eval-source-map',

};

module.exports = vuxLoader.merge(webpackConfig, {
    plugins: ['vux-ui',
        {
            name: 'less-theme',
            path: 'src/assets/css/theme.less'
        }
    ]
});


if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map';
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])

}