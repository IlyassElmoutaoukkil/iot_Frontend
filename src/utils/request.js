import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

var alert = true
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    if (config.url.includes("?noalert")) {
      alert = false
      config.url = config.url.replace('?noalert', '');
    }
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = 'Bearer ' + getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    var res = response.data
    // res.data.roles = response.roles
    // console.log(response, 'Response')
    // if the custom code is not 20000, it is judged as an error.
    if (response.status !== 200) {
      if (alert) {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
      }

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return res
    } else {
      return res
    }
  },
  error => {
    var time = 1000
    var t = 0
    if (error.response.status === 400 && alert) {
      error.response.data.errors.forEach(error => {
        setTimeout(()=>{
          Message({
            message: error.message,
            type: 'error',
            duration: 2 * time
          })
        }, t)
        t = t + 1000
        time = time + 2000
      })
    }

    if (error.response.status === 403 && alert) {
      error.response.data.errors.forEach(error => {
        setTimeout(()=>{
          Message({
            message: error.message,
            type: 'warning',
            duration: 2 * time
          })
        }, t)
        t = t + 1000
        time = time + 2000
      })
    }

    return error.response
  }
)

export default service
