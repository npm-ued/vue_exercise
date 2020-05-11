import CommonIcon from '../common-icon';
import util from '../../../assets/js/util';
export default {
  components: {
    CommonIcon
  },
  methods: {
    showTitle (item) {
      return util.showTitle(item, this);
    },
    showChildren (item) {
      return item.children && (item.children.length > 0 || (item.meta && item.meta.showAlways));
    },
    getNameOrHref (item, children0) {
      return item.href ? `isTurnByHref_${item.href}` : item.name;
    }
  }
};
