import request from '@/utils/request'

export function fetchIndex() {
  return request({
    url: 'client/mqtt/',
    method: 'get'
  })
}

export function fetchDevice(id) {
  return request({
    url: 'client/mqtt/device/' + id,
    method: 'get'
  })
}

export function getDeviceConnectionStatus(id) {
  return request({
    url: 'client/mqtt/device/status/connection/' + id + '?noalert',
    method: 'get',
    show_message: false
  })
}

export function storeDevice(data) {
  return request({
    url: 'client/mqtt/device/store',
    method: 'post',
    data: data
  })
}

export function updateDevice(data, id) {
  return request({
    url: 'client/mqtt/device/update' + id,
    method: 'put',
    data: data
  })
}

export function destroyDevice(id) {
  return request({
    url: 'client/mqtt/device/delete/' + id,
    method: 'delete'
  })
}

export function fetchNetworks() {
  return request({
    url: 'client/mqtt/networks/',
    method: 'get'
  })
}

export function fetchNetwork(id) {
  return request({
    url: 'client/mqtt/network/' + id,
    method: 'get'
  })
}

export function storeNetwork(data) {
  return request({
    url: 'client/mqtt/network/store',
    method: 'post',
    data: data
  })
}

export function updateNetwork(data, id) {
  return request({
    url: 'client/mqtt/network/update/' + id,
    method: 'put',
    data: data
  })
}

export function destroyNetwork(id) {
  return request({
    url: 'client/mqtt/network/delete/' + id,
    method: 'delete'
  })
}

export function updateDeviceTopic(data, id) {
  return request({
    url: 'client/mqtt/network/update/' + id,
    method: 'update',
    data: data
  })
}
