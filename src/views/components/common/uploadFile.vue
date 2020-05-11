/*
 * @Author: sail web admin
 * @Date: 2020-04-22 16:17:50
 * @Last Modified by: sail web admin
 * @Last Modified time: 2020-04-27 14:03:21
 * 图片上传组件
 */

<template>
  <Upload
    :action="uploadUrl"
    accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    :name="fileName || 'file'"
    :headers="uploadConfig.headers"
    :show-upload-list="uploadConfig.showUploadList"
    :max-size="uploadConfig.maxSize"
    :on-success="handleSuccess"
    :on-error="handleError"
    :on-format-error="handleFormatError"
    :on-exceeded-size="handleMaxSize"
    style="float:right;">
    <Button type="warning">{{$t('Common.Upload')}}</Button>
  </Upload>
</template>

<script>
export default {
  props: ['uploadUrl', 'scene', 'fileName'],
  data () {
    const uploadConfig = {
      headers: { 'Authorization': `Bearer ${localStorage.JWT_TOKEN}` },
      showUploadList: false,
      maxSize: 10 * 1024
    };
    return {
      uploadConfig: uploadConfig
    };
  },
  methods: {
    handleSuccess (response, file) {
      this.$Notice.success({
        title: '文件上传成功',
        desc: `文件 ${file.name} 上传成功`
      });
      if (this.scene) this.$root.$emit(this.scene, 'OK');
    },
    handleError (err, file) {
      this.$Notice.error({
        title: '文件上传失败',
        desc: file.msg || '服务器繁忙，文件上传失败，请稍后重试',
        duration: 0
      });
      console.log(err.stack);
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: `文件  ${file.name} 格式不正确，请上传正确的文件。`
      });
    },
    handleMaxSize (file) {
      this.$Notice.warning({
        title: '超出文件大小限制',
        desc: `文件 ${file.name} 太大，不能超过 2M。`
      });
    }
  }
};
</script>

<style scoped>
  .ivu-form-item-content { line-height: 0; font-size: 6px; }
</style>
