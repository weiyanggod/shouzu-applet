<script>
import { getTokenApi } from '@/api'
export default {
  // 全局变量
  globalData: {
    code: ''
  },
  // 初始化完成
  onLaunch: function () {},
  methods: {
    getCode() {
      return new Promise((resolve, reject) => {
        uni.login({
          success: res => {
            if (res.code) {
              this.globalData.code = res.code
              resolve(res.code)
            } else {
              reject(res)
            }
          }
        })
      })
    },
    getOpenId(code) {
      return new Promise(async (resolve, reject) => {
        const res = await getTokenApi({ code })
        resolve(res)
      })
    },
    async login() {
      const code = await this.getCode()
      const res = await this.getOpenId(code)
      return res
    }
  }
}
</script>

<style lang="scss">
@import 'uview-ui/index.scss';
@import '/global.css';
page {
  width: 100%;
  height: 100%;
}
</style>
