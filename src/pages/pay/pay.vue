<!-- 立即缴费页面 -->
<template>
  <view class="page">
    <Navigation title="立即缴费"></Navigation>
    <u-cell-group>
      <u-cell isLink title="请选择待缴费合同" @click="$refs.popup.showPopup()"></u-cell>
    </u-cell-group>
    <niceui-popup-select
      isSearch
      ref="popup"
      :columns="selectList"
      :option="{ label: 'address', value: 'code' }"
      @confirm="confirmFruit"
    ></niceui-popup-select>
    <view class="text">搜索结果</view>
    <u-checkbox-group v-model="checkboxValue" placement="column" @change="change" class="list">
      <view class="list">
        <view class="box" v-for="(item, index) in detailsList" :key="index">
          <u-checkbox :name="index"> </u-checkbox>
          <view class="right-text">
            <view style="font-size: 14px; color: #000">{{ item.payTypeName }}</view>
            <view>合同编号：{{ item.code }}</view>
            <view>缴费周期：{{ item.startDate ? item.startDate : '' }}-{{ item.endDate ? item.endDate : '' }}</view>
            <view style="display: flex; align-items: center">
              <view>缴费金额：</view>
              <u-text
                :color="!item.noticeType === '正常缴费通知' ? '#f26161' : ''"
                mode="price"
                :text="item.payableMoney"
              >
              </u-text>
              <view class="ml-5">
                <u-tag
                  v-if="item.noticeType === '正常缴费通知'"
                  text="正常"
                  type="success"
                  size="mini"
                  plain
                  plainFill
                ></u-tag>
                <u-tag v-else text="逾期" type="error" size="mini" plain plainFill></u-tag>
              </view>
            </view>
          </view>
        </view>
      </view>
    </u-checkbox-group>
    <view class="bottom">
      <view class="flex-ac-sb" style="min-width: 35%">
        <view>合计：</view>
        <u-text color="#3b7bff" size="16" mode="price" :text="totalNumber"> </u-text>
      </view>
      <view style="width: 100px">
        <u-button
          color="#587edd"
          type="primary"
          size="small"
          shape="circle"
          text="确认支付"
          @click="toPayMode"
        ></u-button>
      </view>
    </view>
    <u-empty v-if="detailsList.length === 0" mode="search" icon="http://cdn.uviewui.com/uview/empty/search.png">
    </u-empty>
  </view>
</template>

<script>
import dayjs from 'dayjs'
import Navigation from '@/components/navigation'
import niceuiPopupSelect from '@/components/niceui-popup-select'
import { listApi, detailListApi, payApi } from '@/api/index.js'
export default {
  components: { Navigation, niceuiPopupSelect },
  data() {
    return {
      // 输入框值
      inputValue: '',
      // 展示列表
      detailsList: [],
      // 选择的数据
      checkboxValue: [],
      // 搜索列表`
      selectList: [],
      // 总金额
      totalNumber: 0,
      // 当前选择的项目编号列表
      code: []
    }
  },
  computed: {},
  created() {
    listApi({
      match: this.inputValue
    }).then(res => {
      this.selectList = res.data
    })
  },
  methods: {
    // 确认支付按钮
    toPayMode() {
      // 判断是否同一个主体
      const { lessorAccount, tollCompany } = this.detailsList[this.checkboxValue[0]]
      const isSubject = this.checkboxValue.every(
        item =>
          this.detailsList[item].lessorAccount === lessorAccount && this.detailsList[item].tollCompany === tollCompany
      )
      if (!isSubject) {
        return uni.showModal({
          title: '提示!',
          content: '多个主体请分开缴费',
          showCancel: false,
          confirmText: '确定'
        })
      }
      // 判断是否开通银行账户
      const isAccountOpen = this.checkboxValue.every(item => this.detailsList[item].accountOpen === '开通')
      if (!isAccountOpen) {
        return uni.showModal({
          title: '提示!',
          content: '当前出租方未开通小程序支付功能 请线下缴费',
          showCancel: false,
          confirmText: '确定'
        })
      }
      // 是否有逾期的没勾选
      const list = this.detailsList.filter(
        (item, index) =>
          !this.checkboxValue.includes(index) && item.noticeType === '逾期缴费通知' && item.accountOpen === '开通'
      )
      if (list.length > 0) {
        return uni.showModal({
          title: '提示!',
          content: '请先缴纳逾期费用',
          showCancel: false,
          confirmText: '确定'
        })
      }
      return uni.showModal({
        title: '提示!',
        content: '成功',
        showCancel: false,
        confirmText: '确定'
      })
      const data = []
      this.checkboxValue.forEach(item => {
        data.push({
          accountsCode: this.detailsList[item].accountsCode,
          code: this.detailsList[item].code,
          endDate: this.detailsList[item].endDate,
          money: this.detailsList[item].payableMoney,
          payDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          payType: this.detailsList[item].payType,
          startDate: this.detailsList[item].startDate,
          registerDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          tollCompany: this.detailsList[item].tollCompany,
          id: this.detailsList[item].id,
          formsonId: this.detailsList[item].formsonId,
          unPayableMoney: this.detailsList[item].unPayableMoney,
          lessorCode: this.detailsList[item].lessorCode,
          lessorAccount: this.detailsList[item].lessorAccount,
          accountOpen: this.detailsList[item].accountOpen
        })
      })

      payApi(data).then(res => {
        if (res.state === 0) {
          // uni.navigateTo({ url: '/pages/pay/components/payMode' })
          // 清空选择
          this.checkboxValue = []
          detailListApi({
            code: this.code
          }).then(res => {
            this.detailsList = res.data
          })
          uni.navigateTo({ url: `/pages/pay/components/success?money=${this.totalNumber}` })
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
    // 弹框确认
    confirmFruit(data) {
      let code = ''
      data.forEach((item, index) => {
        if (index === data.length - 1) {
          code += item
        } else {
          code += item + ','
        }
      })
      this.code = code
      detailListApi({
        code
      }).then(res => {
        this.detailsList = res.data
      })
    },
    // 勾选
    change(value) {
      this.totalNumber = 0
      this.detailsList.forEach((item, index) => {
        if (value.includes(index)) {
          this.totalNumber += parseFloat(item.payableMoney)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.page {
  padding-top: 100px;
  padding-bottom: 80px;
}
.search {
  margin-top: 20px;
  padding: 0 20px;
  position: relative;
}

.downList {
  position: absolute;
  display: flex;
  width: 70%;
  background-color: #fff;
  border: 1px solid #e8e8e8;
  margin-left: 40%;
  margin-top: 5px;
  transform: translate(-50%);
  padding: 10px;
  z-index: 10;
}
.text {
  margin-left: 20px;
  font-weight: 900;
  margin: 20px 0px 20px 20px;
  color: #333333;
  font-size: 14px;
}
.list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
.box {
  box-sizing: border-box;
  margin-top: 10px;
  width: 95%;
  padding: 10px;
  height: 106px;
  box-shadow: 0px 0px 5px rgba(94, 93, 93, 0.4);
  border-radius: 15px;
  display: flex;
  align-items: center;

  .right-text {
    font-size: 12px;
    display: flex;
    flex-direction: column;
    margin-left: 15px;
    height: 100%;
    justify-content: space-around;
    color: #999999;
  }
}

.bottom {
  position: fixed;
  bottom: 0%;
  width: 100%;
  height: 60px;
  padding: 0px 20px;
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: space-between;
  box-sizing: border-box;
  background-color: #fff;
}
</style>
