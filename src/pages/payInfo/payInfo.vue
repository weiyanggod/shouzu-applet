<template>
  <view class="page">
    <Navigation title="缴费通知"></Navigation>
    <view class="car" v-for="(item, index) in list" :key="index">
      <u-cell-group style="width: 80%">
        <u-cell title="消息日期" :value="item.messageDate || ''"></u-cell>
        <u-cell title="通知类型" :value="item.noticeType || ''"></u-cell>
        <u-cell title="缴费区间" :value="(item.startDate || '') + ' - ' + (item.endDate || '')"></u-cell>
        <u-cell title="费用类型" :value="item.payTypeName || ''"></u-cell>
        <u-cell title="合同编号" :value="item.code || ''"></u-cell>
        <u-cell title="租赁位置">
          <template v-slot:value>
            <div style="width: 60%; text-align: right">{{ item.address || '' }}</div></template
          >
        </u-cell>
        <u-cell title="到期日期" :value="item.endDate || ''"></u-cell>
        <u-cell title="应缴金额" :value="item.payableMoney || ''"></u-cell>
      </u-cell-group>
      <view class="mt-10" style="width: 80px; margin-left: auto">
        <u-button @click="submit(item)" type="primary" shape="circle" size="small">立即缴费</u-button>
      </view>
    </view>
  </view>
</template>

<script>
import dayjs from 'dayjs'
import Navigation from '@/components/navigation'
import { detailListApi, payApi } from '@/api/index.js'
export default {
  components: { Navigation },
  data() {
    return {
      // 列表数据
      list: []
    }
  },
  methods: {
    submit(item) {
      const data = {
        accountsCode: item.accountsCode,
        code: item.code,
        endDate: item.endDate,
        money: item.payableMoney,
        payDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        payType: item.payType,
        startDate: item.startDate,
        registerDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        tollCompany: item.tollCompany,
        id: item.id,
        formsonId: item.formsonId,
        unPayableMoney: item.unPayableMoney
      }
      payApi([data]).then(res => {
        if (res.state === 0) {
          this.getList()
          uni.navigateTo({ url: `/pages/pay/components/success?money=${data.money}` })
        } else {
          uni.showModal({
            title: '提示!',
            content: res.message,
            showCancel: false,
            confirmText: '确定'
          })
        }
      })
    },
    // 获取列表数据
    getList() {
      detailListApi({ isTotal: 1 }).then(res => {
        this.list = res.data
      })
    }
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {
    this.getList()
  },
  // 页面周期函数--监听页面初次渲染完成
  onReady() {},
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() {}
}
</script>

<style lang="scss" scoped>
.page {
  padding-bottom: 20px;
  margin-top: 130px;
}
.car {
  display: flex;
  flex-direction: column;
  width: 85%;
  margin-left: 50%;
  margin-top: 30px;
  transform: translate(-50%);
  background-color: #fff;
  box-shadow: 0px 0px 50px rgba(94, 93, 93, 0.4);
  border-radius: 27px;
  padding: 0px 10px 10px 26px;
}
.button {
  width: 265px;
  border-radius: 23px;
  background-color: #587edd;
  color: #fff;
}

::v-deep .u-form {
  height: 100% !important;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
</style>
