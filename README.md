# 管理后台

### 开发必备
* nodejs 环境安装
> 安装nodejs(https://nodejs.org/en/)下载安装，确认安装是否成功可以使用 node -v 确认版本号，现在我本机版本是v10.0.0
* 确认npm 是否安装使用 npm -v 


### hosts配置
```
127.0.0.1 test.baidu.com
```

### nginx配置
```
# sail管理后台
upstream test.baidu.com{
  server 127.0.0.1:8088;
}
server {
  listen       80;
  server_name  test.baidu.com;
  proxy_set_header   X-Real-IP $remote_addr;
  proxy_set_header   X-Forwarded-For  $remote_addr;
  proxy_set_header   X-Forwarded-Host $server_name;
  location / {
    proxy_pass      http://test.baidu.com;
  }
}
```


### 1、开发环境启动
```
// cd到根目录
cd sail-admin-web
// 使用npm 安装依赖包
npm install
// 开发环境启动服务
npm run dev
```
> 在开发环境启动需要配置hosts和nginx（cas的登录跳转），本地的开发配置文件需要新建dev.server.js 模板内容参见dev.server.default.js

### 2、测试环境
```
// cd到项目根目录
cd vue_exercise
// 使用npm安装依赖包
npm install
// 测试环境 打包生成目标文件目录dist
npm run test
```

### 3、生产环境
```
// cd到项目根目录
cd vue_exercise
// 使用npm安装依赖包
npm install
// 测试环境 打包生成目标文件目录dist
npm run build
```
## [目录结构](./GATALOG.md)

## 上线人员注意

1. 上线必须合并到 **master** 才可以上线
2. risk-rule-frontend 上线目录指向 **dist** 目录


### 管理后台组件和框架
* [iview](https://www.iviewui.com/)
* [vue](https://cn.vuejs.org/index.html)
* [vue-router](https://router.vuejs.org/zh/)
* [vuex](https://vuex.vuejs.org/zh/)
* [axios](https://github.com/axios/axios)
* [vue-i18n](http://kazupon.github.io/vue-i18n/zh/guide/messages.html#%E7%BB%93%E6%9E%84)
