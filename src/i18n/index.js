import Vue from 'vue';
import VueI18n from 'vue-i18n';
import en from 'view-design/dist/locale/en-US';
import cn from 'view-design/dist/locale/zh-CN';
import zhCNLocal from './zh-CN/index';
import enUSLocal from './en-US/index';
const messages = {
  'zh-CN': Object.assign(cn, zhCNLocal),
  'en-US': Object.assign(en, enUSLocal)
};
Vue.use(VueI18n);
let systemLan = 'en-US';
const navigatorLan = navigator.language; // 获取浏览器的语言设置
if (navigatorLan.indexOf('zh') == 0) {
  systemLan = 'zh-CN'; // 汉语默认设置成中文简体
}
if (localStorage.getItem('locale')) {
  systemLan = localStorage.getItem('locale');
}
// 设置参数，创建 Vuei18n 的实例。
const i18n = new VueI18n({
  locale: systemLan, // set locale
  messages // set locale messages
});

export default i18n;
