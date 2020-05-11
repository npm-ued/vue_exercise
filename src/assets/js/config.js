/**
 * @author liangyu
 * @date 2019-04-22 09:57
 * @Description: 配置字典
 */
const all = '';

const config = {
  allList: [{ name: '全部', value: all }],
  booleanList: [{ name: '是', value: 1 }, { name: '否', value: 2 }],
  booleanList2: [{ name: '是', value: true }, { name: '否', value: false }],
  booleanList3: [{ name: '否', value: 0 }, { name: '是', value: 1 }],
  booleanList4: [{ name: '全部', value: all }, { name: '是', value: 1 }, { name: '否', value: 0 }],
  hasInfo: [{ value: 1, name: '有' }, { value: 0, name: '无' }],
  ppFlag: [{ value: '00', name: '对公' }, { value: '01', name: '对私' }],
  interestModeMap: [{ value: 'epi', name: '等额本息' }, { value: 'tid', name: '先息后本' }, { value: 'tid,epi', name: '先息后本息' }, { value: 'eii', name: '等本等息' }, { name: '等额本金', value: 'avc' }, { name: '等额本金本息组合', value: 'avc,tid' }],
  interestModeMap2: [{ name: '全部', value: all }, { value: 'epi', name: '等额本息' }, { value: 'tid', name: '先息后本' }, { value: 'tid,epi', name: '先息后本息' }, { value: 'eii', name: '等本等息' }, { name: '等额本金', value: 'avc' }, { name: '等额本金本息组合', value: 'avc,tid' }],
  interestModeMap3: [{ value: 'epi', name: '等额本息（直签机构）' }, { value: 'Dy,epi', name: '等额本息（贷鱼）' }, { value: 'tid,epi', name: '先息后本息（直签机构）' }, { value: 'Dy,tid,epi', name: '先息后本息（贷鱼）' }],
  hexinPushStatusDict: [{ name: '全部', value: all }, { name: '已推送', value: '1' }, { name: '未推送', value: '0' }],
  marriageNotesType: [{ name: '已婚', value: '已婚' }, { name: '未婚', value: '未婚' }, { name: '离异', value: '离异' }],
  sexType: [{ name: '女', value: '女' }, { name: '男', value: '男' }],
  educationType: [{ name: '初中', value: '初中' }, { name: '高中及以下', value: '高中及以下' }, { name: '高中/中专', value: '高中/中专' }, { name: '中专', value: '中专' }, { name: '大专', value: '大专' }, { name: '本科', value: '本科' }, { name: '硕士', value: '硕士' }, { name: '硕士及以上', value: '硕士及以上' }, { name: '其他', value: '其他' }],
  companyNatureType: [{ name: '国家机关', value: '国家机关' }, { name: '国有企业', value: '国有企业' }, { name: '集体企业', value: '集体企业' }, { name: '中外合资', value: '中外合资' }, { name: '股份制企业', value: '股份制企业' }, { name: '私营企业', value: '私营企业' }, { name: '无', value: '无' }],
  professionType: [{ name: '国家机关、事业单位', value: '国家机关、事业单位' }, { name: '国有企业、集体企业', value: '国有企业、集体企业' }, { name: '外资或合资企业、私营企业', value: '外资或合资企业、私营企业' }, { name: '个体户', value: '个体户' }, { name: '临时职业或无稳定职业', value: '临时职业或无稳定职业' }, { name: '其他职业', value: '其他职业' }],
  selectRepaymentModeType: [{ name: '机构贴息', value: 1 }, { name: '用户自付', value: 2 }, { name: '机构间接代偿', value: 3 }],
  refuseReason: [{ name: '综合评分不足', value: '综合评分不足' }, { name: '调查异常', value: '调查异常' }, { name: '本人放弃', value: '本人放弃' }, { name: '高风险', value: '高风险' }],
  approvalStatus: [{ name: '全部', value: all }, { name: '已确认', value: '-1' }, { name: '待确认', value: '-2' }, { name: '已审批', value: '1' }, { name: '审批未通过', value: '2' }, { name: '待审批', value: 0 }, { name: '回退', value: '3' }],
  approvalStatusDL: [{ name: '全部', value: all }, { name: '已提交', value: '2' }, { name: '审核拒绝', value: '5' }, { name: '审核通过', value: '6' }],
  interestMethods: [{ name: '全部', value: all }, { name: '等额本息', value: 'epi' }, { name: '先息后本', value: 'tid' }, { name: '先息后本息', value: 'tid,epi' }, { name: '等本等息', value: 'eii' }, { name: '等额本金', value: 'avc' }, { name: '等额本金本息组合', value: 'avc,tid' }],
  applyChannels: [{ name: '全部', value: all }, { name: '贷鱼', value: '1' }, { name: '融360', value: '2' }, { name: '直签机构', value: '3' }, { name: '现金分期', value: '5' }, { name: '装修分期', value: '6' }, { name: '信可分A类', value: '7' }],
  ownerStatus: [{ name: '全部', value: all }, { name: '未认领', value: '0' }, { name: '已认领', value: '1' }],
  borrowerProductStyle: [{ name: '全部', value: all }, { name: '一次性还本付息', value: 'end' }, { name: '等额本息', value: 'epi' }, { name: '先息后本', value: 'tid' }, { name: '等本等息', value: 'eii' }, { name: '先息后本息', value: 'tid,epi' }, { name: '等额本金', value: 'avc' }, { name: '等额本金本息组合', value: 'avc,tid' }],
  paymentType: [{ name: '全部', value: all }, { name: '机构贴息', value: '1' }, { name: '用户自付', value: '2' }, { name: '机构间接代偿', value: '3' }, { name: '机构直接代偿', value: '4' }],
  paymentType4: [{ name: '全部', value: null }, { name: '用户自付', value: 0 }, { name: '机构间接代偿', value: 1 }, { name: '机构直接代偿', value: 2 }], // 新的还款明细-核心还款类型
  paymentType3: [{ name: '机构贴息', value: '1' }, { name: '用户自付', value: '2' }, { name: '机构间接代偿', value: '3' }, { name: '机构直接代偿', value: '4' }],
  paymentType2: [{ name: '全部', value: all }, { name: '机构贴息', value: '1' }, { name: '用户自付', value: '2' }, { name: '机构间接代偿', value: '3' }],
  repayStatus: [{ name: '全部', value: all }, { name: '待还款', value: '6' }, { name: '已还款', value: '7' }, { name: '提前还款', value: '9' }],
  interestMode: [{ name: '全部', value: all }, { name: '等额本息', value: 'epi' }, { name: '先息后本', value: 'tid' }, { name: '先息后本息', value: 'tid,epi' }],
  consumeBorrowerRepayStyleDict: [{ name: '等本等息', value: 'eii' }],
  redeemType: [{ name: '全部', value: all }, { name: '正常还款', value: '0' }, { name: '提前还款', value: '3' }, { name: '逾期还款', value: '2' }, { name: '机构结清', value: '4' }, { name: '诉讼结清', value: '5' }, { name: '核销结清', value: '6' }],
  selectPaymentStatus: [{ name: '全部', value: all }, { name: '待还款', value: '0' }, { name: '已还款', value: '1' }],
  repayStatusMap: [{ name: '全部', value: all }, { name: '待还', value: '0' }, { name: '已还', value: '1' }],
  rejectStatus: [{ name: '全部', value: all }, { name: '驳回未处理', value: '1' }, { name: '已处理', value: '2' }, { name: '撤销', value: '3' }],
  rejectStatus2: [{ name: '驳回待处理', value: '1' }, { name: '已通过', value: '2' }],
  withholdChannelMap: [{ name: '全部', value: all }, { name: '核心', value: 'hexin' }, { name: '厦门银行', value: 'xcpay' }, { name: '中金支付', value: 'cpcn' }, { name: '线下充值', value: 'offline' }, { name: '易宝支付', value: 'yeepay' }],
  withholdChannel: [{ name: '核心', value: 'hexin' }, { name: '厦门银行', value: 'xcpay' }, { name: '中金支付', value: 'cpcn' }, { name: '线下充值', value: 'offline' }, { name: '易宝支付', value: 'yeepay' }],
  withholdTypeMap: [{ name: '全部', value: all }, { name: '逾期还款', value: 'overdue' }, { name: '正常还款', value: 'normal' }, { name: '提前还款', value: 'prepay' }, { name: '诉讼结清', value: 'litigation' }, { name: '机构结清', value: 'organization' }], // 充值订单查询-筛选条件：交易类型
  withholdType: [{ name: '逾期还款', value: 'overdue' }, { name: '正常还款', value: 'normal' }, { name: '提前还款', value: 'prepay' }, { name: '诉讼结清', value: 'litigation' }, { name: '机构结清', value: 'organization' }], // 充值订单查询-列表：交易类型
  withholdType2: [{ name: '部分扣款', value: '1' }, { name: '全部扣款', value: '2' }],
  withHoldStatusMap: [{ name: '全部', value: all }, { name: '处理中', value: 0 }, { name: '成功', value: 1 }, { name: '失败', value: 2 }, { name: '审核中', value: 3 }],
  withHoldStatus: [{ name: '处理中', value: 0 }, { name: '成功', value: 1 }, { name: '失败', value: 2 }, { name: '审核中', value: 3 }],
  channelPaymentTypeMap: [{ name: '全部', value: all }, { name: '代扣', value: 1 }, { name: '协议支付', value: 2 }, { name: '快捷支付', value: 3 }],
  channelPaymentType: [{ name: '代扣', value: 1 }, { name: '协议支付', value: 2 }, { name: '快捷支付', value: 3 }],
  verifyStatusMap: [{ name: '全部', value: all }, { name: '未审核', value: 0 }, { name: '审核成功', value: 1 }, { name: '审核拒绝', value: 2 }],
  chargeTypeMap: [{ name: '全部', value: all }, { name: '缴费', value: 0 }, { name: '扣费', value: 1 }],
  surrenderTypeMap: [{ name: '全部', value: null }, { name: '待缴纳', value: 1 }, { name: '已缴纳', value: 2 }],
  userStatusMap: [{ name: '全部', value: all }, { name: '可用', value: 1 }, { name: '已冻结', value: 2 }],
  markDictMap: [{ name: '全部', value: all }, { name: '正常', value: '0' }, { name: '关注', value: '1' }, { name: '次级', value: '2' }, { name: '可疑', value: '3' }, { name: '损失', value: '4' }],
  markDict: [{ name: '正常', value: '0' }, { name: '关注', value: '1' }, { name: '次级', value: '2' }, { name: '可疑', value: '3' }, { name: '损失', value: '4' }],
  autoRepayDict: [{ name: '全部', value: all }, { name: '未开通', value: '0' }, { name: '已开通', value: '1' }],
  projectRepaymentTypeMap: [{ name: '全部', value: null }, { name: '用户自付', value: 1 }, { name: '机构贴息', value: 2 }],
  projectRepaymentTypeMap2: [{ name: '全部', value: null }, { name: '用户自付', value: 1 }, { name: '三方机构代偿', value: 2 }, { name: '合作机构代偿', value: 3 }], // 新的还款明细、还款汇总-机构还款类型
  fileExportStatusSelect: [{ name: '未开始', value: 0 }, { name: '已开始', value: 1 }, { name: '已完成', value: 2 }, { name: '异常', value: 3 }],
  projectRepaymentType: [{ name: '用户自付', value: 1 }, { name: '机构贴息', value: 2 }],
  payChannelMap: [{ name: '厦门银行B2B', value: 'CBXM' }, { name: '易宝支付', value: 'YEEPAY' }, { name: '通联支付', value: 'ALLINPAY' }, { name: '厦行XCPAY', value: 'XCPAY' }],
  userLogTypeMap: [{ value: 1, naame: '注册' }, { value: 2, name: '开户' }, { value: 3, name: '申请借款' }, { value: 4, name: '充值成功' }, { value: 5, name: '充值失败' }, { value: 6, name: '正常还款' }, { value: 7, name: '提前还款' }],
  bankConfigPayTypeMap: [{ value: 'withhold', name: '代扣支付' }, { value: 'fast_payment', name: '快捷支付' }],
  bankConfigPayTypeMap3: [{ value: '1', name: '代扣支付' }, { value: '2', name: '代扣支付' }, { value: '3', name: '快捷支付' }, { value: '4', name: '快捷支付' }],
  bankConfigPayTypeMap2: [{ name: '全部', value: all }, { value: 'withhold', name: '代扣支付' }, { value: 'fast_payment', name: '快捷支付' }],
  bankPaymentMethedMap: [{ value: '1', name: '代扣' }, { value: '2', name: '协议支付' }, { value: '3', name: '快捷支付' }],
  bankConfigFastPayChannelMap: [{ value: '1', name: '快捷' }, { value: '2', name: '新标准快捷' }],
  projectTypeList: [{ value: '1', name: '代扣' }, { value: '2', name: '协议支付' }, { value: '3', name: '快捷' }, { value: '4', name: '新标准快捷' }, { value: '5', name: '汇款' }], // 充值订单查询页面通道类型
  bankConfigFastPayChannelMap2: [{ name: '全部', value: all }, { value: '1', name: '快捷' }, { value: '2', name: '新标准快捷' }],
  bankPaymentStatus: [{ name: '代扣', value: 1 }, { name: '协议支付', value: 2 }],
  bankPaymentStatus2: [{ name: '全部', value: all }, { name: '代扣', value: 1 }, { name: '协议支付', value: 2 }],
  bankPaymentStatus3: [{ name: '全部', value: null }, { name: '代扣', value: 'withhold-1' }, { name: '协议支付', value: 'withhold-2' }, { value: 'fast_payment-1', name: '快捷' }, { value: 'fast_payment-2', name: '标准快捷' }, { name: '汇款', value: 'withhold-5' }],
  orderWithHoldType: [{ value: '1', name: '代扣' }, { value: '2', name: '协议支付' }, { value: '3', name: '快捷' }, { value: '4', name: '标准快捷' }],
  channelType: [{ value: 'withoutSign', name: '代扣' }, { value: 'withSign', name: '协议支付' }, { value: 'fastStandard', name: '标准快捷' }, { value: 'fastOrigin', name: '快捷' }],
  fastpayChannelType: [{ value: 'fastStandard', name: '标准快捷' }, { value: 'fastOrigin', name: '快捷' }],
  withholdChannelType: [{ value: 'withoutSign', name: '代扣' }, { value: 'withSign', name: '协议支付' }],
  shareBenefitRoleType: [{ name: '随标推送', value: 1 }, { name: '固定账户', value: 2 }],
  roleSubjectType: [{ name: '用户', value: 'user' }, { name: '机构', value: 'company' }],
  compensatorNo: [{ name: '第一还款人', value: 1 }, { name: '第二还款人', value: 2 }, { name: '第三还款人', value: 3 }],
  billAgeMap: [{ name: '全部', value: all }, { name: 'M1', value: 'M1' }, { name: 'M2', value: 'M2' }, { name: 'M3', value: 'M3' }, { name: 'M3+', value: 'M3+' }],
  dict_bank_code: { 'ABOC': '中国农业银行', 'BKCH': '中国银行', 'CIBK': '中信银行', 'EVER': '中国光大银行', 'FJIB': '兴业银行', 'GDBK': '广发银行', 'HXBK': '华夏银行', 'ICBK': '中国工商银行', 'MSBC': '中国民生银行', 'PCBC': '中国建设银行', 'PSBC': '中国邮政储蓄银行', 'SZDB': '平安银行', 'SPDB': '浦发银行', 'BJCN': '北京银行', 'CMBC': '招商银行', 'COMM': '交通银行', 'CBXM': '厦门银行', 'BOSH': '上海银行' },
  litigationRepayMap: [{ name: '全部', value: all }, { name: '提前还款', value: '2' }, { name: '诉讼结清', value: '1' }, { name: '机构结清', value: 3 }, { name: '核销结清', value: 4 }],
  litigationRepayMap2: [{ name: '全部', value: all }, { name: '未结清', value: '0' }, { name: '诉讼结清', value: '1' }, { name: '机构结清', value: 3 }],
  applySourceMap: [{ name: '全部', value: all }, { name: '线上', value: '1' }, { name: '线下', value: '2' }],
  itigationType: [{ name: '诉讼结清', value: 1 }, { name: '机构结清', value: 3 }],
  bindStatusMap: [{ name: '全部', value: all }, { name: '已绑', value: 1 }, { name: '解绑', value: 2 }],
  companyStatus: [{ name: '全部', value: null }, { name: '已注册', value: 0 }, { name: '审核中', value: 1 }, { name: '审核通过', value: 2 }, { name: '审核回退', value: 3 }, { name: '审核拒绝', value: 4 }],
  userTypeMap: [{ name: '企业用户', value: 'ORGANIZATION' }, { name: '个体工商户', value: 'INDIVIDUAL' }],
  userTypeList: [{ name: '正常', value: 0 }, { name: '纠纷', value: 1 }],
  companyCodeTypeMap: [{ name: '统一社会信用代码', value: 1 }, { name: '注册号', value: 2 }],
  sourceChannelMap: [{ name: '全部', value: all }, { name: '现金分期', value: 1 }, { name: '装修分期', value: 2 }, { name: '信可分A类', value: 3 }],
  cashStatusMap: [{ name: '全部', value: all }, { name: '已受理', value: '1' }, { name: '提现成功', value: '2' }, { name: '提现失败', value: '3' }],
  repayWay: [{ name: '正常还款', value: 0 }, { name: '提前还款', value: 1 }],
  cooperationStateList: [{ name: '正常合作', value: 0 }, { name: '暂停放款', value: 1 }, { name: '观察期', value: 2 }, { name: '停止合作', value: 3 }],
  abnormalRepayAlgorithmMap: [{ name: '结清处理', value: '2' }, { name: '逾期处理', value: '1' }],
  receiverType: [{ name: '支付宝', value: 1 }, { name: '永固（6659）', value: 2 }],
  receiverTypeList: [{ name: '支付公司', value: 0 }, { name: '支付宝', value: 1 }, { name: '永固（6659）', value: 2 }],
  channelStatus: [{ name: '开启', value: 1 }, { name: '关闭', value: 2 }],
  payType: [{ name: '快捷支付', value: 'fastpay' }, { name: '代扣支付', value: 'withhold' }],
  supportStatus: [{ name: '支持', value: 1 }, { name: '不支持', value: 2 }],
  remissionType: [{ name: '正常还款减免', value: 0 }, { name: '提前还款减免', value: 1 }], // 减免审核列表-减免类型
  auditType: [{ name: '正常还款减免', value: 0 }, { name: '提前还款减免', value: 1 }, { name: '核销结清', value: 2 }], // 减免审核列表-减免类型
  verifyStatus: [{ name: '审核中', value: 0 }, { name: '审核通过', value: 1 }, { name: '审核拒绝', value: 2 }], // 减免审核列表-审核状态
  tradeType: [{ name: '提前还款', value: 0 }, { name: '机构结清', value: 1 }, { name: '诉讼结清', value: 2 }], // 提前还款充值-交易类型
  productStatus: [{ name: '全部', value: all }, { name: '结清', value: '1' }, { name: '未结清', value: '2' }],
  channelInformation: [{ name: '贷鱼', value: 1 }, { name: '直签机构', value: 3 }, { name: '装修分期', value: 6 }, { name: '信可分A类', value: 7 }], // 项目管理页面-申请渠道
  channelDL: [{ name: '库分期', value: 1 }],
  creditCardStatus: [{ name: '开启', value: 1 }, { name: '关闭', value: 2 }],
  withdrawTypeMap: [{ name: '全部', value: '' }, { name: '自动提现', value: '1' }, { name: '手动提现', value: '2' }], // 提现类型
  xcpayStatusMap: [{ name: '已签约', value: 0 }, { name: '未签约', value: 1 }] // 是否签约厦行
};

export default config;
