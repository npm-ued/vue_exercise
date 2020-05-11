/*
 * @Author: sail web admin
 * @Date: 2020-04-20 15:38:44
 * @Last Modified by: sail web admin
 * @Last Modified time: 2020-04-20 15:48:31
 * 获取module目录下的所有路由
 */

const files = require.context('.', false, /\.js$/);
let configRouters = [];

files.keys().forEach((key) => {
  if (key === './index.js') return;
  configRouters = configRouters
    .concat(files(key).default)
    .sort((a, b) => a.sort ? (a.sort - b.sort) : -1);
});

export default configRouters;
