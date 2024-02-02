<template>
  <view class="page">
    <Navigation title="绑定"></Navigation>
    <view style="padding: 20px">
      <u-form ref="uForm" labelPosition="top" label-width="auto" :model="form" :rules="rules">
        <u-form-item label="手机号" prop="phone" borderBottom>
          <u-input v-model="form.phone" placeholder="请输入手机号" border="none"></u-input>
        </u-form-item>
        <u-form-item label="合同编号" prop="number" borderBottom>
          <u-input v-model="form.number" placeholder="请输入合同编号" border="none"></u-input>
        </u-form-item>
      </u-form>
      <view class="mt-40">
        <u-button color="#3d7dff" type="primary" shape="circle" text="立即绑定" @click="binding"></u-button>
      </view>
    </view>
  </view>
</template>

<script>
import Navigation from '@/components/navigation'
import { bindApi } from '@/api/index.js'
export default {
  components: { Navigation },
  data() {
    return {
      form: {
        phone: '',
        number: ''
      },
      rules: {
        phone: {
          type: 'string',
          required: true,
          message: '请填写手机号',
          trigger: ['blur', 'change']
        },
        number: {
          type: 'string',
          required: true,
          message: '请填写合同编号',
          trigger: ['blur', 'change']
        }
      }
    }
  },
  computed: {},
  methods: {
    async binding() {
      const app = getApp()
      const res = await app.login()
      uni.setStorageSync('token', res.data.token)
      this.$refs.uForm.validate().then(res => {
        const data = {
          code: this.form.number,
          phone: this.form.phone
        }
        bindApi(data).then(res => {
          if (res.state !== 0) {
            this.showModal(res.message)
          } else {
            this.showModal('绑定成功')
          }
        })
      })
    },
    showModal(text) {
      uni.showModal({
        title: '提示!',
        content: text,
        showCancel: false,
        confirmText: '确定'
      })
    }
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
.page {
  margin-top: 90px;
}
</style>
