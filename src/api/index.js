import { request } from '@/utils/request.js'
// 获取token
export const getTokenApi = data => {
  return request({
    url: `/api/openid`,
    method: 'GET',
    data
  })
}

// 绑定合同接口
export const bindApi = data => {
  return request({
    url: `/api/bind`,
    method: 'GET',
    data
  })
}
// 登录
export const loginApi = data => {
  return request({
    url: `/api/login`,
    method: 'GET',
    data
  })
}

// 获取合同列表
export const listApi = () => {
  return request({
    url: `/api/contract/list`,
    method: 'GET'
  })
}

// 获取合同详情列表
export const detailListApi = data => {
  return request({
    url: `/api/payable/info`,
    method: 'GET',
    data
  })
}

// 缴费
export const payApi = data => {
  return request({
    url: `/api/pay`,
    method: 'post',
    data
  })
}
