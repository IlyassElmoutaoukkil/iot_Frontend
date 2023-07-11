import request from '@/utils/request'

export function fetchIndex() {
  return request({
    url: '/client/index',
    method: 'get'
  })
}

export function updateProfile(data) {
  return request({
    url: '/client/profile/update',
    method: 'post',
    data
  })
}

export function updatePassword(data) {
  return request({
    url: '/client/profile/security',
    method: 'post',
    data
  })
}

export function confirmeEmail(data) {
  return request({
    url: '/client/confirme/email',
    method: 'post',
    data
  })
}

export function resendEmail(data) {
  return request({
    url: '/client/confirme/email/resend',
    method: 'get'
  })
}

export function confirmePhone(data) {
  return request({
    url: '/client/confirme/phone',
    method: 'post',
    data
  })
}

export function resendSMS(data) {
  return request({
    url: '/client/confirme/phone/resend',
    method: 'get'
  })
}

