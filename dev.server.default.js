/*
 * @Author: sail web admin
 * @Date: 2020-04-20 15:52:08
 * @Last Modified by: sail web admin
 * @Last Modified time: 2020-05-11 17:30:30
 */

const mock = require('./mock'); // mock服务

module.exports = {
  port: 8088,
  compress: true,
  disableHostCheck: true, // That solved it
  before: (app) => {
    mock(app);
  },
  public: 'localhost:8088', // 通过webpack-dev-server默认打开浏览器的地址
  proxy: {
    '/api': {
      target: 'http://localhost:8088/', // 后端的地址替换即可
      pathRewrite: { '^/api': '' }
    }
  }
};
