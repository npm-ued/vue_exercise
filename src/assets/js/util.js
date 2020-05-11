import moment from 'moment';
const util = {};
util.getUrlParam = function (name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`); // 构造一个含有目标参数的正则表达式对象
  const r = window.location.search.substr(1).match(reg); // 匹配目标参数
  if (r != null) return unescape(r[2]);
  return null; // 返回参数值
};
/**
 * 获取当前页面的url参数
 */
util.getParamsForUrl = function () {
  const _search = location.search;

  function parseUrl (_url) { // 定义函数
    const pattern = /(\w+)=(\w+)/ig; // 定义正则表达式
    const parames = {}; // 定义数组
    _url.replace(pattern, function (a, b, c) {
      parames[b] = c;
    });
    /* 这是最关键的.当replace匹配到classid=9时.那么就用执行function(a,b,c);其中a的值为:classid=9,b的值为classid,c的值为9;(这是反向引用.因为在定义 正则表达式的时候有两个子匹配.)然后将数组的key为classid的值赋为9;然后完成.再继续匹配到id=2;此时执行function(a,b,c);其中a的值为:id=2,b的值为id,c的值为2;然后将数组的key为id的值赋为2. */
    return parames; // 返回这个数组.
  }
  const parames = parseUrl(_search);
  return parames;
};
/**
 * 把from里的值赋给to, 覆盖to中已有的值m, 对象
 */
util.extendHard = function (to, from, keys, op) {
  if (!keys || !keys.length) keys = Object.keys(from);
  keys.forEach(function (key) {
    if (from.hasOwnProperty(key)) {
      if (from[key] != null) to[key] = from[key];
      else if (!op || op.include_null) to[key] = null;
    }
  });
  return to;
};

// 把from里的值赋给to, 不覆盖to中已有的值
util.extendSoft = function (to, from, keys) {
  if (!keys || !keys.length) keys = Object.keys(from);
  keys.forEach(function (key) {
    if (from.hasOwnProperty(key) && !to[key]) to[key] = from[key];
  });
  return to;
};
// 把from里的值赋给list, 覆盖list中已有的值
util.extendList = function (list, from, keys) {
  if (!keys || !keys.length) keys = Object.keys(from);
  if (!list || !list.length) return;
  list.forEach(function (to) {
    keys.forEach(function (key) {
      if (from.hasOwnProperty(key)) to[key] = from[key];
    });
  });
  return list;
};

util.numFixed2 = function (val) {
  if (Number(val) != Number(val)) {
    return '';
  }
  let s = (Math.round(val * 100) / 100).toString();
  let rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + 2) {
    s += '0';
  }
  if (s < 0) {
    s = '';
  }
  if (isNaN(s)) {
    s = '';
  }
  return Number(s);
};
util.getListMap = function (list) {
  const newObj = {};
  if (!list && Object.prototype.toString.call(list) !== '[object Array]') {
    return newObj;
  }
  list.forEach((item) => {
    newObj[item['value']] = item['name'];
  });
  return newObj;
};
util.list2Map = function (list, pk) {
  if (!pk) pk = 'id';
  const result = {};
  list.forEach(function (row) {
    result[row[pk]] = row;
  });
  return result;
};
/**
 *  实现Object深拷贝
 */
util.hardCopyJson = function (obj) {
  return JSON.parse(JSON.stringify(obj));
};
/**
 * 身份证格式校验
 */
util.IdentityCodeValid = function (code, desc) {
  const city = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江 ',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北 ',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏 ',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外'
  };
  let tip = '';
  let pass = true;

  if (!code || !/^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/i.test(code)) {
    tip = `${desc}身份证号格式错误`;
    pass = false;
  } else if (!city[code.substr(0, 2)]) {
    tip = `${desc}省份证地址编码错误`;
    pass = false;
  } else {
    // 18位身份证需要验证最后一位校验位
    if (code.length == 18) {
      code = code.split('');
      // ∑(ai×Wi)(mod 11)
      // 加权因子
      const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      // 校验位
      const parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
      let sum = 0;
      let ai = 0;
      let wi = 0;
      for (let i = 0; i < 17; i++) {
        ai = code[i];
        wi = factor[i];
        sum += ai * wi;
      }
      if (sum % 11 == 2) {
        if (code[17] == 'X' || code[17] == 'x') {

        } else {
          tip = `${desc}身份证校验位错误`;
          pass = false;
        }
      } else {
        if (parity[sum % 11] != code[17]) {
          tip = `${desc}身份证校验位错误`;
          pass = false;
        }
      }
    }
    if (code.length > 18) {
      tip = `${desc}身份证长度过长`;
      pass = false;
    }
  }
  // if (!pass) alert(tip);
  console.log(tip);
  return pass;
};
/**
 * 删除URL的参数
 */
util.funcUrlDel = function (name) {
  const loca = window.location;
  const baseUrl = `${loca.origin + loca.pathname}?`;
  const query = loca.search.substr(1);
  if (query.indexOf(name) > -1) {
    const obj = {};
    const arr = query.split('&');
    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].split('=');
      obj[arr[i][0]] = arr[i][1];
    }
    delete obj[name];
    const url = baseUrl + JSON.stringify(obj).replace(/[\"\{\}]/g, '').replace(/\:/g, '=').replace(/\,/g, '&');
    return url;
  }
};
/**
 * 删除URL的参数
 */
util.delQueStr = function (ref) { // 删除指定参数值
  const url = window.location.href;
  let str = '';
  if (url.indexOf('?') != -1) str = url.substr(url.indexOf('?') + 1);
  else return url;
  let arr = '';
  let returnurl = '';
  const setparam = '';
  if (str.indexOf('&') != -1) {
    arr = str.split('&');
    for (const i in arr) {
      if (arr[i].split('=')[0] != ref) {
        returnurl = `${returnurl + arr[i].split('=')[0]}=${arr[i].split('=')[1]}&`;
      }
    }
    return `${url.substr(0, url.indexOf('?'))}?${returnurl.substr(0, returnurl.length - 1)}`;
  } else {
    arr = str.split('=');
    if (arr[0] == ref) return url.substr(0, url.indexOf('?'));
    else return url;
  }
};
// 表单校验错误定位
util.toTop = function () {
  let top = 0;
  let target = document.getElementsByClassName('ivu-form-item-error-tip')[0];
  const parent = document.getElementsByTagName('body')[0];
  while (target && target != parent) {
    top += target.offsetTop;
    target = target.offsetParent;
  }
  const offsetTop = top - 100;
  document.body.scrollTop = document.documentElement.scrollTop = offsetTop;
};
// 格式化时间
util.formatDateTime = function (fmt, date) {
  date = date || new Date();
  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp.$1.length));
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : ((`00${o[k]}`).substr((`${o[k]}`).length)));
  }
  return fmt;
};
/**
 * 文件下载 get方式 后台支持 responseType: 'blob'
 * @param $ajax 全局的axios实例
 * @param url 下载url
 * @param params
 * @param fileName 下载到的文件名称  需要带文件后缀
 */
util.fileDownload = function ($ajax, url, params, fileName) {
  $ajax.get(url, {
    params: params,
    responseType: 'blob' // 二进制流
  }).then((res) => {
    const blob = new Blob([res.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
    });
    const downloadElement = document.createElement('a');
    const href = window.URL.createObjectURL(blob);
    downloadElement.href = href;
    downloadElement.download = fileName;
    document.body.appendChild(downloadElement);
    downloadElement.click();
    document.body.removeChild(downloadElement); // 下载完成移除元素
    window.URL.revokeObjectURL(href); // 释放掉blob对象
  });
};
/**
 *  处理国际化格式的时间
 */
util.timeFormat = function (time, dateType) {
  if (time && !dateType) {
    if (time.indexOf('T') > -1) {
      return moment(time).format('YYYY-MM-DD HH:mm');
    } else {
      return moment(time).format('YYYY-MM-DDTHH:mm');
    }
  } else if (time && dateType) {
    if (time.indexOf('T') > -1) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss');
    } else {
      return moment(time).format('YYYY-MM-DDTHH:mm:ss');
    }
  }
  return '';
};
/**
 * 时间格式化 转为YYYY-MM-DD HH:mm:ss
 */
util.chinaTimeFormat = function (time) {
  const date = time ? new Date(time) : new Date();
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
};
/**
 * 从Cookie中获取相应的值
 */
util.getCookie = function (name) {
  const arr = document.cookie.match(new RegExp(`(^| )${name}=([^;]*)(;|$)`));
  if (arr != null) {
    return decodeURI(arr[2]);
  }
  return null;
};
/**
 * 从url获取指定的参数
 */
util.getQueryString = function (name) {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`, 'i');
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return '';
};
/**
 * 获取协议类型
 */
util.getPrefixProtocol = function () {
  return (document.location.protocol == 'https:') ? ' https://' : ' http://';
};
/**
 * 生成一个不重复的ID
 */
util.GenNonDuplicateID = function (randomLength) {
  return Number(Math.random().toString().substr(3, randomLength) + Date.now()).toString(36);
};
/**
 * 从router获取展示menu信息
 */
util.getMenuByRouter = function (list, access) {
  if (list && list.length > 0) {
    const res = [];
    list.forEach((item) => {
      if (item.meta && !item.meta.hideInMenu && showThisMenuEle(item, access)) {
        const obj = {
          icon: (item.meta && item.meta.icon) || '',
          name: item.name,
          meta: item.meta
        };
        if (item.children && item.children.length !== 0) obj.children = util.getMenuByRouter(item.children, access);
        if (item.meta && item.meta.href) obj.href = item.meta.href;
        res.push(obj);
      }
    });
    return res;
  }
};
function showThisMenuEle (item, access) {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (access && access.indexOf(item.meta.access) > -1) return true;
    else return false;
  } else return true;
}
/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的并集, 两个数组的元素为数值或字符串
 */
util.getUnion = (arr1, arr2) => {
  return Array.from(new Set([...arr1, ...arr2]));
};
util.showTitle = (item, vm) => {
  let { title } = item.meta;
  if (!title) return false;
  if (vm.$config.useI18n) {
    title = vm.$i18n.t(title);
  } else title = (item.meta && item.meta.title) || item.name;
  return title;
};
/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
util.routeEqual = (route1, route2) => {
  const params1 = route1.params || {};
  const params2 = route2.params || {};
  const query1 = route1.query || {};
  const query2 = route2.query || {};
  return (route1.name === route2.name) && util.objEqual(params1, params2) && util.objEqual(query1, query2);
};

/**
 * @param {*} obj1 对象
 * @param {*} obj2 对象
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 */
util.objEqual = (obj1, obj2) => {
  const keysArr1 = Object.keys(obj1);
  const keysArr2 = Object.keys(obj2);
  if (keysArr1.length !== keysArr2.length) return false;
  else if (keysArr1.length === 0 && keysArr2.length === 0) return true;
  /* eslint-disable-next-line */
  else return !keysArr1.some(key => obj1[key] != obj2[key]);
};

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
util.getNewTagList = (list, newRoute) => {
  const { name, path, meta } = newRoute;
  const newList = [...list];
  if (newList.findIndex(item => item.name === name) >= 0) return newList;
  else newList.push({ name, path, meta });
  return newList;
};
/**
 * @description 本地存储和获取标签导航列表
 */
util.setTagNavListInLocalstorage = list => {
  localStorage.tagNaveList = JSON.stringify(list);
};

/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
util.getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNaveList;
  return list ? JSON.parse(list) : [];
};
/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
util.doCustomTimes = (times, callback) => {
  let i = -1;
  while (++i < times) {
    callback(i);
  }
};
/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
util.getNextRoute = (list, route) => {
  let res = {};
  if (list.length === 2) {
    res = util.getHomeRoute(list);
  } else {
    const index = list.findIndex(item => util.routeEqual(item, route));
    if (index === list.length - 1) res = list[list.length - 2];
    else res = list[index + 1];
  }
  return res;
};
util.getRouteTitleHandled = (route) => {
  const router = { ...route };
  const meta = { ...route.meta };
  let title = '';
  if (meta.title) {
    if (typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true;
      title = meta.title(router);
    } else title = meta.title;
  }
  meta.title = title;
  router.meta = meta;
  return router;
};

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
util.routeHasExist = (tagNavList, routeItem) => {
  const len = tagNavList.length;
  let res = false;
  util.doCustomTimes(len, (index) => {
    if (util.routeEqual(tagNavList[index], routeItem)) res = true;
  });
  return res;
};

util.findNodeUpperByClasses = (ele, classes) => {
  const { parentNode } = ele;
  if (parentNode) {
    let temp = false;
    for (let i = 0; i < classes.length; i++) {
      if (parentNode.className && parentNode.className.indexOf(classes[i] > -1)) {
        temp = true;
      }
    }
    if (temp) return parentNode;
    else return util.findNodeUpperByClasses(parentNode, classes);
  }
};

/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
util.getBreadCrumbList = (route, homeRoute) => {
  const homeItem = { ...homeRoute };
  homeItem['icon'] = homeRoute.meta.icon;
  const routeMetched = route.matched;
  if (routeMetched.some(item => item.name === homeRoute.name)) return [homeItem];
  let res = routeMetched.filter(item => {
    return item.meta === undefined || !item.meta.hideInBread;
  }).map(item => {
    const meta = { ...item.meta };
    if (meta.title && typeof meta.title === 'function') meta.title = meta.title(route);
    return {
      icon: (item.meta && item.meta.icon) || '',
      name: item.name,
      meta: meta
    };
  });
  res = res.filter(item => {
    return !item.meta.hideInMenu;
  });
  const result = [{ ...homeItem,
    to: homeRoute.path
  }, ...res];
  return result;
};

/**
 * @param {Array} routers 路由列表数组
 * @description 用于找到路由列表中name为home的对象
 */
util.getHomeRoute = (routers, homeName = 'home') => {
  let i = -1;
  const len = routers.length;
  let homeRoute = {};
  while (++i < len) {
    const item = routers[i];
    if (item.children && item.children.length) {
      const res = util.getHomeRoute(item.children, homeName);
      if (res.name) return res;
    } else {
      if (item.name === homeName) homeRoute = item;
    }
  }
  return homeRoute;
};
util.parseUserPermissions = (data) => {
  const permissionList = [];
  if (data) {
    for (const key in data) {
      if (data[key]) permissionList.push(key);
    }
  }
  return permissionList;
};
// 表格内容超出部分显示为省略号，并用 Tooltip 组件显示完整内容
util.tableTooltip = (h, params, text) => {
  return h('div', [
    h('Tooltip', {
      props: { placement: 'top' }
    }, [
      h('span', {
        style: {
          display: 'inline-block',
          width: `${params.column._width - 10}px`,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }
      }, text),
      h('span', {
        slot: 'content',
        style: { whiteSpace: 'normal', wordBreak: 'break-all' }
      }, text)
    ])
  ]);
};
// post请求跳转url
// @params url {string} 请求路径
// @params param {string} 接口的参数

util.postRequest = (url, param) => {
  console.log(url, param);
  const params = param.split('&');// 获取后台所传参数，用&符号隔开
  const form = document.createElement('form');// 创建form表单
  form.action = url;
  form.method = 'post';
  form.style.display = 'none';
  for (const i in params) { // 循环返回参数的key value值
    const tmp = params[i].split('=');// 用=分割出key value
    const key = tmp[0], value = tmp[1];
    const inp = document.createElement('input');
    inp.type = 'hidden';
    inp.name = key;
    if (key == 'sign') { // 如果key=sign需将签名解密（所有的空格符、标点符号、特殊字符以及其他非ASCII字符都将被转化成%xx格式的字符编码，后端将直接转义好的数据传给app，前端需解密）
      inp.val = unescape(value);
    } else { // 其他情况不需要解密
      inp.val = value;
    }
    form.appendChild(inp);
  }
  document.body.appendChild(form);// 追加到body
  form.submit();// submit直接提交
};
util.getProtocol = () => {
  const prefixProtocol = ((document.location.protocol == 'https:') ? ' https://' : ' http://');// 根据环境配置协议
  return prefixProtocol;
};
export default util;
