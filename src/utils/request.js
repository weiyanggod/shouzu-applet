const url_all = {
  DEV: 'https://meiligj.jxufida.com:8821/applet' // 开发
}
let BASEURL = url_all['DEV']
export const request = (options = {}) => {
  return new Promise((resolve, rejects) => {
    handleRequest(options, resolve, rejects)
  })
}
function handleRequest(options, resolve, reject) {
  uni.request({
    url: BASEURL + options.url,
    method: options.method,
    data: options.data,
    header: {
      Authorization: uni.getStorageSync('token') || ''
    },
    success: response => {
      return resolve(response.data)
    },
    fail: fail => {
      console.log('fail', fail)
      return reject(fail)
    }
  })
}
