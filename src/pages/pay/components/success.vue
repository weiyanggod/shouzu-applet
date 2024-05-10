<template>
  <view style="padding-top: 100px">
    <Navigation title="缴费成功"></Navigation>
    <!-- <view style="margin-top: 100px"></view> -->
    <u-empty textColor="#4137bc" textSize="20" text="缴费成功!" icon="/static/success.png"> </u-empty>
    <view class="text">
      <view class="mt-10">付款金额：¥ {{ money }}</view>
      <view class="mt-10">单号：DH000001</view>
      <view class="mt-10">发票请联系梅里集团业务人员进行办理</view>
    </view>
  </view>
</template>

<script>
import Navigation from '@/components/navigation'
export default {
  components: { Navigation },
  data() {
    return {
      money: 0
    }
  },
  computed: {},
  methods: {},
  watch: {},

  // 页面周期函数--监听页面加载
  onLoad(params) {
    this.money = params.money
    console.log(params)
  },
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
.text {
  width: 100%;
  padding-left: 10%;
  font-size: 12px;
  margin-top: 30px;
}
</style>
