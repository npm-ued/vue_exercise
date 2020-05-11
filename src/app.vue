<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
const getOptionListUrl = '/sail/v1/other/dicts';
export default {
  data: function () {
    return {
    };
  },
  created () {
    if (localStorage['JWT_TOKEN']) {
      this.$store.dispatch('setUserPermissions');
    }
  },
  methods: {
    // 获取全局的选项配置
    getOptionList () {
      this.$ajax.get(getOptionListUrl).then((res) => {
        const { data } = res.data;
        this.$uiSetOptions = data; // 赋值给全局的$optionConfig;
        // 存储本地
        localStorage.setItem('UISetOptions', JSON.stringify(data));
      });
    }
  },
  mounted () {
    this.getOptionList();
  }
};
</script>

<style lang="less">
@import url('./assets/styles/common/common.css');
.size { width: 100%; height: 100%; }
html,body{ .size; overflow: hidden; margin: 0; padding: 0; }
#app { .size; }
</style>
