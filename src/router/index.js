/*
 * @Author:
 * @Date: 2020-04-20 16:01:34
 * @Last Modified by:
 * @Last Modified time: 2020-05-11 17:57:11
 * 路由公共处理
 */

import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './modules';
import axios from 'axios';
import jsonwebtoken from 'jsonwebtoken';
import i18n from '../i18n';

Vue.use(VueRouter);

const router = new VueRouter({
  routes,
  scrollBehavior (to, from, savedPosition) { // 滚动条定位到顶部
    if (savedPosition) return savedPosition;
    else return { x: 0, y: 0 };
  }
});

// 获取用户token
const getToken = function (next) {
  axios.get(`${process.env.VUE_APP_CAS_HOST}/api/jwt?service=yunkong&ticket=${localStorage.getItem('YK_TICKET')}`)
    .then(function (res) {
      if (res.data.code == 200) {
        try {
          localStorage.JWT_TOKEN = res.data.body;
          localStorage.userInfo = JSON.stringify(jsonwebtoken.decode(localStorage.JWT_TOKEN)); // 解析用户token
        } catch (err) {
          const errorSource = storageTest();
          alert(`${errorSource ? '用户token解析失败，请重新登录' : '请关闭无痕模式后，重新登录'}`);
          localStorage.JWT_TOKEN = '';
          localStorage.YK_TICKET = '';
          loginOut();
        }
        registerUser(next);
      } else {
        localStorage.JWT_TOKEN = '';
        localStorage.YK_TICKET = '';
        if (res.data.code == 505) alert('登录过期，请重新登录系统！');
        else alert(res.data.message);
        loginOut();
        next();
      }
    })
    .catch(function (error) {
      console.log(error);
      next();
    });
};
const prefixProtocol = ((document.location.protocol == 'https:') ? ' https://' : ' http://');// 根据环境配置协议
// 同步用户信息
const registerUser = function (next) {
  axios.get(`${prefixProtocol + process.env.VUE_APP_HOST}/user_handle/v2/sync`, { headers: { 'Authorization': `Bearer ${localStorage.JWT_TOKEN}` } })
    .then(function (res) {
      next();
    }).catch(function (error) {
      if (error.response.data.code == 401 || error.response.data.code == 402) {
        alert('服务器响应异常（状态：002），请重新登录系统！');
        localStorage.JWT_TOKEN = '';
        localStorage.YK_TICKET = '';
        if (!localStorage.YK_TICKET) loginOut();
      } else if (error.response.data.msg) alert(error.response.data.msg);
      else alert('服务器响应异常（状态：001），请刷新页面，重新尝试！');
      next();
    });
};
// 检查浏览器是否支持正常存储 localStorage
const storageTest = function () {
  try {
    localStorage.setItem('key', 'value');
    localStorage.removeItem('key');
    return true;
  } catch (e) {
    return false;
  }
};
function loginOut () {
  window.location.href = process.env.VUE_APP_CAS_OUT;
}
router.beforeEach((to, from, next) => { /* 路由发生变化修改页面title */
  document.title = `${i18n.t('SystemName')}-${i18n.t(to.meta.title) || '管理后台'}`;
  // if (!localStorage['JWT_TOKEN'] || localStorage['JWT_TOKEN'] == 'undefined' || localStorage['JWT_TOKEN'] == 'null') { // 用户token未保存
  //   if (localStorage['YK_TICKET'] && localStorage['YK_TICKET'] != 'undefined' && localStorage['YK_TICKET'] != 'null') { // ticket已保存，请求接口获取用户token
  //     getToken(next);
  //   } else if (util.getQueryString('ticket') && util.getQueryString('ticket') != 'undefined' && util.getQueryString('ticket') != 'null') { // ticket未保存，但在链接中存在，请求接口获取用户token，并保存ticket
  //     try {
  //       localStorage.setItem('YK_TICKET', util.getQueryString('ticket'));
  //       getToken(next);
  //     } catch (err) {
  //       const errorSource = storageTest();
  //       alert(`${errorSource ? '用户token解析失败，请重新登录' : '请关闭无痕模式后，重新登录'}`);
  //       localStorage.JWT_TOKEN = '';
  //       localStorage.YK_TICKET = '';
  //       loginOut();
  //     }
  //   } else {
  //     localStorage.YK_TICKET = '';
  //     window.location.href = process.env.VUE_APP_CAS_LOGIN;
  //   }
  // } else next(); // 已保存用户token，正常访问
  next();
});

export default router;
