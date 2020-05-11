const Mock = require('mockjs'); // mockjs 导入依赖模块
const bodyParser = require('body-parser');
const util = require('./util'); // 自定义工具模块
// 返回一个函数
module.exports = function (app) {
  // body 参数插件
  // app.use(bodyParser.json());
  // app.use(
  //   bodyParser.urlencoded({
  //     extended: true
  //   })
  // );
  // 监听http请求
  app.get('/user/userinfo', function (rep, res) {
    // 每次响应请求时读取mock data的json文件
    // util.getJsonFile方法定义了如何读取json文件并解析成数据对象
    const json = util.getJsonFile('./userInfo.json');
    // 将json传入 Mock.mock 方法中，生成的数据返回给浏览器
    res.json(Mock.mock(json));
  });
};
