<template>
  <div>
    <div class="my-gallery">
        <figure class="uploadWrap" v-for="(item, index) in imgList" :key="index">
          <a :href="item.url" itemprop="contentUrl" class="itemWrap" v-if="item.status!=1">
            <img :src="item.url" :alt="item.alt" itemprop="thumbnail" class="imgStyle"/>
            <span class="delImg" @click="delImg($event, index)" v-if="edit">删除</span>
          </a>
          <a :href="item.url" itemprop="contentUrl" class="itemWrap uploading" v-if="item.status==1">
            <img :src="item.url" :alt="item.alt" itemprop="thumbnail" class="imgStyle"/>
            <span class="delImg" @click="delImg($event, index)" v-if="edit">删除</span>
          </a>
        </figure>
    </div>
    <!-- Root element of PhotoSwipe. Must have class pswp. -->
    <div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
      <!-- Background of PhotoSwipex
            It's a separate element as animating opacity is faster than rgba(). -->
      <div class="pswp__bg"></div>
      <!-- Slides wrapper with overflow:hidden. -->
      <div class="pswp__scroll-wrap">
        <!-- Container that holds slides
            PhotoSwipe keeps only 3 of them in the DOM to save memory.
            Don't modify these 3 pswp__item elements, data is added later on. -->
        <div class="pswp__container">
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
        </div>
        <!-- Default (PhotoSwipeUI_Default) interface on top of sliding area. Can be changed. -->
        <div class="pswp__ui pswp__ui--hidden">
          <div class="pswp__top-bar">
            <!--  Controls are self-explanatory. Order can be changed. -->
            <div class="pswp__counter"></div>
            <span class="pswp__button pswp__button--close" title="Close (Esc)"></span>
            <span class="pswp__button pswp__button--share" title="Share"></span>
            <span class="pswp__button pswp__button--fs" title="Toggle fullscreen"></span>
            <span class="pswp__button pswp__button--zoom" title="Zoom in/out"></span>
            <!-- Preloader demo http://codepen.io/dimsemenov/pen/yyBWoR -->
            <!-- element will get class pswp__preloader--active when preloader is running -->
            <div class="pswp__preloader">
              <div class="pswp__preloader__icn">
                <div class="pswp__preloader__cut">
                  <div class="pswp__preloader__donut"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
            <div class="pswp__share-tooltip"></div>
          </div>
          <span class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
          </span>
          <span class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
          </span>
          <div class="pswp__caption">
            <div class="pswp__caption__center"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import PhotoSwipe from 'photoswipe/dist/photoswipe';
import PhotoSwipeUiDefault from 'photoswipe/dist/photoswipe-ui-default';
import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';

export default {
  data () {
    return {};
  },
  props: {
    imgList: Array,
    edit: Boolean
  },
  methods: {
    initPhotoSwipeFromDOM (gallerySelector) {
      // get image natural size
      const getNaturalSize = (img) => {
        const image = new Image();
        image.src = img.src;
        return [img.naturalWidth || image.width, img.naturalHeight || image.height];
      };
      // parse slide data (url, title, size ...) from DOM elements
      // (children of gallerySelector)
      const parseThumbnailElements = (el) => {
        const thumbElements = el.childNodes;
        const numNodes = thumbElements.length;
        const items = [];
        let figureEl,
          linkEl,
          size,
          item;

        for (let i = 0; i < numNodes; i++) {
          figureEl = thumbElements[i]; // <figure> element
          // include only element nodes
          if (figureEl.nodeType !== 1) {
            continue;
          }
          linkEl = figureEl.children[0]; // <a> element

          size = getNaturalSize(linkEl.children[0]);
          // create slide object
          item = {
            src: linkEl.getAttribute('href'),
            w: parseInt(size[0], 10),
            h: parseInt(size[1], 10)
          };
          if (figureEl.children.length > 1) {
            // <figcaption> content
            item.title = figureEl.children[1].innerHTML;
          }
          if (linkEl.children.length > 0) {
            // <img> thumbnail element, retrieving thumbnail url
            item.msrc = linkEl.children[0].getAttribute('src');
          }

          item.el = figureEl; // save link to element for getThumbBoundsFn
          items.push(item);
        }
        return items;
      };

      // find nearest parent element
      const closest = (el, fn) => {
        return el && (fn(el) ? el : closest(el.parentNode, fn));
      };

      // triggers when user clicks on thumbnail
      const onThumbnailsClick = (e) => {
        e = e || window.event;
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        const eTarget = e.target || e.srcElement;
        // find root element of slide
        const clickedListItem = closest(eTarget, (el) => {
          return (el.tagName && el.tagName.toUpperCase() === 'FIGURE');
        });
        if (!clickedListItem) {
          return;
        }

        // find index of clicked item by looping through all child nodes
        // alternatively, you may define index via data- attribute
        const clickedGallery = clickedListItem.parentNode;
        const { childNodes } = clickedListItem.parentNode;
        const numChildNodes = childNodes.length;
        let nodeIndex = 0;
        let index;
        for (let i = 0; i < numChildNodes; i++) {
          if (childNodes[i].nodeType !== 1) {
            continue;
          }
          if (childNodes[i] === clickedListItem) {
            index = nodeIndex;
            break;
          }
          nodeIndex++;
        }
        if (index >= 0) {
          // open PhotoSwipe if valid index found
          openPhotoSwipe(index, clickedGallery);
        }
        return false;
      };

      // parse picture index and gallery index from URL (#&pid=1&gid=2)
      const photoswipeParseHash = () => {
        const hash = window.location.hash.substring(1);
        const params = {};

        if (hash.length < 5) {
          return params;
        }
        const vars = hash.split('&');
        for (let i = 0; i < vars.length; i++) {
          if (!vars[i]) {
            continue;
          }
          const pair = vars[i].split('=');
          if (pair.length < 2) {
            continue;
          }
          params[pair[0]] = pair[1];
        }
        if (params.gid) {
          params.gid = parseInt(params.gid, 10);
        }
        return params;
      };

      const openPhotoSwipe = (index, galleryElement, disableAnimation, fromURL) => {
        const pswpElement = document.querySelectorAll('.pswp')[0];
        const items = parseThumbnailElements(galleryElement);
        // define options (if needed)
        const options = {
          // define gallery index (for URL)
          galleryUID: galleryElement.getAttribute('data-pswp-uid'),
          getThumbBoundsFn (index) {
            // See Options -> getThumbBoundsFn section of documentation for more info
            const thumbnail = items[index].el.getElementsByTagName('img')[0]; // find thumbnail
            const pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
            const rect = thumbnail.getBoundingClientRect();
            return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
          },
          history: false,
          fullscreenEl: false,
          shareEl: false,
          bgOpacity: 0.85
        };
        // PhotoSwipe opened from URL
        if (fromURL) {
          if (options.galleryPIDs) {
            // parse real index when custom PIDs are used
            // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
            for (let j = 0; j < items.length; j++) {
              if (items[j].pid == index) {
                options.index = j;
                break;
              }
            }
          } else {
            // in URL indexes start from 1
            options.index = parseInt(index, 10) - 1;
          }
        } else {
          options.index = parseInt(index, 10);
        }

        // exit if index not found
        if (isNaN(options.index)) {
          return;
        }

        if (disableAnimation) {
          options.showAnimationDuration = 0;
        }
        console.log(items);
        // Pass data to PhotoSwipe and initialize it
        const gallery = new PhotoSwipe(pswpElement, PhotoSwipeUiDefault, items, options);
        gallery.init();
      };

      // loop through all gallery elements and bind events
      const galleryElements = document.querySelectorAll(gallerySelector);

      for (let i = 0, l = galleryElements.length; i < l; i++) {
        galleryElements[i].setAttribute('data-pswp-uid', i + 1);
        galleryElements[i].onclick = onThumbnailsClick;
      }
      // Parse URL and open gallery if it contains #&pid=3&gid=1
      const hashData = photoswipeParseHash();
      if (hashData.pid && hashData.gid) {
        openPhotoSwipe(hashData.pid, galleryElements[ hashData.gid - 1 ], true, true);
      }
    },
    delImg (event, index) {
      event.preventDefault();
      event.stopPropagation();
      const flag = window.confirm('确认删除？');
      if (flag) {
        const deleteImage = this.imgList[index];
        this.imgList.splice(index, 1); // 删除图片
        // this.$emit('delImg', index);
        this.$emit('delImg', deleteImage.imageUrl);
      }
    }
  },
  mounted () {
    this.initPhotoSwipeFromDOM('.my-gallery');
  }
};
</script>
<style>
.uploadWrap{
  background: url('../../../assets/images/imgupload/upimg.png') scroll center center;
  width: 83px;
  height: 83px;
  background-size: 100%;
  border: 1px solid #ddd;
  position: relative;
  float: left;
  margin-right: 5px;
  margin-bottom: 5px;
}
.uploading .loadingShade{
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #FFF;
  opacity: 0.6;
}

.itemWrap.uploading::after {
  width: 100%;
  height: 100%;
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  background-image: url('../../../assets/images/imgupload/loading.gif');
  background-repeat: no-repeat;
  background-size: auto;
  background-position: center center;
}
.imgPreviewBox {
  width: 80px;
  display: inline-block;
  margin-right: 10px;
  text-align: center;
}
.imgStyle {
  height: 80px;
  width: 80px;
}
.delImg {
  position: absolute;
  top: 0;
  right: 0;
  height: 20px;
  width: 20px;
  text-indent: -20000em;
  background-image: url('../../../assets/images/imgupload/del.png');
  background-repeat: no-repeat;
  background-position: center center;
  background-size: 15px auto;
  background-color: #ddd;
  opacity: 0.85;
}
</style>
