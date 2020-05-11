<template>
  <div>
    <div :class="loading?'imgLoading active':'imgLoading'">
      加载中...
    </div>
    <img-preview :imgList="imgList"/>
  </div>
</template>
<script>
import WebWorker from '../web-worker/index';
import ImgPreview from '../img-upload/img-preview.vue';

export default {
  data () {
    return {
      loading: true,
      imgList: []
    };
  },
  props: {
    value: Array,
    keyVal: String
  },
  methods: {
  },
  mounted () {
    // test Web Worker
    WebWorker.run((imgList, keyVal) => {
      importScripts('https://testyunkong.91jinrong.com/js/assets/crypto-js/crypto-js.js');
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
        xhr.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            let data = xhr.responseText.toString(); // 加密的字符串
            try {
              data = CryptoJS.AES.decrypt(data, keyVal).toString(CryptoJS.enc.Utf8); // 解密
              data = hexToBase64(data);
              decodeImgList.push(data);
              // 判断递归
              if (decodeImgList.length === decodeLen) {
                self.postMessage(decodeImgList);
              } else {
                decodeImg(imgList[++index], keyVal);
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
      decodeImg(imgList[index], keyVal);
      // 二进制转64码
    }, [this.value, this.keyVal])
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          this.imgList.push({ url: `data:image/jpeg;base64,${btoa(data[i])}`, status: 2 }); // 追加
        }
        this.loading = false;
      });
  },
  components: {
    ImgPreview
  }
};
</script>
<style scoped>
.imgLoading {
  display: none;
}
.imgLoading.active{
  display: block;
}

</style>
