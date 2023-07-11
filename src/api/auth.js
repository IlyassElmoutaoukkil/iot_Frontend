import request from '@/utils/request'

export function signin(data) {
  return request({
    url: '/auth/signin',
    method: 'post',
    data
  })
}

export function getInfo(data) {
  return request({
    url: '/auth/user-details/',
    method: 'get',
    data
  })
}

export function signup(email) {
  return request({
    url: '/auth/signup',
    method: 'post',
    params: { email }
  })
}

export function emailConfirm(email) {
  return request({
    url: '/auth/signin',
    method: 'post',
    params: { data }
  })
}