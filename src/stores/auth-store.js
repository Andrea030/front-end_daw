import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)

  const isLoggedIn = computed(() => !!token.value)

  // Extrae el ClaimTypes.NameIdentifier (mapeado como "nameid" en el JWT de .NET)
  const userId = computed(() => {
    if (!token.value) return null
    try {
      const decoded = jwtDecode(token.value)
      return decoded.nameid ? parseInt(decoded.nameid, 10) : null
    } catch (e) {
      console.error('Error al decodificar el token:', e)
      return null
    }
  })

  const login = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  const logout = () => {
    token.value = null
    localStorage.removeItem('token')
  }

  return { token, isLoggedIn, userId, login, logout }
})