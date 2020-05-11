import util from '@assets/js/util';
import routes from '../../router/modules';
import router from '../../router';
export default {
  state: {
    breadCrumbList: [], // 导航面包屑数据
    tagNavList: [],
    homeRoute: {},
    footerButtonArr: [], // footer按钮
    filterStatus: false // 筛选条件展开/收起状态
  },
  mutations: {
    setBreadCrumb (state, route) {
      state.breadCrumbList = util.getBreadCrumbList(route, state.homeRoute);
    },
    setHomeRoute (state, routes) {
      state.homeRoute = util.getHomeRoute(routes);
    },
    addTag (state, { route, type = 'unshift' }) {
      const router = util.getRouteTitleHandled(route);
      if (!util.routeHasExist(state.tagNavList, router)) {
        if (type === 'push') state.tagNavList.push(router);
        else {
          if (router.name === 'home') state.tagNavList.unshift(router);
          else state.tagNavList.splice(1, 0, router);
        }
        util.setTagNavListInLocalstorage([...state.tagNavList]);
      }
    },
    closeTag (state, route) {
      const tag = state.tagNavList.filter(item => util.routeEqual(item, route));
      route = tag[0] ? tag[0] : null;
      if (!route) return;
      const nextRoute = util.getNextRoute(state.tagNavList, route);
      state.tagNavList = state.tagNavList.filter(item => {
        return !util.routeEqual(item, route);
      });
      router.push(nextRoute);
    },
    setTagNavList (state, list) {
      let tagList = [];
      if (list) {
        tagList = [...list];
      } else tagList = util.getTagNavListFromLocalstorage() || [];
      if (tagList[0] && tagList[0].name !== 'home') tagList.shift();
      const homeTagIndex = tagList.findIndex(item => item.name === 'home');
      if (homeTagIndex > 0) {
        const homeTag = tagList.splice(homeTagIndex, 1)[0];
        tagList.unshift(homeTag);
      }
      state.tagNavList = tagList;
      util.setTagNavListInLocalstorage([...tagList]);
    },
    // 修改筛选条件展开/收起状态
    changeFilterStatus (state) {
      state.filterStatus = !state.filterStatus;
    },
    // 更新footerButtonArr
    changeFooterButtonArr (state, arr) {
      state.footerButtonArr = arr;
    }
  },
  actions: {
    //
  },
  getters: {
    menuList: (state, getters, rootState) => util.getMenuByRouter(routes, rootState.user.access)
  }
};
