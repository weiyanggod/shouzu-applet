<template>
  <uni-popup ref="popup" :animation="false" :isMaskClick="1 === 0" :maskClick="1 === 0" :safe-area="false">
    <view class="popup-content">
      <view class="popup-content-main">
        <view class="picker__toolbar justify-between">
          <view class="picker__cancel" @click="cancel">取消</view>
          <view class="picker__confirm" @click="onConfirm">确认</view>
        </view>
        <view class="picker__content">
          <input
            class="uni-input bottom-line keyword-input"
            v-if="isSearch"
            v-model="searchVal"
            placeholder="输入关键字搜索"
            cursor-spacing="300"
            @input="search"
          />
          <view class="check__all" v-if="multiple">
            <view class="check__all_left">全选</view>
            <view class="check__all__right">
              <checkbox
                v-model="checkedAll"
                name="all"
                @click="toggleAll"
                :checked="checkedAll"
                style="transform: scale(0.8)"
              />
            </view>
          </view>

          <view class="uni-list" v-if="multiple">
            <checkbox-group @change="checkboxChange" v-if="columnsData.length > 0">
              <label
                class="uni-list-cell uni-list-cell-pd justify-between"
                v-for="(item, index) in columnsData"
                :key="index"
              >
                <view class="cell-label" style="color: #cfcfcf; font-size: 16px">
                  <view style="color: #000">合同编号：{{ item[option.value] }}</view>
                  {{ item[option.label] }}</view
                >
                <view>
                  <checkbox
                    :value="item[option.value]"
                    :checked="checkboxValue.includes(item[option.value])"
                    style="transform: scale(0.8)"
                  />
                </view>
              </label>
            </checkbox-group>
            <view v-else>
              <view class="no__data">{{ noData }}</view>
            </view>
          </view>
          <view class="uni-list" v-else>
            <radio-group @change="checkboxChange" v-if="columnsData.length > 0">
              <label
                class="uni-list-cell uni-list-cell-pd justify-between"
                v-for="item in columnsData"
                :key="item[option.value]"
              >
                <view class="cell-label">{{ item[option.label] }}</view>
                <view>
                  <radio
                    :value="item[option.value]"
                    :checked="selectValue.includes(item[option.value])"
                    style="transform: scale(0.8)"
                  />
                </view>
              </label>
            </radio-group>
            <view v-else>
              <view class="no__data">{{ noData }}</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </uni-popup>
</template>

<script>
export default {
  name: 'NiceuiPopupSelect',
  props: {
    // maskClick
    isMaskClick: {
      type: Boolean,
      default: null
    },
    // TODO 2 个版本后废弃属性 ，使用 isMaskClick
    maskClick: {
      type: Boolean,
      default: null
    },
    columns: {
      type: Array,
      default: function () {
        return []
      }
    },
    selectValue: {
      type: Array,
      default: function () {
        return []
      }
    },
    option: {
      type: Object,
      default: function () {
        return { label: 'label', value: 'value' }
      }
    },
    // 是否支持搜索
    isSearch: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    resultLabel: {
      get() {
        if (this.columns?.length > 0) {
          const res = this.columns.filter(item => {
            return this.resultValue.indexOf(item[this.option.value]) > -1
          })
          const resLabel = res.map(item => {
            return item[this.option.label]
          })
          return resLabel.join(',')
        }
      },
      set() {}
    }
  },
  data() {
    return {
      show: false,
      searchVal: '',
      columnsData: [],
      checkboxValue: JSON.parse(JSON.stringify(this.selectValue)),
      checkedAll: false,
      resultValue: JSON.parse(JSON.stringify(this.selectValue)),
      noData: '没有更多内容了'
    }
  },
  methods: {
    // 搜索
    search(val) {
      // #ifdef MP-WEIXIN
      // #endif
      val = val.detail.value //小程序取值

      if (val) {
        this.columnsData = this.columnsData.filter(item => {
          return item[this.option.label].indexOf(val) > -1 || item[this.option.value].indexOf(val) > -1
        })
      } else {
        this.columnsData = JSON.parse(JSON.stringify(this.columns))
      }
    },
    getData(val) {
      const res = this.columnsData?.filter(item => {
        return val.indexOf(item[this.option.value]) > -1
      })
      return res
    },
    onConfirm() {
      this.resultValue = this.checkboxValue
      this.show = !this.show
      this.$emit('confirm', this.resultValue, this.getData(this.resultValue))
      this.closePopup()
      setTimeout(() => {
        this.columnsData = []
      }, 500)
    },
    checkboxChange(val) {
      this.checkboxValue = val.detail.value
      //this.$emit('change', val, this.getData(this.resultValue))
    },
    cancel() {
      this.show = !this.show
      this.$emit('cancel', this.resultValue)
      setTimeout(() => {
        this.columnsData = []
      }, 500)
      this.closePopup()
    },
    toggle(index) {
      //this.$refs.checkboxes[index].toggle()
      this.checkboxValue.push(index)
    },
    toggleAll(all) {
      //this.$refs.checkboxGroup.toggleAll(this.checkedAll)
      if (this.checkedAll) {
        this.checkboxValue = []
      } else {
        this.columnsData.forEach((col, index) => {
          if (!this.checkboxValue.includes(col[this.option.value])) {
            //避免重复添加
            this.checkboxValue.push(col[this.option.value])
          }
        })
      }
    },
    showPopup(disabled) {
      this.columnsData = []
      this.columnsData = JSON.parse(JSON.stringify(this.columns))
      this.checkboxValue = JSON.parse(JSON.stringify(this.selectValue))
      this.resultValue = JSON.parse(JSON.stringify(this.selectValue))
      if (disabled !== undefined && disabled !== false) {
        return false
      } else {
        this.$refs.popup.open('bottom')
      }
    },
    closePopup() {
      this.$refs.popup.close()
    }
  },
  watch: {
    selectValue: function (newVal) {
      this.resultValue = newVal
    },
    resultValue(val) {
      this.searchVal = ''
      //this.columnsData = JSON.parse(JSON.stringify(this.columns))
      //this.$emit('input', val)
    },
    columnsData: {
      handler(val) {
        if (val?.length && val?.length === this.checkboxValue.length) {
          this.checkedAll = true
        } else {
          this.checkedAll = false
        }
      },
      immediate: true
    },
    checkboxValue: {
      handler(val) {
        if (val.length && val.length === this.columnsData.length) {
          this.checkedAll = true
        } else {
          this.checkedAll = false
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss" scoped>
//结果弹窗
::v-deep .close-view {
  height: 130rpx;
  image {
    width: 100rpx;
    height: 100rpx;
  }
}
::v-deep .popup-content {
  border-top-left-radius: 20rpx;
  border-top-right-radius: 20rpx;
  background-color: #fff;
  padding: 1rpx;
  width: 100vw;
  // height: 70vh;
  // overflow-y: scroll;
  .popup-content-main {
    margin: 50rpx auto 30rpx;

    .picker__toolbar {
      box-sizing: border-box;
      margin: 20rpx 32rpx;
      font-size: 32rpx;
      display: flex;
      align-items: center;
      .picker__cancel {
        color: #969799;
      }
      .picker__confirm {
        color: #576b95;
      }
      .picker__title {
        font-size: 38rpx;
        color: #6f6f6f;
      }
    }

    .picker__content {
      max-height: 500rpx;
      overflow-y: auto;

      .keyword-input {
        font-size: 35rpx;
      }
      .check__all {
        box-sizing: border-box;
        margin: 20rpx 32rpx;
        padding: 20rpx 0rpx;
        border-bottom: solid 1rpx #f7f7f7;
        display: flex;
        justify-content: space-between;
        .check__all_left {
          color: #666;
          font-size: 32rpx;
        }
        .check__all_right {
        }
      }

      .uni-list {
        box-sizing: border-box;
        margin: 20rpx 32rpx;
        label {
          padding: 20rpx 0rpx;
          border-bottom: solid 1rpx #f7f7f7;
        }
        .uni-list-cell {
          .cell-label {
            font-size: 35rpx;
          }
          checkbox {
            //transform:scale(0.8,0.8)
          }
        }
        .no__data {
          color: #999;
          font-size: 30rpx;
          text-align: center;
          margin-top: 50rpx;
        }
      }
    }
  }
}

.bottom-line {
  border-bottom: solid 3rpx #eee;
  margin: 20rpx 32rpx;
  height: 72rpx;
}
.justify-between {
  display: flex;
  justify-content: space-between;
}
</style>
