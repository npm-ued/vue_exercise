<template>
  <div class="side-menu-wrapper">
    <!-- menu 顶部显示管理后台logo -->
    <slot></slot>
    <Menu ref="menu" v-show="!collapsed" :active-name="activeName" :open-names="openedNames" :accordion="accordion" :theme="theme" width="auto" @on-select="handleSelect">
      <template v-for="item in menuList" >
        <!--children存在 并且meta.hideInBread == true-->
        <side-menu-item v-if="showChildren(item) && !item.meta.hideInBread" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
        <!--children存在 并且meta.hideInBread == false-->
        <template v-else-if="showChildren(item)">
          <template v-for="childrenItem in item.children">
            <menu-item :name="getNameOrHref(childrenItem)" :key="`menu-${childrenItem.name}`"><common-icon :type="childrenItem.icon || ''"/><span>{{ showTitle(childrenItem) }}</span></menu-item>
          </template>
        </template>
        <!--children不存在-->
        <template v-else-if="!showChildren(item)">
          <menu-item :name="getNameOrHref(item)" :key="`menu-${item.name}`"><common-icon :type="item.icon || ''"/><span>{{ showTitle(item) }}</span></menu-item>
        </template>
      </template>
    </Menu>
    <div class="menu-collapsed" v-show="collapsed" :list="menuList">
      <template v-for="item in menuList">
        <collapsed-menu v-if="showChildren(item) && !item.meta.hideInBread" @on-click="handleSelect" hide-title :root-icon-size="rootIconSize" :icon-size="iconSize" :theme="theme" :parent-item="item" :key="`drop-menu-${item.name}`"></collapsed-menu>
        <template v-else-if="showChildren(item) && item.meta.hideInBread">
          <template v-for="childrenItem in item.children">
            <collapsed-menu v-if="showChildren(childrenItem)" @on-click="handleSelect" hide-title :root-icon-size="rootIconSize" :icon-size="iconSize" :theme="theme" :parent-item="childrenItem" :key="`drop-menu-${childrenItem.name}`"></collapsed-menu>
            <Tooltip transfer v-else :content="showTitle(childrenItem)" placement="right" :key="`drop-menu-${childrenItem.name}`">
              <a @click="handleSelect(getNameOrHref(childrenItem, true))" class="drop-menu-a" :style="{textAlign: 'center'}"><common-icon :size="rootIconSize" :color="textColor" :type="childrenItem.icon || (childrenItem.children && childrenItem.children[0].icon)"/></a>
            </Tooltip>
          </template>
        </template>
        <Tooltip transfer v-else :content="showTitle(item.children && item.children[0] ? item.children[0] : item)" placement="right" :key="`drop-menu-${item.name}`">
          <a @click="handleSelect(getNameOrHref(item, true))" class="drop-menu-a" :style="{textAlign: 'center'}"><common-icon :size="rootIconSize" :color="textColor" :type="item.icon || (item.children && item.children[0].icon)"/></a>
        </Tooltip>
      </template>
    </div>
  </div>
</template>
<script>
import SideMenuItem from './side-menu-item.vue';
import CollapsedMenu from './collapsed-menu.vue';
import util from '../../../assets/js/util';
import mixin from './mixin';

export default {
  name: 'SideMenu',
  mixins: [ mixin ],
  components: {
    SideMenuItem,
    CollapsedMenu
  },
  props: {
    menuList: {
      type: Array,
      default () {
        return [];
      }
    },
    collapsed: { // 控制menu收缩/展开
      type: Boolean
    },
    theme: { // menu样式：dark、light、primary 默认dark
      type: String,
      default: 'dark'
    },
    rootIconSize: {
      type: Number,
      default: 20
    },
    iconSize: {
      type: Number,
      default: 16
    },
    accordion: Boolean,
    activeName: {
      type: String,
      default: ''
    },
    openNames: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      openedNames: []
    };
  },
  methods: {
    handleSelect (name) {
      this.$emit('on-select', name);
    },
    getOpenedNamesByActiveName (name) {
      return this.$route.matched.map(item => item.name).filter(item => item !== name);
    },
    updateOpenName (name) {
      if (name === this.$config.homeName) this.openedNames = [];
      else this.openedNames = this.getOpenedNamesByActiveName(name);
    }
  },
  computed: {
    textColor () {
      return this.theme === 'dark' ? '#fff' : '#495060';
    }
  },
  watch: {
    activeName (name) {
      if (this.accordion) this.openedNames = this.getOpenedNamesByActiveName(name);
      else this.openedNames = util.getUnion(this.openedNames, this.getOpenedNamesByActiveName(name));
    },
    openNames (newNames) {
      this.openedNames = newNames;
    },
    openedNames () {
      this.$nextTick(() => {
        this.$refs.menu.updateOpened();
      });
    }
  },
  mounted () {
    this.openedNames = util.getUnion(this.openedNames, this.getOpenedNamesByActiveName(name));
  }
};
</script>
<style lang="less">
  @import './side-menu.less';
</style>
