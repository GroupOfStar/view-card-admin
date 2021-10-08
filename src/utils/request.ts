import axios from 'axios'
import router from '@/router'
import { message } from 'ant-design-vue'

export const baseURL = import.meta.env.VITE_BASE_URL as string

// 创建 axios 实例
const request = axios.create({
  // API 请求的默认前缀
  baseURL,
  timeout: 60000, // 请求超时时间
})

// 异常拦截处理器
const errorHandler = (error: { response: { data: any; status: number } }) => {
  if (error.response) {
    const { data, status } = error.response
    if (status === 403) {
      message.error({
        content: 'Forbidden',
        key: status,
      })
    }
    if (status === 401 && !(data.result && data.result.isLogin)) {
      message.error({
        content: 'Authorization verification failed',
        key: status,
      })
    }
  }
  return Promise.reject(error)
}

// request interceptor
request.interceptors.request.use(config => {
  // 从 localstorage 获取 token
  const token = localStorage.getItem('ACCESS_TOKEN')
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
}, errorHandler)

// response interceptor
request.interceptors.response.use(response => {
  const { status, statusText } = response.data
  if (status === 2001) {
    router.push('/login')
    message.warning({
      content: statusText,
      key: status,
    })
  }
  return response
}, errorHandler)

export default request
