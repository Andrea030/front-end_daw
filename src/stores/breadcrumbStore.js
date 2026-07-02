import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBreadcrumbStore = defineStore('breadcrumbs', () => {
  // Estado reactivo inicial (vacío por defecto)
  const historialRutas = ref([])

  // Acción para sobrescribir el historial
  const setHistorial = (nuevoHistorial) => {
    historialRutas.value = nuevoHistorial
  }

  return { historialRutas, setHistorial }
})
