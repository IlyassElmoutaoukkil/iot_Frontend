import request from '@/utils/request'

export function fetchTopics() {
  return request({
    url: 'client/topic/',
    method: 'get'
  })
}

export function fetchIndex() {
  return request({
    url: 'client/topic/index',
    method: 'get'
  })
}

export function fetchTopic(id) {
  return request({
    url: 'client/topic/show/' + id,
    method: 'get'
  })
}

export function createTopics(data) {
  return request({
    url: '/client/topic/create',
    method: 'post',
    data: data
  })
}

export function addTopic(data) {
  return request({
    url: '/client/index',
    method: 'post',
    data
  })
}

export function updateTopicSettings(data) {
  return request({
    url: '/client/topic/update/settings',
    method: 'post',
    data
  })
}

export function updateTopicSecurity(data) {
  return request({
    url: '/client/topic/update/security?id=' + data,
    method: 'get'
  })
}

export function destroyTopic(id, password) {
  return request({
    url: '/client/topic/delete?id=' + id,
    method: 'post',
    data: { password: password }
  })
}

export function topicUpdateSecrets(data) {
  return request({
    url: '/client/index',
    method: 'post',
    data
  })
}

export function addFields(data) {
  return request({
    url: '/client/index',
    method: 'post',
    data
  })
}

export function updateFields(data) {
  return request({
    url: '/client/index',
    method: 'post',
    data
  })
}
