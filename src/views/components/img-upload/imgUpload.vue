<template>
  <div class="imgListWrap clearfix">
    <div class="uploadWrap" v-if="edit">
      <form class="js-formClear">
        <input v-show="!isMultiple" type="file" class="inputFile" @change="fileChange" ref="inputFile" accept="image/*" />
        <input v-show="isMultiple" type="file" class="inputFile" @change="fileChange" ref="inputFile" accept="image/*" multiple="isMultiple"/>
      </form>
    </div>
    <div :class="loading?'imgLoading active':'imgLoading'">
      加载中...
    </div>
    <viewer :images="imgList" v-if="isPCResult && !edit && !isPreview">
      <div v-for="image in imgList" :key="image.imageUrl" class="imgPreviewBox">
        <img :src="image.url" class="imgStyle">
        <span>{{image.desc}}</span>
      </div>
    </viewer>
    <ImgPreview :imgList="imgList" @delImg="delImg($event)" :edit="edit" v-else/>
    <!--<viewer :images="imgList" v-if="isPCResult && !edit && !isPreview">-->
      <!--<img v-for="image in imgList" :src="image.url" :key="image.imageUrl" class="imgStyle">-->
    <!--</viewer>-->
    <!--<ImgPreview :imgList="imgList" @delImg="delImg($event)" :edit="edit" v-else/>-->
  </div>
</template>
<script>
import ImgPreview from './img-preview.vue';
import ImgDecode from '../img-decode';
import WebWorker from '../web-worker/index';
import 'viewerjs/dist/viewer.css';
import Viewer from 'v-viewer'; // PC端详情页时  引用该组件 支持放大 旋转Vue.use(Viewer, {
import Vue from 'vue';
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999,
    navbar: false,
    title: false,
    scalable: true,
    reset: false,
    loadingTips: '加载中...'
  }
});// 图片上传插件
export default {
  data () {
    return {
      imgList: [],
      encodeList: [],
      loading: true,
      isPCResult: false // 是否为PC端
    };
  },
  props: {
    value: {
      type: Array,
      default: function () {
        return [];
      }
    },
    isPreview: { // 不可编辑，但使用ImgPreview进行预览
      type: Boolean,
      default: false
    },
    isMultiple: {
      type: Boolean,
      default: true
    }, // 是否允许一次选择多张图片上传  默认为true
    imgUpLoadMax: null,
    keyVal: String,
    edit: Boolean,
    postKey: {
      type: Boolean,
      default: false
    }, // 上传图片时是否带着key值  默认为false
    imageUploadUrl: {
      type: String,
      default: '/upload/v2/image'
    } // 上传图片时是否带着key值  默认为false
  },
  mounted () {
    this.isPCResult = this.isPC();
    this.init();
  },
  watch: {
    value () {
      this.init();
    }
  },
  methods: {
    // 初始化方法
    init () {
      // test the createObjectURL
      if (!(window.URL.createObjectURL || window.webkitURL.createObjectURL)) {
        alert('This browser does not have URL.createObjectURL method.');
        return false;
      }
      this.value.forEach((item, index) => {
        if (item.status === '' || item.status == null || item.status == undefined) {
          item.status = 3;
          this.encodeList[index] = { id: item.id, url: item.url, status: 3 }; // 图片状态3为已上传七牛完成的图片
        }
      });
      // 判断是否需要解密
      if (this.encodeList.length) {
        this.loading = true;
        this.decodeImgList(this.encodeList, this.keyVal);
      } else {
        this.loading = false;
        if (!this.value.length) { // 传入的预览图片被清空了
          this.imgList = [];
        } else { // 传入新图片
          if (this.value[0].status == 3) { // 3 表示图片已上传七牛，说明是回显，要清空上次回显的图片
            this.imgList = [];
          }
          this.value.forEach((item) => {
            if (item.status == 3) {
              this.imgList.push(item);
            }
          });
        }
      }
    },
    // file 上传控件事件监听
    fileChange (event) {
      console.log('3333', event);
      if (this.value && this.imgUpLoadMax) { // 限定图片上传数量
        let imgCount = 0;
        this.value.forEach((item) => {
          if (item.status != 0) { // 筛选掉已删除图片
            imgCount++;
          }
        });
        console.log('1111', this.value);
        if (imgCount >= this.imgUpLoadMax) {
          alert(`最多上传${this.imgUpLoadMax}张图片，请重新选择`);
          this.$refs.inputFile.value = ''; // 解决chrome input file 重复上传同一张图片失效的问题
          return;
        }
      }
      const files = event.target.files || event.dataTransfer.files;
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          this.canvasCompress(file || null).then((blob) => {
            this.uploadImg(blob).then(([imgItem, url]) => {
              imgItem.status = 2; // 上传完成修改状态
              imgItem['imageUrl'] = url; // 追加七牛地址
              console.log(imgItem);
              console.log(this.value);
              this.$refs.inputFile.value = ''; // 解决chrome input file 重复上传同一张图片失效的问题
              this.$emit('input', [...this.value, { id: 0, url, status: 2 }]); // 通过input事件返回给页面
            });
          }, () => {
            console.log('图片压缩失败');
          });
        }
      }
    },
    // 给子组件使用的
    delImg (imageUrl) {
      const deleteIndexList = [];
      this.value.forEach((vue, index) => {
        if (vue.url == imageUrl) {
          if (vue.status == 3) vue.status = 0; // 如果是系统存在的图片则修改状态
          else deleteIndexList.push(index); // 如果是新增加的图片则删除即可
        }
      });
      deleteIndexList.forEach((deleteIndex) => {
        this.value.splice(deleteIndex, 1);
      });
      // if (this.value[index].status == 3) { // 如果是系统存在的图片则修改状态
      //   this.value[index].status = 0;
      // } else { // 如果是新增加的图片则删除即可
      //   this.value.splice(index, 1);
      // }
      this.$emit('input', this.value); // 删除指定的图片
    },
    // canvas压缩
    canvasCompress (file) {
      return new Promise((resolve, reject) => {
        if (!file) {
          return false;
        }
        const { name } = file;
        const img = new Image();
        const URL = window.URL || window.webkitURL; // 实现本地预览 类似url
        img.src = URL.createObjectURL(file);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        img.onload = () => {
          const { width, height, oldWidth, oldHeight } = this.getImgSize(img);
          let ratio = this.getPixelRatio();
          ratio = (ratio == 1 ? 2 : ratio);
          const ratioWidth = (width * ratio) > oldWidth ? oldWidth : (width * ratio);
          const ratioHeight = (height * ratio) > oldHeight ? oldHeight : (height * ratio);
          canvas.style.width = width;
          canvas.style.height = height;
          canvas.width = ratioWidth;
          canvas.height = ratioHeight;
          ctx.scale(ratioWidth / width, ratioHeight / height);
          ctx.drawImage(img, 0, 0, oldWidth, oldHeight, 0, 0, width, height);
          let tt = canvas.toDataURL('image/jpeg', 0.5);
          tt = tt.split(',')[1];
          const blob = this.b64ToBlob(tt, 'image/jpeg');
          blob.name = name;
          resolve(blob);
        };
        img.error = () => {
          reject(new Error(`图片${name}压缩失败`));
        };
      });
    },
    // 获取图片宽高尺寸
    getImgSize (img) {
      const oldWidth = img.naturalWidth || img.width;
      const oldHeight = img.naturalHeight || img.height;
      let width = oldWidth;
      let height = oldHeight;
      const rate = width / height;
      if (width > 1000) {
        width = 1000;
        height = parseInt(width / rate);
      }
      if (height > 1000) {
        height = 1000;
        width = parseInt(height * rate);
      }
      return { width, height, rate, oldWidth, oldHeight };
    },
    // 获取设备的像素比
    getPixelRatio () {
      return (window.devicePixelRatio || 1);
    },
    // base64转换Blob对象
    b64ToBlob (b64Data, contentType, sliceSize) {
      contentType = contentType || '';
      sliceSize = sliceSize || 512;
      const byteCharacters = atob(b64Data);
      const byteArrays = [];
      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);
        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    },
    // 上传图片
    uploadImg (img) {
      return new Promise((resolve, reject) => {
        const URL = window.URL || window.webkitURL;
        const url = URL.createObjectURL(img);
        this.imgList.push({ id: 0, url, status: 1 }); // 图片状态上传中
        const index = this.imgList.length - 1;
        const imgItem = this.imgList[index];
        // ajax 上传图片
        const formdata = new FormData(); // 初始化multipart/form-data 参数
        formdata.append('upload_file', img);
        if (this.postKey) {
          if (!this.keyVal) {
            alert('图片上传失败, postKey为true的情况下，key值不能为空');
            return false;
          } else formdata.append('img_key', this.keyVal);
        }
        this.$ajax.post(this.imageUploadUrl, formdata, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => {
          resolve([imgItem, res.data]);
        }).catch((error) => {
          console.log(error);
          this.imgList.splice(index, 1);
          this.$refs.inputFile.value = ''; // 清空文件选取控件的值，防止失败之后再次选择不上的
          alert('图片上传失败，稍后请重新上传！');
        });
      });
    },
    // 解密图片
    decodeImgList (encodeList, key) {
      this.imgList = [];
      const domain = window.location.host;
      const currProtocol = document.location.protocol;
      const scriptUrl = `${currProtocol}//${domain}/libs/crypto-js/3.1.9/crypto-js.min.js`;
      // test Web Worker
      WebWorker.run((imgList, keyVal, scriptUrl) => {
        importScripts(scriptUrl);
        const decodeImgList = [];
        const decodeLen = imgList.length;
        let index = 0;
        const hexToBase64 = (str) => {
          const strArray = str.replace(/\r|\n/g, '').replace(/([\da-fA-F]{2}) ?/g, '0x$1 ').replace(/ +$/, '').split(' ');
          const str1 = [];
          const len = strArray.length;
          for (let i = 0; i < len; i++) {
            str1.push(String.fromCharCode(strArray[i]));
          }
          return str1.join('');
        };
        const decodeImg = (imgUrl, keyVal) => {
          const xhr = new XMLHttpRequest();
          xhr.onreadystatechange = function (event) {
            if (this.readyState == 4 && this.status == 200) {
              let data = xhr.responseText.toString(); // 加密的字符串
              try {
                data = CryptoJS.AES.decrypt(data, keyVal).toString(CryptoJS.enc.Utf8); // 解密
                // console.log(data);
                data = hexToBase64(data);
                decodeImgList.push({ data: data, imageUrl: event.target.responseURL });
                // 判断递归
                if (decodeImgList.length === decodeLen) {
                  self.postMessage(decodeImgList);
                } else {
                  decodeImg(imgList[++index].url, keyVal);
                }
              } catch (err) {
                console.log(err);
              } finally {
              }
            }
          };
          xhr.open('GET', imgUrl);
          xhr.send(null);
        };
        decodeImg(imgList[index].url, keyVal);
        // 二进制转64码
      }, [encodeList, key, scriptUrl])
        .then((data) => {
          for (let i = 0; i < data.length; i++) {
            this.imgList.push({ url: `data:image/jpeg;base64,${btoa(data[i].data)}`, imageUrl: data[i].imageUrl, status: 3 }); // 追加
          }
          this.encodeList = []; // 清空数组
          this.loading = false;
        });
    },
    isPC () {
      const userAgentInfo = navigator.userAgent;
      const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
      let flag = true;
      for (let v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
      }
      return flag;
    }
  },
  components: {
    ImgPreview
  }
};
</script>
<style scoped>
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
    overflow: hidden;
  }
  .uploadWrap .inputFile{
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    opacity: 0.01;
    cursor: pointer;
    z-index: 1;
  }
  .clearfix {
    zoom: 1;
  }
  .clearfix:after {
    clear: both;
    display: block;
    content: ".";
    height: 0;
    visibility: hidden;
  }
  .imgLoading {
    display: none;
  }
  .imgLoading.active{
    display: block;
  }
</style>
