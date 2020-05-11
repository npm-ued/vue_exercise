/*
 * @Author: sail web admin
 * @Date: 2020-04-21 10:04:09
 * @Last Modified by: sail web admin
 * @Last Modified time: 2020-05-11 11:57:11
 * 列表测试案例
 */

<template>
  <div>
    <tableFilter :formItems="formItems" :filter="filter" @selectChange="selectChange"></tableFilter>
    <Table border stripe :columns="columns" :data="testList" size="small"></Table>
    <div style="margin: 10px; overflow: hidden;">
      <div style="float: right;">
        <Page :total="totalCount" :current="filter.pageNum" :page-size="filter.pageSize" @on-change="changePage" @on-page-size-change="pageSizeChange" style="margin-top: 15px;"></Page>
      </div>
    </div>
    {{fullName}}
  </div>
</template>
<script>
import config from '../../assets/js/config';
import util from '../../assets/js/util';
const exportEcmUrl = '/userInfo/exportEcmProtocol/'; // 导出注册协议
const exportUrl = '/userInfo/exportProtocol/'; // 导出注册协议
export default {
  name: 'testList',
  data () {
    return {
      firstName: '',
      lastName: '',
      testList: [], // 测试列表数据
      checkList: [], // 审批结果后台数据
      totalCount: 0,
      filter: {
        pageNum: 1,
        pageSize: 10,
        billStatus: '',
        pastDay: '',
        billCustomerName: '',
        borrowType: '',
        archiveDebtCleared: ''
      }
    };
  },
  computed: {
    formItems: function () {
      return [
        { type: 'select', label: `${this.$t('TestManagerModule.Filter.ExamResult')}:`, placeholder: `${this.$t('Common.PleaseEnter')}${this.$t('TestManagerModule.Filter.ExamResult')}`, model: 'billStatus', options: this.checkList, fun: 'selectChange' },
        { type: 'select', label: `${this.$t('TestManagerModule.Filter.CreateTime')}:`, placeholder: `${this.$t('Common.PleaseEnter')}${this.$t('TestManagerModule.Filter.CreateTime')}`, model: 'pastDay', fun: 'selectChange' },
        { type: 'input', label: `${this.$t('TestManagerModule.Filter.BorrowerName')}:`, placeholder: `${this.$t('Common.PleaseEnter')}${this.$t('TestManagerModule.Filter.BorrowerName')}`, model: 'billCustomerName' },
        { type: 'select', label: `${this.$t('TestManagerModule.Filter.BorrowerType')}:`, placeholder: `${this.$t('Common.PleaseEnter')}`, model: 'borrowType', fun: 'selectChange' },
        { type: 'select', label: `${this.$t('TestManagerModule.Filter.ResultStatus')}:`, placeholder: `${this.$t('Common.PleaseEnter')}`, model: 'archiveDebtCleared', fun: 'selectChange' },
        { type: 'button', buttonArr: [{ message: this.$t('Common.Inquire'), type: 'primary', fun: 'selectChange' }] }
      ];
    },
    columns: function () {
      return [
        { title: this.$t('TestManagerModule.UserId'), key: 'userId', width: 60, align: 'center', fixed: 'left' }, // 左侧固定列
        { title: this.$t('TestManagerModule.UserName'), key: 'username', minWidth: 100, align: 'center' },
        { title: this.$t('TestManagerModule.Uname'), key: 'uname', minWidth: 90, align: 'center' },
        { title: this.$t('TestManagerModule.RealName'), key: 'realName', minWidth: 80, align: 'center' },
        { title: this.$t('TestManagerModule.UserNum'), key: 'username', minWidth: 100, align: 'center' },
        { title: this.$t('TestManagerModule.IdCard'), key: 'idCard', minWidth: 120, align: 'center' },
        { title: this.$t('TestManagerModule.BankCardNumber'), key: 'bankCardNumber', minWidth: 120, align: 'center' },
        { title: this.$t('TestManagerModule.ChannelAgencyFullName'), key: 'channelAgencyFullName', minWidth: 90, align: 'center', fixed: 'right' }, // 右侧固定列
        {
          title: this.$t('TestManagerModule.CreateTime'),
          key: 'createTime',
          minWidth: 130,
          align: 'center',
          render: (h, params) => {
            const { createTime } = params.row;
            return h('div', (createTime ? util.chinaTimeFormat(createTime) : '')); // 时间格式化
          }
        },
        { title: this.$t('TestManagerModule.Status'),
          key: 'status',
          minWidth: 90,
          align: 'center',
          render: (h, params) => {
            const { status } = params.row;
            return h('span', util.getListMap(config.userStatusMap)[status]);
          }
        },
        { title: this.$t('TestManagerModule.Mark'),
          key: 'mark',
          minWidth: 90,
          align: 'center',
          render: (h, params) => {
            const { mark } = params.row;
            return h('span', util.getListMap(config.markDict)[mark]);
          }
        },
        { title: this.$t('TestManagerModule.Remark'), key: 'remark', minWidth: 120, align: 'center', ellipsis: true, tooltip: true },
        { title: this.$t('TestManagerModule.AutoRepayDict'),
          key: 'hxWithholdStatus',
          minWidth: 90,
          align: 'center',
          render: (h, params) => {
            const { hxWithholdStatus } = params.row;
            return h('span', util.getLsitMap(config.autoRepayDict)[hxWithholdStatus]);
          }
        },
        { title: this.$t('TestManagerModule.OverdueAutoRepayDict'),
          key: 'xcWithholdStatus',
          minWidth: 90,
          align: 'center',
          render: (h, params) => {
            const { xcWithholdStatus, yeepayWithholdStatus } = params.row;
            return h('span', util.getListMap(config.autoRepayDict)[(+xcWithholdStatus || +yeepayWithholdStatus) ? 1 : 0]);
          }
        },
        { title: this.$t('TestManagerModule.XcpayStatus'),
          key: 'xcpayStatus',
          minWidth: 90,
          align: 'center',
          render: (h, params) => {
            const { xcpayStatus } = params.row;
            return h('span', util.getListMap(config.xcpayStatusMap)[xcpayStatus]);
          }
        },
        {
          title: this.$t('Opreate'),
          minWidth: 370,
          align: 'center',
          // fixed: 'right',
          render: (h, params) => {
            // 根据用户权限显示操作按钮
            const { status, userId, userType, uname } = params.row;
            const htmlArr = [];
            if (this.$store.state.user.access.indexOf('USERS_FREEZE') > -1) {
              htmlArr.push(h('Button', {
                props: { type: 'primary', size: 'small' },
                style: { marginRight: '5px' },
                on: {
                  click: () => {
                    this.blockUser(userId, status);
                  }
                }
              }, status == 1 ? '冻结' : '解冻'));
            }
            if (this.$store.state.user.access.indexOf('USERS_XCPAY_DAIKOU_EXPORT') > -1) {
              htmlArr.push(h('Button', {
                props: { type: 'primary', size: 'small' },
                style: { marginRight: '5px' },
                on: {
                  click: () => {
                    if (confirm('确定要用户重新签约吗？')) {
                      this.forceCancelEcmSign(userId);
                    }
                  }
                }
              }, '扣款重新授权'));
            }
            if (this.$store.state.user.access.indexOf('USERS_REG_EXPORT') > -1) {
              htmlArr.push(h('Button', {
                props: { type: 'primary', size: 'small' },
                style: { marginRight: '5px' },
                on: {
                  click: () => {
                    if (confirm('确定要导出注册协议吗？')) {
                      this.exportFile(userId, exportUrl);
                    }
                  }
                }
              }, '导出注册协议'));
            }
            if (this.$store.state.user.access.indexOf('USERS_XCPAY_DAIKOU_EXPORT') > -1) {
              htmlArr.push(h('Button', {
                props: { type: 'primary', size: 'small' },
                style: { marginRight: '5px' },
                on: {
                  click: () => {
                    if (confirm('确定要导出签约协议吗？')) {
                      this.exportFile(userId, exportEcmUrl);
                    }
                  }
                }
              }, '导出消金签约协议'));
            }
            if (this.$store.state.user.access.indexOf('USER_MARK') > -1) {
              htmlArr.push(h('Button', {
                props: { type: 'primary', size: 'small' },
                style: { marginRight: '5px' },
                on: {
                  click: () => {
                    this.openUserMark(params.row);
                  }
                }
              }, '标记用户'));
            }
            // if (this.$store.state.user.access.indexOf('USER_MARK') > -1) {
            //   htmlArr.push(h('Button', {
            //     props: { type: !userType ? 'success' : 'warning', size: 'small' },
            //     style: { marginRight: '5px' },
            //     on: {
            //       click: () => {
            //         this.disputeUserMark(uname, userType);
            //       }
            //     }
            //   }, !userType ? '添加纠纷用户' : '取消纠纷用户'));
            // }
            if (this.$store.state.user.access.indexOf('USER_MARK') > -1) {
              htmlArr.push(h('Button', {
                props: { type: 'primary', size: 'small' },
                style: { marginRight: '5px' },
                on: {
                  click: () => {
                    this.openUserStatusMark(params.row);
                  }
                }
              }, '用户情况标记'));
            }
            // 提现
            if (this.$store.state.user.access.indexOf('USERS_WITHDRAW') > -1) {
              htmlArr.push(h('Button', {
                props: { type: 'primary', size: 'small' },
                style: { marginRight: '5px' },
                on: {
                  click: () => {
                    this.uname = uname;
                    this.balanceFormVal = {
                      uname: uname,
                      amount: '',
                      balance: ''
                    };
                    this.searchBalance(uname);
                  }
                }
              }, '提现'));
            }
            return h('div', htmlArr);
          }
        }
      ];
    }
  },
  methods: {
    changePage (current) {
      this.filter.pageNum = current;
      this.getTableInfo();
    },
    pageSizeChange (pageSize) {
      this.filter.pageNum = 1;
      this.filter.pageSize = pageSize;
      this.getTableInfo();
    },
    searchTableInfo () {
      this.filter.pageNum = 1;
      this.getTableInfo();
    },
    // 获取用户列表
    getTableInfo () {
      this.getTotalAmount();
      this.$ajax.get(`/userList`, { params: this.filter }).then((res) => {
        console.log(res);
        this.testList = res.data.body.dataList;
      });
    },
    // 获取总条数
    getTotalAmount () {
      // this.$ajax.get('/bill/v2/countBillStatistics', { params: this.filter }).then((res) => {
      //   this.totalCount = res.data.count;
      // });
    },
    // 获取审批结果选择列表
    getCheckList () {
      this.$ajax.get(`/checkList`).then((res) => {
        console.log(res);
        this.checkList = res.data.body;
      });
    },
    selectChange () {
      // alert('开始查找');
      this.getTableInfo();
    }
  },
  // 生命周期mounted函数
  mounted () {
    this.columns.forEach((item) => {
      this.$set(item, 'align', 'center'); // 每列都居中
    });
    this.getCheckList(); // 获取选择列表
    this.searchTableInfo();
  },
  components: {
  }
};
</script>
<style scoped>
</style>
