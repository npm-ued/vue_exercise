## 使用方法


### mount with component
```
<template>
  <div>
    <img-upload v-model="premisesImgList" :keyVal="key"  :edit="edit" :postKey=false/>
  </div>
</template>
<script>
import ImgUpload from 'img-upload';
export default {
  data () {
    return {
      premisesImgList: [
        {id: 111, 'url': 'https://ui.91jinrong.com/yunkongdev/cc546468-86e1-4d79-bfce-36c218e743b7'},
        {id: 112, 'url': 'https://ui.91jinrong.com/yunkongdev/2d280240-814e-4915-ab10-de18e21e1b44'}
      ], // 图片列表
      key:'0vJuVN3QFoodVnTU7IXD-h2GXP0kyZiQpWZLRvpNrZWmF', // 解密key
      edit: true, // 是否是可编辑的
    }
  },
  components: {
    ImgUpload
  }
}
</script>

```
### 在表单中直接通过form的形式获取即可

> 图片上传组件返回字段说明
```
[
  {
    id: 0 // id为0的为新增图片
    url:'', // 图片上传七牛的url
    status:'' // 图片状态3为未变更，2为新增成功，1为正在上传中，0 为已删除
  },
  {
    id: 0
    url:'',
    status:''
  }
]
```
## 如果要对比图片的长度则去除status为0的图片长度进行校验即可
