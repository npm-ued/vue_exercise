const CopyWebpackPlugin = require('copy-webpack-plugin');
const MonitorPlugin = require('monitor-webpack-plugin');
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const isNotDevelopment = process.env.NODE_ENV != 'development';

const resolve = dir => {
  return path.join(__dirname, dir);
};

let devServerConfig;
// 获取dev.server的自定义配置
const devServerConfigPath = path.resolve(resolve('./'), 'dev.server.js');
if (fs.existsSync(devServerConfigPath)) {
  try {
    devServerConfig = require(devServerConfigPath);
  } catch (e) {
    console.error(`Error loading dev.server.js`);
    throw e;
  }
}

const pluginList = [
  new CopyWebpackPlugin([{
    from: 'src/assets/libs',
    to: 'libs/'
  }], {
    ignore: [],
    copyUnmodified: true,
    debug: 'debug'
  })
];
if (isNotDevelopment) {
  const cdnUrlList = ['./libs/vue/2.5.16/vue.min.js', './libs/vue-router/3.0.1/vue-router.min.js', './libs/iview/4.0.1/iview.min.js'];
  pluginList.push(
    new MonitorPlugin({
      enable: true,
      inject: 'head',
      paths: cdnUrlList,
      content: ''
    })
  );
}
module.exports = {
  runtimeCompiler: true,
  // publicPath: 'vueRouter',
  assetsDir: 'assets', // 修改静态资源路径
  productionSourceMap: true, // 生产环境开启source map
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('@assets', resolve('src/assets'))
      .set('@views', resolve('src/views'));
    config.plugin('provide').use(webpack.ProvidePlugin, [{
      'window.Quill': 'quill/dist/quill.js',
      'Quill': 'quill/dist/quill.js'
    }]);
  },
  configureWebpack: { // 修改webpack配置（不建议直接修改 webpack 的配置）
    externals: isNotDevelopment ? {
      'vue': 'Vue',
      'view-design': 'iView',
      'vue-router': 'VueRouter'
    } : {},
    plugins: pluginList
  },
  devServer: Object.assign({
    port: 8081,
    compress: true,
    disableHostCheck: true // That solved it
  }, devServerConfig)
};
