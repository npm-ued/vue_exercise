/*
 * @Author: sail web admin
 * @Date: 2020-04-20 15:48:41
 * @Last Modified by: sail web admin
 * @Last Modified time: 2020-05-09 17:26:13
 * vue配置的入口文件
 */

import Vue from 'vue';
import iView from 'view-design';
import i18n from './i18n';

import './assets/styles/theme/index.less'; // 引入自定义样式
import VCharts from 'v-charts';
import App from './app.vue';
import interceptor from './assets/js/interceptor';
import Router from './router';
import store from './store';
import config from './config';
import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

const requireComponent = require.context( // 先获取所有组件
  './views/components/common', // 其组件目录的相对路径
  false, // 是否查询其子目录
  /\.vue$/ // 匹配基础组件文件名的正则表达式
);
requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName); // 获取组件配置
  const componentName = upperFirst( // 获取组件的 PascalCase 命名
    camelCase(
      fileName.replace(/^\.\/(.*)\.\w+$/, '$1') // 剥去文件名开头的 `'./` 和结尾的扩展名
    )
  );
  Vue.component( // 全局注册组件
    componentName,
    // 如果这个组件选项是通过 `export default` 导出的，那么就会优先使用 `.default`，否则回退到使用模块的根。
    componentConfig.default || componentConfig
  );
});
Vue.use(iView, {
  i18n: function (path, options) {
    const value = i18n.t(path, options);
    if (value !== null && value !== undefined) return value;
    return '';
  }
}); // 引用iView

Vue.locale = () => {};

Vue.use(VCharts); // 全局引用v-charts

Vue.prototype.$config = config; // 全局注册应用配置

const UISetOptionsStr = localStorage.getItem('UISetOptions');
let UISetOptions = {};
if (UISetOptionsStr) {
  try {
    UISetOptions = JSON.parse(UISetOptionsStr);
  } catch (e) {
    console.error('not allow localStorage');
  }
}
Vue.prototype.$uiSetOptions = UISetOptions || {}; // 页面的ui选项

Vue.directive('permissions', { // 自定义权限指令
  inserted (el, binding, vnode) {
    const { value } = binding;
    const roles = store.state.user.access || []; // 获取当前登录用户的权限列表
    console.log(roles);
    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value;

      const hasPermission = roles.some(role => {
        return permissionRoles.includes(role);
      });
      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error(`need permissions! Like v-permissions="['admin','editor']"`);
    }
  }
});

export default new Vue({
  el: '#app',
  router: Router,
  template: '<App/>',
  store,
  i18n,
  components: {
    App
  },
  methods: {
  }
});
