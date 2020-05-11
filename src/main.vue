/*
 * @Author: sail web admin
 * @Date: 2020-04-20 15:49:58
 * @Last Modified by: sail web admin
 * @Last Modified time: 2020-05-11 17:57:31
 * 主页面
 */

<template>
  <Layout style="height: 100%" class="main">
    <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
      <side-menu accordion ref="sideMenu" :active-name="activeName || $route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
        <!-- 需要放在菜单上面的内容，如Logo，写在side-menu标签内部，如下 -->
        <div class="logo-con">
          <!-- 改成汉字 -->
          <div v-show="!collapsed">
            <img :src="minLogo" key="min-logo" style="width: 24px; height: 24px; display: inline-block; vertical-align: middle;margin-right: 5px;" />
            <span class="mainTitle">{{$t('SystemName')}}</span>
          </div>
          <!-- <img v-show="!collapsed" :src="maxLogo" key="max-logo" /> -->
          <img v-show="collapsed" :src="minLogo" key="min-logo" style="width: 24px; height: 24px; margin: 10px auto;" />
        </div>
      </side-menu>
    </Sider>
    <Layout>
      <Header class="header-con">
        <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
          <a class="mpoint" @click="loginOut">
            {{$t('Common.SignOut')}}
          </a>
          <div class="mr10">|</div>
          <div class="mr10">
            {{$t('Common.Welcome')}}&nbsp;&nbsp;18512345678
          </div>
          <div class="mr10">
            <a @click="changeLanguage">{{$t('CurrentLan')}}: {{localeLanguage}}</a>
          </div>
        </header-bar>
      </Header>
      <Content class="main-content-con">
        <Layout class="main-layout-con">
          <Content class="content-wrapper" id="content-wrapper">
            <keep-alive :include="cacheList">
              <router-view/>
            </keep-alive>
            <img v-if="isShowBg" class="bgWelcome" src="./assets/images/common/welcome.png" alt="欢迎">
          </Content>
        </Layout>
      </Content>
    </Layout>
    <Button @click="goTop" type="primary" shape="circle" icon="md-arrow-round-up" style=" padding: 0px; width: 40px; font-size: 25px; height: 40px;position: fixed; bottom: 10px; right: 10px;z-index: 99999;" v-show="isShowToTop"></Button>
  </Layout>
</template>
<script>
import { mapMutations, mapActions, mapGetters } from 'vuex';
import SideMenu from './views/components/side-menu';
import HeaderBar from './views/components/header-bar';
import TagsNav from './views/components/tags-nav';
import routers from './router/modules';
import util from '@assets/js/util';
import './assets/styles/homepage/index.less';
let systemLan = 'en-US';
const navigatorLan = navigator.language; // 获取浏览器的语言设置
if (navigatorLan.indexOf('zh') == 0) {
  systemLan = 'zh-CN'; // 汉语默认设置成中文简体
}
if (localStorage.getItem('locale')) {
  systemLan = localStorage.getItem('locale');
}

export default {
  name: 'myMain',
  data () {
    return {
      localeLanguage: systemLan === 'en-US' ? 'EN-US' : '中文',
      activeName: '',
      isShowBg: true,
      collapsed: false, // 是否缩略图模式
      isShowToTop: false, // 是否显示回到顶部
      userInfo: localStorage.userInfo ? JSON.parse(localStorage.userInfo) : '--',
      minLogo: require('./assets/images/index/index_title.png'), // 小lOGO
      maxLogo: require('./assets/images/index/index_title.png') // 大 logo
    };
  },
  computed: {
    tagNavList () {
      return this.$store.state.app.tagNavList;
    },
    cacheList () {
      const list = ['ParentView', 'commonRouterView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []];
      return list;
    },
    menuList () { // tree data
      return this.$store.getters.menuList;
    }
  },
  methods: {
    ...mapMutations([
      'setHomeRoute',
      'setBreadCrumb',
      'setTagNavList',
      'addTag',
      'closeTag'
    ]),
    turnToPage (route) { // tree 节点click
      let { name, params, query } = {};
      if (typeof route === 'string') name = route;
      else {
        name = route.name;
        params = route.params;
        query = route.query;
      }
      if (name.indexOf('isTurnByHref_') > -1) {
        window.open(name.split('_')[1]);
        return;
      }
      this.$router.push({
        name,
        params,
        query
      });
    },
    changeLanguage () {
      if (this.$i18n.locale === 'en-US') {
        this.$i18n.locale = 'zh-CN';
        this.localeLanguage = '中文';
      } else if (this.$i18n.locale === 'zh-CN') {
        this.$i18n.locale = 'en-US';
        this.localeLanguage = 'EN-US';
      }
      localStorage.setItem('locale', this.$i18n.locale);
    },
    handleCollapsedChange (state) { // 左侧展开/收缩
      this.collapsed = state;
    },
    loginOut () {
      console.log('login out');
      this.$Modal.confirm({
        title: '退出登录',
        content: '<p>确认退出系统吗？</p>',
        onOk: () => {
          localStorage.JWT_TOKEN = '';
          localStorage.XJ_TICKET = '';
          localStorage.userPermissions = '';
          localStorage.userInfo = '';
          window.location.href = `${util.getProtocol()}${process.env.VUE_APP_API_HOST}/user/exit_logout`;
        }
      });
    },
    setPageHeight () {
      const aside = document.getElementById('content-wrapper');
      const minHeight = document.body.clientHeight;
      aside.style.minHeight = `${minHeight - 130}px`;
    },
    scrollToTop () {
      const scrollTopVal = document.getElementById('content-wrapper').scrollTop;
      if (scrollTopVal > 200) {
        this.isShowToTop = true;
      } else {
        this.isShowToTop = false;
      }
    },
    goTop () {
      document.getElementById('content-wrapper').scrollTop = 0;
    },
    handleCloseTag (res, type, route) {
      if (type !== 'others') {
        if (type === 'all') {
          this.turnToPage(this.$config.homeName);
        } else {
          if (util.routeEqual(this.$route, route)) {
            this.closeTag(route);
          }
        }
      }
      this.setTagNavList(res);
    },
    handleClick (item) {
      this.turnToPage(item);
    }
  },
  watch: {
    '$route' (newRoute, oldRoute) { // 面包屑设置
      this.isShowBg = newRoute.name == 'home';
      if (!newRoute.meta.hideInMenu) {
        this.setBreadCrumb(this.$route);
        this.$refs.sideMenu.updateOpenName(newRoute.name);
      }
      this.activeName = newRoute.name;
      const { name, query, params, meta } = newRoute;
      this.addTag({
        route: { name, query, params, meta },
        type: 'push'
      });
      this.setTagNavList(util.getNewTagList(this.tagNavList, newRoute));
      this.$store.commit('changeFooterButtonArr', []); // 更新是否显示footer按钮
    }
  },
  mounted () {
    this.setTagNavList();
    const { name, params, query, meta } = this.$route;
    this.addTag({ route: { name, params, query, meta } });
    this.setHomeRoute(routers);
    this.setBreadCrumb(this.$route);
    this.isShowBg = this.$route.name == 'home';
    this.setPageHeight();
    window.onresize = () => {
      this.setPageHeight();
    };
    document.getElementById('content-wrapper').addEventListener('scroll', this.scrollToTop);
  },
  components: {
    SideMenu,
    HeaderBar
  }
};
</script>
<style scoped>
  #content-wrapper { position: relative;overflow-x: hidden;overflow-y: auto; background-color: #fff; margin: 10px; }
  .fade-transform-leave-active, .fade-transform-enter-active { transition: all .2s; will-change: transform; }
  .fade-transform-enter { opacity: 0; transform: translateX(-30px); }
  .fade-transform-leave-to { opacity: 0; transform: translateX(30px); }
  .logo-con { height: 48px; overflow: hidden; padding: 12px 10px 0px 10px; margin-bottom: 16px; text-align: center; }
  .bgWelcome { display: block; position: absolute; top: 50%; left: 50%; margin-top: -300px; margin-left: -300px; max-width: 600px; }
</style>
