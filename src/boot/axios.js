import { boot } from 'quasar/wrappers'
import axios from 'axios'

// url API de .NET
const api = axios.create({ baseURL: 'http://localhost:5000/api' })

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor de respuestas para manejar errores globales como el 401 (Expiró sesión)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login' // O usar el router de Vue
    }
    return Promise.reject(error)
  },
)

export { api }

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})