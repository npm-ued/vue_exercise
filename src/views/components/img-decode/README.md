## 使用方法

### mount with component
```
<template>
  <div>
    <imgDecode :value="imgList" :keyVal="key"/>
  </div>
</template>
<script>
import imgDecode from 'img-decode';
export default {
  data () {
    return {
      imgList:[],
      keyVal:''
    }
  },
  components: {
    imgDecode
  }
}
</script>

```
### 一般情况下只是展示图片的时候使用


