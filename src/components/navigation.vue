<template>
  <view class="navigation">
    <view class="arrow" v-if="arrow" @click="back">
      <u-icon name="arrow-left" size="20" color="#000"></u-icon>
    </view>
    <view class="title">
      {{ title }}
    </view>
  </view>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '首页'
    },
    arrow: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    back() {
      uni.navigateBack({ delta: 1 })
    }
  }
}
</script>

<style lang="scss" scoped>
.navigation {
  position: fixed;
  top: 0%;
  left: 0%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('/static/背景.png');
  text-align: center;
  width: 100%;
  height: 88px;
  color: #fff;
  z-index: 10;
  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 50%;
    position: absolute;
    top: 70%;
    left: 0%;
  }
  .title {
    position: absolute;
    bottom: 10%;
    color: #000;
  }
  .arrow {
    position: absolute;
    top: 67%;
    left: 5%;
  }
}
</style>
