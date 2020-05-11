/*
 * @Author: sail web admin
 * @Date: 2020-04-21 10:17:45
 * @Last Modified by: sail web admin
 * @Last Modified time: 2020-04-21 10:18:23
 * 正则
 */

import util from './util';
const core = {};
core.RULES = {
  required: function (value) { // 必填项校验
    return value && value !== '';
  },
  email: function (value) { // email地址格式校验
    return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
  },
  url: function (value) { // 域名格式校验
    const reg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/;
    return reg.test(value);
  },
  number: function (value) { // 必须为数字
    return /^(\d+)(\.\d+)?$/.test(value);
  },
  integer: function (value) { // 必须为非负整数
    return /^\d+$/.test(value);
  },
  double: function (value) { // 必须为两位小数
    return /^(\d+)(\.\d{0,2})?$/.test(value);
  },
  telPhone: function (value) { // 固话格式校验
    return /^(\d{3}-\d{8}|\d{4}-\d{7})$/.test(value);
  },
  mobilePhone: function (value) { // 手机号校验
    return /^((13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8})$/.test(value);
  },
  specialStr: function (value) { // 是否包含特殊字符校验
    const regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/im;
    const regCn = /[·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im;
    return regEn.test(value) || regCn.test(value);
  },
  chineseStr: function (value) { // 必须为中文字符
    return /^[\u4E00-\u9FA5]+$/.test(value);
  },
  chineseStr2: function (value) { // 是否含有中文字符
    return /[\u4E00-\u9FA5]+/.test(value);
  },
  normalStr: function (value) { // 只能是中文、数字、字母
    const pattern = /^[A-Za-z0-9\u4e00-\u9fa5]+$/gi;
    return pattern.test(value);
  },
  regex: function (value, regex) {
    return new RegExp(regex).test(value);
  }
};

const Rule = {
  testPhone: (rule, value, callback) => {
    if (!value) {
      callback(new Error('请填写手机号'));
    } else {
      if (!core.RULES.mobilePhone(value)) {
        callback(new Error('手机号格式错误'));
      }
      callback();
    }
  },
  testPhoneUnnecessary: (rule, value, callback) => {
    if (!value) {
      callback();
    } else {
      if (!core.RULES.mobilePhone(value)) {
        callback(new Error('手机号格式错误'));
      }
      callback();
    }
  },
  testNum: (rule, value, callback) => {
    if (!value) {
      callback(new Error('请填写数据'));
    } else {
      if (!core.RULES.number(value)) {
        callback(new Error('只能输入数字'));
      }
      callback();
    }
  },
  testInteger: (rule, value, callback) => {
    if (!value) {
      if (!rule.noRequired) {
        callback(new Error('请填写数据'));
      } else {
        callback();
      }
    } else {
      if (!/^[1-9]\d*$/.test(value)) {
        callback(new Error('只能输入正整数'));
      } else if (rule.borrowType) { // 创建放款单合同期限
        if (rule.borrowType == 2 || rule.borrowType == 3) {
          if (value % 30) {
            callback(new Error('抵押类报单 合同期限应为30的倍数'));
          } else {
            callback();
          }
        } else {
          if (value % 10) {
            callback(new Error('合同期限应为10的倍数'));
          } else {
            callback();
          }
        }
      } else if (rule.halfway && value > 365) { // 在途查询间隔设置
        callback(new Error('最小数字为1，最大数字为365'));
      } else {
        callback();
      }
    }
  },
  testNumOnly: (rule, value, callback) => {
    const msg = rule.msgLabel || '';
    if (value || value === 0) {
      if (!core.RULES.number(value)) {
        callback(new Error(`${msg}必须为数字`));
      }
      callback();
    } else callback();
  },
  testTimeOverToday: (rule, value, callback) => {
    const today = new Date().getTime() - 24 * 60 * 60 * 1000;
    const timeStamp = new Date(value).getTime();
    if (!value) {
      callback(new Error('请填写数据'));
    }
    if (timeStamp - today >= 0) {
      callback();
    } else {
      callback(new Error('时间不能小于当前时间'));
    }
  },
  testTimeOverNow: (rule, value, callback) => {
    const nowTime = new Date().getTime();
    const timeStamp = new Date(value).getTime();
    if (!value) {
      callback(new Error('请填写数据'));
    }
    if (timeStamp - nowTime >= 0) {
      callback();
    } else {
      callback(new Error('时间不能小于当前时间'));
    }
  },
  testTimeBeforeToday: (rule, value, callback) => {
    const today = new Date().getTime();
    const timeStamp = new Date(value).getTime();
    if (!value) {
      callback(new Error('请填写数据'));
    }
    if (timeStamp - today < 0) {
      callback();
    } else {
      callback(new Error('时间不能大于当前'));
    }
  },
  cannot0: (rule, value, callback) => {
    if (value === 0) {
      callback(new Error('数据不能为0'));
    } else if (!value) {
      callback(new Error('数据不能为空'));
    } else {
      callback();
    }
  },
  IdentityCodeValid: (rule, value, callback) => {
    if (value) {
      if (!util.IdentityCodeValid(value, '')) {
        callback(new Error('身份证格式错误'));
      } else {
        callback();
      }
    } else {
      callback();
    }
  },
  checkMoney: (rule, value, callback) => {
    if (value) {
      if (!core.RULES.double(value)) {
        callback(new Error('请填写两位小数'));
      } else {
        callback();
      }
    } else {
      callback();
    }
  },
  // 合同总金额
  contractAmount: (rule, value, callback) => {
    const msg = rule.msgLabel || '';
    if (!value) {
      callback(new Error(`${msg}不能为空`));
    } else {
      if (!core.RULES.number(value)) {
        callback(new Error('只能输入数字'));
      } else if (!core.RULES.double(value)) {
        callback(new Error(`${msg}最多保留两位小数`));
      } else if (value.toString().split('.')[0].length > 9) {
        callback(new Error(`${msg}整数部分最多输入9位`));
      } else {
        callback();
      }
    }
  },
  checkRate: (rule, value, callback) => {
    const msg = rule.msgLabel || '';
    if (!value) {
      callback(new Error(`${msg}不能为空`));
    } else {
      if (!core.RULES.double(value)) {
        callback(new Error('请填写两位小数'));
      } else {
        callback();
      }
    }
  },
  // 企业统一社会信用代码
  checkRegNo1: (rule, value, callback) => {
    const regexp = /^[A-Z\d][\d]{7}[\da-zA-Z]{10}$/;
    if (value) {
      if (!regexp.test(value)) {
        callback(new Error('企业信息的统一社会信用代码格式错误'));
      } else {
        callback();
      }
    } else {
      callback();
    }
  },
  // 企业注册码
  checkRegNo2: (rule, value, callback) => {
    if (value) {
      if (!Number.isInteger(+value) || value.length != 15) {
        callback(new Error('企业信息的注册码必须为15位数字'));
      } else {
        callback();
      }
    } else {
      callback();
    }
  },
  // 中文不包含数字校验
  testChinese: (rule, value, callback) => {
    const msg = rule.msgLabel || '';
    if (value) {
      if (/\d+/.test(value)) {
        callback(new Error(`${msg}不能包含数字`));
      } else {
        callback();
      }
    } else {
      callback();
    }
  },
  // 中文不包含数字校验
  testOnlyChinese: (rule, value, callback) => {
    const msg = rule.msgLabel || '';
    if (value) {
      if (!/[\u4E00-\u9FA5]+/.test(value)) {
        callback(new Error(`${msg}只能输入汉字`));
      } else {
        callback();
      }
    } else {
      callback();
    }
  },
  // 字符串不包含汉字校验
  testStr: (rule, value, callback) => {
    const msg = rule.msgLabel || '';
    if (value) {
      if (/[\u4E00-\u9FA5]+/.test(value)) {
        callback(new Error(`${msg}不能包含汉字`));
      } else {
        callback();
      }
    } else {
      callback();
    }
  },
  // 持股比例校验
  testRatio: (rule, value, callback) => {
    console.log(rule);
    if (value && !/^(\d+)(\.\d+)?$/.test(value) && value != '**.**') {
      callback(new Error('股东信息的持股比例需为数字或**.**'));
    } else if (!value || value === '0' || value === 0) {
      value = '**.**';
      rule.defaultData(value);
      callback();
      // callback(new Error('股东的持股比例不能为空 (没有请填**.**)'));
    } else {
      callback();
    }
  },
  // 时间格式校验
  checkDateFormat: (rule, value, callback) => {
    const reg = /^(\d{4})(-)(\d{2})(-)(\d{2})$/;
    value = value ? value.replace('年', '-').replace('月', '-').replace('日', '') : '';
    if (value) {
      const arr = value.split('-');
      if (arr && arr.length == 3) {
        arr[1] = (arr[1].length == 1) ? (`0${arr[1]}`) : arr[1];
        arr[2] = (arr[2].length == 1) ? (`0${arr[2]}`) : arr[2];
        value = arr.join('-');
        if (!reg.test(value)) {
          callback(new Error('请输入正确的时间格式，如：xxxx-xx-xx'));
        } else {
          rule.formatDate(value);
          callback();
        }
      } else {
        callback(new Error('请输入正确的时间格式，如：xxxx-xx-xx'));
      }
    } else {
      callback();
    }
  }
};

export default Rule;
