import { boot } from 'quasar/wrappers'
import axios from 'axios'

// Cambia el puerto por el que te asigne Visual Studio/.NET al correr la API
const api = axios.create({ baseURL: 'http://localhost:5000/api' })

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
  app.config.globalProperties.$api = api
})
// El Interceptor
api.interceptors.request.use(
  (config) => {
    // Aquí asumimos que guardaste el token en localStorage al hacer Login
    const token = localStorage.getItem('jwt_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Opcional pero recomendado: Interceptor de respuestas para manejar el 401 (Expiró sesión)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Si el token expira, borramos la sesión y redirigimos al login
      localStorage.removeItem('jwt_token')
      window.location.href = '/login' // O usar el router de Vue
    }
    return Promise.reject(error)
  },
)

export { api }
