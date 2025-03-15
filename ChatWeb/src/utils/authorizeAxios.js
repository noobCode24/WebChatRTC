import axios from 'axios'
import { handleLogoutAPI, handleRefreshTokenAPI } from '../apis/apis'

let authorizedAxiosInstance = axios.create()

authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

authorizedAxiosInstance.defaults.withCredentials = true

authorizedAxiosInstance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

authorizedAxiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.message?.status === 401) {
      handleLogoutAPI().then(() => {
        localStorage.removeItem('user')
        location.href = '/'
      })
    }

    const originalRequest = error.config
    if (error.response?.status === 410 && !originalRequest._retry) {
      originalRequest._retry = true
      const refreshToken = localStorage.getItem('refreshToken')
      return handleRefreshTokenAPI(refreshToken)
        .then(() => {
          return authorizedAxiosInstance(originalRequest)
        })
        .catch((_err) => {
          handleLogoutAPI().then(() => {
            localStorage.removeItem('user')
            location.href = '/login'
          })
          Promise.reject(_err)
        })
    }

    if (error.response?.status !== 410) {
      // toast.error(error.response?.data?.message)
      console.log('🚀 ~ error.response:', error.response)
    }
    return Promise.reject(error)
  }
)

export default authorizedAxiosInstance
