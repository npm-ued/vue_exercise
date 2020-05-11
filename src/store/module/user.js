import util from '../../assets/js/util';
import $ajax from '../../assets/js/interceptor';
import LocalStorage from 'localStorage';
export default {
  state: {
    access: ''
  },
  mutations: {
    setAccess (state, permissionList) {
      state.access = permissionList;
    }
  },
  actions: {
    setUserPermissions ({ dispatch, commit }, permissions) { // 获取当前登录用的权限
      if (permissions) {
        permissions = LocalStorage.getItem('userPermissions') || [];
      }
      LocalStorage.setItem('userPermissions', permissions);
      commit('setAccess', permissions);
    },
    logout () { // 退出登录
      // $ajax.get('/wallstreet/user/exit_logout').then(function (res) {
      //   if (res.data.retCode == 200) {
      //     LocalStorage.removeItem('userPermissions');
      //     window.location.href = res.data.body;
      //   } else alert(res.data.message);
      // });
    }
  },
  getters: {
    //
  }
};
