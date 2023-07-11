import request from '@/utils/request'

export function createUser(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/client/profile/update',
    method: 'post',
    data
  })
}

export function getUsers(token) {
  return request({
    url: '/user/create',
    method: 'get',
    params: { token }
  })
}

export function assignRole(token) {
  return request({
    url: '/user/create',
    method: 'get',
    params: { token }
  })
}

export function assignPlan(token) {
  return request({
    url: '/user/create',
    method: 'get',
    params: { token }
  })
}
