import Vue from 'vue';
import axios from 'axios';
import store from '../../store';
import i18n from '../../i18n';

const $ajax = axios.create();// 修改名称  抽取所有的URL作为一个配置对象
Vue.prototype.$ajax = $ajax;
// ajax缓冲动画

const loading = document.getElementsByClassName('loadingWrap')[0];
const body = document.getElementsByTagName('body')[0];

// 向服务器发出请求时
$ajax.interceptors.request.use(config => {
  if (config.isLoading) {
    loadingShow();
  }
  store.commit('changeLoadingState', true);
  if (localStorage.JWT_TOKEN) { // 本地存在时 添加表头x-access-token
    config.headers['Authorization'] = `${localStorage.JWT_TOKEN}`;
  }
  const lang = 'en-US';
  config.headers['Accept-Language'] = localStorage.locale || lang;
  // const prefixProtocol = ((document.location.protocol == 'https:') ? ' https://' : ' http://');// 根据环境配置协议
  const prefixProtocol = 'https://';
  config.url = prefixProtocol + process.env.VUE_APP_HOST + config.url;
  return config;
}, err => {
  console.error(err);
  return Promise.reject(err);
});

// 数据返回时
$ajax.interceptors.response.use(function (response) { // 对返回的数据进行一些处理
  store.commit('changeLoadingState', false);
  loadingHide(); // 去除全局loading
  loading.className = 'loadingWrap';
  body.setAttribute('style', 'overflow: scroll');
  return response;
}, (error) => {
  store.commit('changeLoadingState', false);
  loadingHide();
  if (error.response && error.response.data && error.response.data.code) {
    if (error.response.data.code == 401 || error.response.data.code == 402 || error.response.data.code == 403) {
      // 登录失效
      if (error.response.data.code == 402) {
        this.$Message['warn']({
          background: true,
          content: `${i18n.tc('Common.LoginExpired')}`
        });
      } else {
        // 服务器响应异常（状态：002），请重新登录系统！
        this.$Message['error']({
          background: true,
          content: `${error.response.data.msg || i18n.tc('Common.ServerException')}`
        });
      }
      localStorage.JWT_TOKEN = '';
      localStorage.YK_TICKET = '';
      if (!localStorage.YK_TICKET) {
        window.location.href = casOut;
      }
    } else if (error.response.data.msg) {
      this.$Message['error']({
        background: true,
        content: `${error.response.data.msg}`
      });
    } else {
      // 服务器响应异常（状态：001），请刷新页面，重新尝试！
      this.$Message['error']({
        background: true,
        content: `${i18n.tc('Common.ServerExceptionTryAgain')}`
      });
    }
  } else {
    this.$Message['error']({
      background: true,
      content: `${i18n.tc('Common.NetworkFail')}`
    });
  }
  return Promise.reject(error);
});
function loadingShow () { // 显示loading效果
  loading.className = 'loadingWrap active';
  body.setAttribute('style', 'overflow: hidden');
}
function loadingHide () { // 隐藏loading效果
  if (store.state.axios.loadingCount <= 0) {
    loading.className = 'loadingWrap';
    body.setAttribute('style', 'overflow: auto');
  }
}
export default $ajax;
