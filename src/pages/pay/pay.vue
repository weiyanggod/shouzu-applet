<template>
  <view class="page">
    <Navigation title="立即缴费"></Navigation>
    <u-cell-group>
      <u-cell isLink title="搜索项目" @click="$refs.popup.showPopup()"></u-cell>
    </u-cell-group>
    <niceui-popup-select
      isSearch
      ref="popup"
      :columns="selectList"
      :is-search="false"
      :option="{ label: 'address', value: 'code' }"
      @confirm="confirmFruit"
    ></niceui-popup-select>
    <view class="text">搜索结果</view>
    <view class="ml-15">
      <u-checkbox-group v-model="checkboxValue" placement="column" @change="change">
        <view class="box" v-for="(item, index) in detailsList" :key="index">
          <u-checkbox :name="index"> </u-checkbox>
          <view class="right-text">
            <view style="font-size: 14px; color: #000">{{ item.payTypeName }}</view>
            <view>合同编号：{{ item.code }}</view>
            <view>缴费周期：{{ item.startDate ? item.startDate : '' }}-{{ item.endDate ? item.endDate : '' }}</view>
            <view style="display: flex; align-items: center">
              <view
                >缴费金额：<text :style="{ color: item.isOverdue ? '#f26161' : '' }">
                  {{ item.payableMoney }}元</text
                ></view
              >
              <view class="ml-5">
                <u-tag
                  v-if="item.noticeType !== '逾期缴费通知'"
                  text=""
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
      </u-checkbox-group>
    </view>
    <view class="bottom">
      <view class="flex-ac-sb" style="width: 35%">
        <view>合计：</view>
        <view style="color: #3b7bff">{{ totalNumber }}</view>
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
  </view>
</template>

<script>
import Navigation from '@/components/navigation'
import niceuiPopupSelect from '@/components/niceui-popup-select'
import { listApi, detailListApi, payApi } from '@/api/index.js'
export default {
  components: { Navigation, niceuiPopupSelect },
  data() {
    return {
      inputValue: '',
      // 展示列表
      detailsList: [],
      checkboxValue: [],
      // 搜索列表
      selectList: [],
      selectValue: [],
      totalNumber: 0
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
    // 确认支付
    toPayMode() {
      let is = true
      const data = []
      this.detailsList.forEach((item, index) => {
        if (!this.checkboxValue.includes(index) && item.noticeType === '逾期缴费通知') {
          uni.showModal({
            title: '提示!',
            content: '请先缴纳逾期款!',
            showCancel: false,
            confirmText: '确定'
          })
          is = false
          throw new Error()
        }
      })
      if (is) {
        this.checkboxValue.forEach(item => {
          data.push({
            accountsCode: this.detailsList[item].accountsCode,
            code: this.detailsList[item].code,
            endDate: this.detailsList[item].endDate,
            money: this.detailsList[item].payableMoney,
            payDate: this.detailsList[item].payDate,
            payType: this.detailsList[item].payType,
            startDate: this.detailsList[item].startDate,
            registerDate: new Date(),
            tollCompany: this.detailsList[item].tollCompany
          })
        })
        payApi(data).then(res => {
          if (res.state === 0) {
            uni.showModal({
              title: '提示!',
              content: '缴费成功',
              showCancel: false,
              confirmText: '确定'
            })
          } else {
            uni.showModal({
              title: '提示!',
              content: res.message,
              showCancel: false,
              confirmText: '确定'
            })
          }
        })
      }
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
  },
  watch: {}
}
</script>

<style lang="scss" scoped>
.page {
  margin-top: 100px;
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
.box {
  box-sizing: border-box;
  margin-left: 50%;
  margin-top: 10px;
  transform: translate(-50%);
  padding: 10px;
  width: 360px;
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
  bottom: 3%;
  width: 100%;
  padding: 0px 20px;
  display: flex;
  align-content: center;
  justify-content: space-between;
  box-sizing: border-box;
}
</style>
