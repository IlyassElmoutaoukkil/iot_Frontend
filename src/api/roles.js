import request from '@/utils/request'

export function getPlans(data) {
  return request({
    url: '/user/login',
    method: 'get',
    data
  })
}

export function getPlan(token) {
  return request({
    url: '/user/create',
    method: 'get',
    params: { token }
  })
}

export function createPlan() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function deletePlan() {
  return request({
    url: '/user/logout',
    method: 'delete'
  })
}

export function editPlan() {
  return request({
    url: '/user/logout',
    method: 'update'
  })
}



