<template>
  <keep-alive :include="cacheList">
    <router-view/>
  </keep-alive>
</template>
<script>
export default {
  name: 'commonRouterView',
  data () {
    return {};
  },
  computed: {
    tagNavList () {
      return this.$store.state.app.tagNavList;
    },
    cacheList () {
      const list = ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []];
      return list;
    }
  },
  components: {}
};
</script>
<style scoped>
</style>
