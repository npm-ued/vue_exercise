<template>
  <div class="filterOutBox">
    <Form
      inline
      label-position="top"
      ref="tableFilterForm"
      :model="filter"
      class="filterFormBox"
      :class="!buttonStatus ? 'filterFormHide' : 'filterFormShow'"
    >
      <Row>
        <div v-for="(item, index) in formItems" :key="index">
          <Col :xs="12" :sm="8" :md="6" :lg="4" v-if="item.type != 'button'">
            <FormItem :prop="item.model" :label="item.label" v-if="item.type == 'input'">
              <Input type="text" v-model.trim="filter[item.model]" :placeholder="item.placeholder"></Input>
            </FormItem>
            <FormItem :prop="item.model" :label="item.label" v-if="item.type == 'date'">
              <DatePicker
                format="yyyy-MM-dd"
                type="date"
                v-model="filter[item.model]"
                :transfer="true"
                :placeholder="item.placeholder"
                @on-change="filter[item.model]=$event"
                style="width: 100%;"
              ></DatePicker>
            </FormItem>
            <FormItem :prop="item.model" :label="item.label" v-if="item.type == 'daterange'">
              <DatePicker
                format="yyyy-MM-dd"
                type="daterange"
                v-model="filter[item.model]"
                :transfer="true"
                :placeholder="item.placeholder"
                @on-change="filter[item.model]=$event"
                style="width: 100%;"
              ></DatePicker>
            </FormItem>
            <FormItem :prop="item.model" :label="item.label" v-if="item.type == 'date'">
              <DatePicker
                format="yyyy-MM-dd"
                type="date"
                v-model="filter[item.model]"
                :transfer="true"
                :placeholder="item.placeholder"
                @on-change="filter[item.model]=$event"
                style="width: 100%;"
              ></DatePicker>
            </FormItem>
            <FormItem :prop="item.model" :label="item.label" v-if="item.type == 'month'">
              <DatePicker
                format="yyyy-MM"
                type="month"
                v-model="filter[item.model]"
                :transfer="true"
                :placeholder="item.placeholder"
                @on-change="filter[item.model]=$event"
                style="width: 100%;"
              ></DatePicker>
            </FormItem>
            <FormItem :prop="item.model" :label="item.label" v-if="item.type == 'datetime'">
              <DatePicker
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                :placeholder="item.placeholder"
                :transfer="true"
                v-model="filter[item.model]"
                @on-change="filter[item.model]=$event"
                style="width: 100%;"
              ></DatePicker>
            </FormItem>
            <FormItem :prop="item.model" :label="item.label" v-if="item.type == 'select'">
              <Select
                v-model="filter[item.model]"
                :transfer="true"
                @change="item.fun && runMethods(item.fun, item.params)"
                :placeholder="item.placeholder"
                clearable
              >
                <Option
                  v-for="(opt, index) in item.options"
                  :value="opt.value"
                  :key="index"
                >{{ opt.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col
            :xs="12"
            :sm="8"
            :md="6"
            v-if="item.type == 'button' && !toggleBtnType && item.buttonArr.length == 1"
            style="float: right; text-align: right;"
          >
            <FormItem style="margin-bottom: 5px;" label="  ">
              <div style="float: right;" v-for="(buttonItem,index) in item.buttonArr" :key="index">
                <template v-if="buttonItem.action != 'upload' && buttonItem.action != 'reset'">
                  <template v-if="buttonItem.permissions">
                    <Button
                      style="margin: 5px 0 0 12px; width: 90%;"
                      @click="buttonItem.fun && runMethods(buttonItem.fun, buttonItem.params)"
                    >{{ buttonItem.message }}</Button>
                  </template>
                  <template v-else>
                    <Button
                      style="margin: 5px 0 0 12px; width: 90%;"
                      @click="buttonItem.fun && runMethods(buttonItem.fun, buttonItem.params)"
                    >{{ buttonItem.message }}</Button>
                  </template>
                </template>
                <Button
                  :type="buttonItem.type"
                  style="margin: 5px 0 0 5px;"
                  v-if="buttonItem.action == 'reset'"
                  @click="resetForm(buttonItem.fun)"
                >{{ buttonItem.message }}</Button>
                <ExcelUpload
                  style="margin: 5px 0 0 5px; width: 90%"
                  :scene="buttonItem.fun"
                  :uploadUrl="buttonItem.uploadUrl"
                  :fileName="buttonItem.fileName"
                  v-if="buttonItem.action == 'upload'"
                ></ExcelUpload>
              </div>
            </FormItem>
          </Col>
          <Col
            :xs="12"
            :sm="8"
            :md="item.buttonArr.length ==2 ? 6 : 8"
            v-if="item.type == 'button' && !toggleBtnType && item.buttonArr.length > 1"
            style="float: right; text-align: right;"
          >
            <FormItem style="margin-bottom: 5px;" label="  ">
              <div style="float: right;" v-for="(buttonItem,index) in item.buttonArr" :key="index">
                <template v-if="buttonItem.action != 'upload' && buttonItem.action != 'reset'">
                  <template v-if="buttonItem.permissions">
                    <Button
                      :type="buttonItem.type"
                      style="margin: 5px 0 0 5px;"
                      v-permissions="buttonItem.permissions"
                      @click="buttonItem.fun && runMethods(buttonItem.fun, buttonItem.params)"
                    >{{ buttonItem.message }}</Button>
                  </template>
                  <template v-else>
                    <Button
                      :type="buttonItem.type"
                      style="margin: 5px 0 0 5px;"
                      @click="buttonItem.fun && runMethods(buttonItem.fun, buttonItem.params)"
                    >{{ buttonItem.message }}</Button>
                  </template>
                </template>
                <Button
                  :type="buttonItem.type"
                  style="margin: 5px 0 0 5px;"
                  v-if="buttonItem.action == 'reset'"
                  @click="resetForm(buttonItem.fun)"
                >{{ buttonItem.message }}</Button>
                <ExcelUpload
                  style="margin: 5px 0 0 5px;"
                  :scene="buttonItem.fun"
                  :uploadUrl="buttonItem.uploadUrl"
                  :fileName="buttonItem.fileName"
                  v-if="buttonItem.action == 'upload'"
                ></ExcelUpload>
              </div>
            </FormItem>
          </Col>
        </div>
      </Row>
    </Form>
    <div class="filterBtn">
      <a class="put-down" @click="changeStatus()">
        <Icon :type="buttonStatus?'ios-arrow-down':'ios-arrow-up'"></Icon>
        {{buttonStatus?` ${$t('Common.Expand')}`:` ${$t('Common.Collapse')}`}}
      </a>
    </div>
  </div>
</template>

<script>
import ExcelUpload from './uploadFile.vue';
export default {
  name: 'table-filter',
  data () {
    return {
      toggleBtnType: false,
      buttonStatus: false
    };
  },
  props: [
    'formItems',
    'filter',
    'selectChange'
  ],
  methods: {
    runMethods (funName, params) {
      if (params) {
        this.$emit(funName, params);
      } else {
        this.$emit(funName);
      }
    },
    changeStatus () {
      this.buttonStatus = !this.buttonStatus;
      this.$store.commit('changeFilterStatus');
    },
    resetForm (callback) {
      this.$refs['tableFilterForm'].resetFields();
      if (callback) {
        this.$nextTick(() => {
          this.runMethods(callback);
        });
      }
    }
  },
  mounted () {
  },
  computed: {
    filterStatus () {
      return this.$store.state.app.filterStatus;
    }
  },
  components: { ExcelUpload } // 子组件注入
};
</script>

<style scoped>
.ivu-form-item {
  width: 100%;
  padding-left: 5px;
  padding-right: 5px;
}
.contentStatus {
  padding: 10px 40px;
}
.filterFormBox .ivu-col {
  transition: width 0.2s ease-in-out;
  minheight: 71px;
}
.filterOutBox {
  box-shadow: 0 0 10px rgba(57, 105, 235, 0.2);
  padding: 10px 0;
  margin-bottom: 10px;
  background: #fff;
}
.filterBtn {
  padding: 0 5px;
  margin-top: 0px;
}
.filterBtn a {
  display: block;
  width: 100%;
  height: 30px;
  background: #f7f8fb;
  line-height: 30px;
  text-align: center;
}
@media only screen and (max-width: 675px) {
  .contentStatus {
    padding: 0;
  }
  .ivu-form-item {
    padding-left: 5px;
    padding-right: 5px;
    margin-bottom: 16px;
  }
}
.filterOutBox .ivu-form-item {
  margin-bottom: 10px;
}
</style>
