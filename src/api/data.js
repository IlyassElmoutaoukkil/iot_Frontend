import request from '@/utils/request'

export function retrieveTodayTopicData(id, api_key) {
  return request({
    url: `http://127.0.0.1:4999/channels/${id}/feeds.json?api_key=${api_key}&results=10`,
    method: 'get'
  })
}

export function retrieveLastHoursTopicData(id, api_key) {
  return request({
    url: 'client/topic/index',
    method: 'get'
  })
}

export function retrieveTimeRangeTopicData(id, api_key) {
  return request({
    url: 'client/topic/index',
    method: 'get'
  })
}
