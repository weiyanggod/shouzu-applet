<template>
  <view>
    <Navigation title="选择支付方式"></Navigation>
    <view class="box">
      <view style="width: 50%" class="flex-ac-sb">
        <view style="font-size: 20px; font-width: 600">待支付：</view>
        <view style="font-size: 20px; color: #ff3300">￥6000.00</view>
      </view>
      <view class="mt-20" style="width: 100%">
        <u-cell-group>
          <!-- <u-cell icon="/static/微信支付.png" title="微信支付">
            <u-radio-group slot="right-icon" v-model="payMode" placement="column">
              <u-radio label="微信支付" name="微信支付"> </u-radio>
            </u-radio-group>
          </u-cell> -->
          <u-cell icon="/static/农行支付.png" title="农行支付">
            <u-radio-group slot="right-icon" v-model="payMode" placement="column">
              <u-radio label="农行支付" name="农行支付"> </u-radio>
            </u-radio-group>
          </u-cell>
        </u-cell-group>
      </view>
    </view>
    <u-button color="#618add" shape="circle" text="立即支付" @click="toPay('info')"></u-button>
  </view>
</template>

<script>
import Navigation from '@/components/navigation'
export default {
  components: { Navigation },
  data() {
    return {
      payMode: '微信支付',
      msgType: 'info'
    }
  },
  computed: {},
  methods: {
    toPay() {
      uni.navigateTo({ url: 'pages/web/web' })
    },
    dialogConfirm() {}
  },
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad() {},
  // 页面周期函数--监听页面初次渲染完成
  onReady() {},
  // 页面周期函数--监听页面显示(not-nvue)
  onShow() {},
  // 页面周期函数--监听页面隐藏
  onHide() {},
  // 页面周期函数--监听页面卸载
  onUnload() {}
  // 页面处理函数--监听用户下拉动作
  // onPullDownRefresh() { uni.stopPullDownRefresh(); },
  // 页面处理函数--监听用户上拉触底
  // onReachBottom() {},
  // 页面处理函数--监听页面滚动(not-nvue)
  // onPageScroll(event) {},
  // 页面处理函数--用户点击右上角分享
  // onShareAppMessage(options) {},
}
</script>

<style lang="scss" scoped>
.box {
  width: 100%;
  padding: 40px 10px 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  flex-direction: column;
}
.bottom {
  box-sizing: border-box;
  width: 100%;
  padding: 100px 40px 0px;
}
</style>
