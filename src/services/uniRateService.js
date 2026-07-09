import { api } from 'src/boot/axios'

export const uniRateService = {
  
  async obtenerMonedasDisponibles() {
    try {
      const response = await api.get('/divisas/monedas')
      const data = response.data || {}

      return Object.keys(data).map(codigo => ({
        label: codigo,
        value: codigo
      }))

    } catch (error) {
      console.error('Error al obtener monedas de DivisasController:', error)
      // Fallback en caso falle la API para q no muera
      return [
        { label: 'NO FUNCIONÓ LA API', value: 'kms' }
      ]
    }
  },

  async obtenerTasaReal(deMoneda, aMoneda) {
    try {
      const response = await api.get('/divisas/tipo-cambio', {
        params: {
          monedaOrigen: deMoneda,
          monedaDestino: aMoneda,
        }
      })
      
      return response.data?.tipoCambio || response.data?.result || 1.0
    } catch (error) {
      console.error(`Error al obtener tasa desde backend para ${deMoneda}/${aMoneda}:`, error)
      return 1.0
    }
  }
}