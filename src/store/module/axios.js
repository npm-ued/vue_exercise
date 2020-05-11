export default {
  state: {
    loadingCount: 0 // 当前axios的请求数
  },
  mutations: {
    changeLoadingState: (state, type) => { // type: true 开始请求 type: false 结束请求
      if (type) state.loadingCount++;
      else state.loadingCount--;
    }
  },
  actions: {
    //
  }
};
