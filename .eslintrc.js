/**
 * eslint有三种使用方式
 * 【1】js代码中通过注释的方式使用
 * 【2】通过webpack的eslintConfig字段设置，eslint会自动搜索项目的package.json文件中的配置
 * 【3】通过配置文件的方式使用，配置文件有多种文件方式，如JavaScript、JSON 或者 YAML等
 */
/**
 * 文件内局部设置
 * 【】eslint可以具体文件中设置特定代码的规则，常用于跳过某条语句的检测。
 * 【】注销全部规则，在代码前新建一行，添加注销 /* eslint-disable *\/  。如果没有恢复设置的语句，则下列全部代码都会跳过检测。
 * 【】恢复eslint，在代码前新建一行，添加注销 /* eslint-enable *\/
 * 【】指定忽略的规则，/* eslint-disable no-alert, no-console *\/
 * 【】在特定行禁用，// eslint-disable-line
 * 【】在下一行禁用，// eslint-disable-next-line
 */
module.exports = {
  /**
   * 根目录标识
   * http://eslint.cn/docs/user-guide/configuring#using-configuration-files
   * http://eslint.cn/docs/user-guide/configuring#configuration-cascading-and-hierarchy
   * 【】标识当前配置文件为最底层的文件，无需往更上一级的文件目录中进行搜索
   * 【】默认eslint的配置文件搜索方式是，从目标文件夹进行搜索，遍历内部每一个文件夹，找到配置文件并层叠使用。再跳出本项目，往祖先文件夹进行遍历
   * 【】注意「~/.eslintrc」的意义，「~」是指linux上的家目录，「~/.eslintrc」是指家目录下的eslint配置文件，用于私人开发者，用于整个电脑全局约束的。这个配置通过本配置项root去设置，设置了root,eslint检测时将不会再往上搜索
   * 【】eslint的生效规则是就近使用，越近的配置项优先级越高，覆盖其他配置项。如一个项目中，可以在不同文件夹中都添加配置文件，这些规则将重叠组合生效
   */
  root: true, // 标识当前配置文件为eslint的根配置文件，让其停止在父级目录中继续寻找。
  /**
   * 解析器
   * http://eslint.cn/docs/user-guide/configuring#specifying-parser
   * 【】ESLint 默认使用Espree作为其解析器
   * 【】解析器必须是本地安装的一个 npm 模块。即必须按照在本地的node_module中
   * 【】解析器是用于解析js代码的，怎么去理解每一个表达式，有点C++中编译器的概念，会对js进行一些语法分析，语义分析什么的，才能判断语句符不符合规范。而不是通过简单的字符串对比。
   * 【】解析器有很多，但兼容eslint的解析器有以下几个
   * Espree：默认解析器，一个从Esprima中分离出来的解析器，做了一些优化
   * Esprima：js标准解析器
   * Babel-ESLint： 一个对Babel解析器的包装，babel本身也是js解析器的一种（不然怎么能转化为兼容性代码呢？首先需要进行js解析，才能转化）。如果我们的代码需要经过babel转化，则对应使用这个解析器
   * typescript-eslint-parser(实验) - 一个把 TypeScript 转换为 ESTree 兼容格式的解析器
   */
  parserOptions: {
    parser: 'babel-eslint'
  },
  /**
   * 运行环境
   * http://eslint.cn/docs/user-guide/configuring#specifying-environments
   * 【】一个环境定义了一组预定义的全局变量
   * 【】获得了特定环境的全局定义，就不会认为是开发定义的，跳过对其的定义检测。否则会被认为改变量未定义
   * 【】常见的运行环境有以下这些，更多的可查看官网
   * browser - 浏览器环境中的全局变量。
   * node - Node.js 全局变量和 Node.js 作用域。
   * es6 - 启用除了 modules 以外的所有 ECMAScript 6 特性（该选项会自动设置 ecmaVersion 解析器选项为 6）。
   * amd - 将 require() 和 define() 定义为像 amd 一样的全局变量。
   * commonjs - CommonJS 全局变量和 CommonJS 作用域 (用于 Browserify/WebPack 打包的只在浏览器中运行的代码)。
   * jquery - jQuery 全局变量。
   * mongo - MongoDB 全局变量。
   * worker - Web Workers 全局变量。
   * serviceworker - Service Worker 全局变量。
   */
  env: {
    browser: true,
    jest: true,
    mocha: true
  },
  /**
   * 插件
   * http://eslint.cn/docs/user-guide/configuring#configuring-plugins
   * 【】插件同样需要在node_module中下载
   * 【】注意插件名忽略了「eslint-plugin-」前缀，所以在package.json中，对应的项目名是「eslint-plugin-vue」
   * 【】插件的作用类似于解析器，用以扩展解析器的功能，用于检测非常规的js代码。也可能会新增一些特定的规则。
   * 【】如 eslint-plugin-vue，是为了帮助我们检测.vue文件中 <template> 和 <script> 中的js代码
   */
  plugins: [
    'vue' // 忽略了「eslint-plugin-」前缀  eslint-plugin-vue
  ],
  /**
   * 规则继承
   * http://eslint.cn/docs/user-guide/configuring#extending-configuration-files
   *【】可继承的方式有以下几种
   *【】eslint内置推荐规则，就只有一个，即「eslint:recommended」
   *【】可共享的配置， 是一个 npm 包，它输出一个配置对象。即通过npm安装到node_module中
   *  可共享的配置可以省略包名的前缀 eslint-config-，即实际设置安装的包名是 eslint-config-airbnb-base
   *【】从插件中获取的规则，书写规则为 「plugin:插件包名/配置名」，其中插件报名也是可以忽略「eslint-plugin-」前缀。如'plugin:vue/essential'
   *【】从配置文件中继承，即继承另外的一个配置文件，如'./node_modules/coding-standard/eslintDefaults.js'
   */
  extends: [
    'plugin:vue/essential', // 额外添加的规则可查看 https://vuejs.github.io/eslint-plugin-vue/rules/
    'standard', // eslint-config-standard https://github.com/standard/standard/blob/master/docs/RULES-en.md
  ],
  /**
   * 全局变量
   * http://eslint.cn/docs/user-guide/configuring#specifying-globals
   * 【】定义额外的全局，开发者自定义的全局变量，让其跳过no-undef 规则
   * 【】key值就是额外添加的全局变量
   * 【】value值用于标识该变量能否被重写，类似于const的作用。true为允许变量被重写
   * 【】注意：要启用no-global-assign规则来禁止对只读的全局变量进行修改。
   */
  globals:{
    host: false,
    casHost: false,
    cas: false,
    casOut: false,
    $t: false,
    expandRow: false,
    importScripts: false,
    CryptoJS: false,
    $el: false
  },
  /**
   * 自定义规则
   * http://eslint.cn/docs/user-guide/configuring#configuring-rules
   * 【】基本使用方式
   * "off" 或者0 关闭规则
   * "warn" 或者1 将规则打开为警告（不影响退出代码）
   * "error" 或者2 将规则打开为错误（触发时退出代码为1）
   * 如：'no-restricted-syntax': 0, // 表示关闭该规则
   * 【】如果某项规则，有额外的选项，可以通过数组进行传递，而数组的第一位必须是错误级别。如0,1,2
   * 如 'semi': ['error', 'never'], never就是额外的配置项
   */
  rules: {
    /**
     * 具体规则
     * 【】具体的规则太多，就不做介绍了，有兴趣的同学可以上eslint官网查
     * 【】注意 xxx/aaa 这些规则是 xxx 插件自定的规则，在eslint官网是查不到的。需要到相应的插件官网中查阅
     * 【】如 import/extensions，这是「eslint-plugin-import」自定义的规则，需要到其官网查看 https://github.com/benmosher/eslint-plugin-import
     */
    'generator-star-spacing': 'off', // allow async-await
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off', // allow debugger during development
    "semi": [2, "always"],
    "no-new": 0,
    "vue/no-parsing-error": [2, { "x-invalid-end-tag": false }],
    "no-unused-vars": [0, {"vars": "local", "args": "none", "varsIgnorePattern": "[iI]tem"}],
    "vue/no-unused-vars": 0,
    "eqeqeq":0,
    "no-useless-escape":0,
    "vue/require-v-for-key":0,
    "vue/require-valid-default-prop":0,
    "vue/no-side-effects-in-computed-properties":0,
    "vue/valid-v-for":0,
    "vue/valid-v-else":0,
    "one-var": 0, //连续声明
    "no-self-compare": 0,
    "no-var": 2,
    "prefer-const": 2,
    "prefer-destructuring": 2,
    "prefer-template": 2,
    "prefer-destructuring": ["error", {VariableDeclarator: {object: true}}],
    "object-curly-spacing": ["error", "always"]
  }
};
