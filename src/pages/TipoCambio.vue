<template>
  <q-page padding class="bg-grey-1">
    <div style="max-width: 900px; margin: 0 auto">
      <div class="row justify-start q-mb-lg">
        <q-breadcrumbs active-color="dark" class="text-grey-7">
          <q-breadcrumbs-el
            label="Volver | "
            class="cursor-pointer text-weight-bold"
            @click="volverAtras"
          />
          <q-breadcrumbs-el
            v-for="(ruta, index) in breadcrumbStore.historialRutas"
            :key="index"
            :label="ruta.label"
            :to="ruta.to"
            :class="{
              'text-weight-bold text-dark': index === breadcrumbStore.historialRutas.length - 1,
            }"
          />
        </q-breadcrumbs>
      </div>

      <div class="text-h3 text-weight-bold text-dark q-mb-lg" style="letter-spacing: -1px">
        {{ formulario.cantidad }} {{ nombreMonedaBase }} a {{ formulario.monedaQuiero }}
      </div>

      <q-card
        flat
        bordered
        class="q-pa-xl bg-white q-mb-xl"
        style="border-radius: 8px; border-color: #e0e0e0"
      >
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-md-5">
            <q-select
              outlined
              v-model="formulario.monedaTengo"
              :options="opcionesFiltradas"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              @filter="filtrarMonedas"
            >
              <template v-slot:prepend>
                <q-icon name="payments" color="primary" />
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-2 flex flex-center">
            <q-btn
              flat
              round
              icon="swap_horiz"
              color="positive"
              size="lg"
              @click="invertirMonedas"
            />
          </div>

          <div class="col-12 col-md-5">
            <q-select
              outlined
              v-model="formulario.monedaQuiero"
              :options="opcionesFiltradas"
              option-label="label"
              option-value="value"
              emit-value
              map-options
              use-input
              hide-selected
              fill-input
              input-debounce="0"
              @filter="filtrarMonedas"
            >
              <template v-slot:prepend>
                <q-icon name="account_balance" color="primary" />
              </template>
            </q-select>
          </div>
        </div>

        <div class="row q-col-gutter-md q-mt-sm">
          <div class="col-12 col-md-5">
            <q-input
              filled
              bg-color="grey-2"
              v-model.number="formulario.cantidad"
              type="number"
              min="0"
              input-style="font-size: 28px; padding: 20px 0;"
              class="input-sin-flechas"
              :loading="cargandoTasa"
            />
          </div>

          <div class="col-12 col-md-2"></div>
          <div class="col-12 col-md-5">
            <q-input
              filled
              bg-color="grey-2"
              readonly
              :model-value="cantidadConvertida"
              input-style="font-size: 28px; padding: 20px 0; color: #424242;"
              :loading="cargandoTasa"
            />
          </div>
        </div>
      </q-card>

      <div class="q-mt-xl">
        <div class="text-h5 text-weight-bold text-dark q-mb-lg">Conversiones populares</div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6" v-for="(par, index) in conversionesPopulares" :key="index">
            <q-card
              flat
              bordered
              class="q-pa-md cursor-pointer hover-card row justify-between items-center"
              style="border-radius: 4px; border-color: #e0e0e0"
              @click="aplicarConversionPopular(par.base, par.destino)"
            >
              <div class="text-weight-bold text-dark text-subtitle1">
                1 {{ par.base }} a {{ par.destino }}
              </div>
              <q-icon name="chevron_right" size="sm" color="dark" />
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useBreadcrumbStore } from 'stores/breadcrumbStore'
import { uniRateService } from 'src/services/uniRateService' // Tu servicio de API

const router = useRouter()
const $q = useQuasar()
const breadcrumbStore = useBreadcrumbStore()

// Variables
const opcionesMonedas = ref([])
const opcionesFiltradas = ref([])
const tasaActual = ref(0)
const cargandoTasa = ref(false)

const formulario = reactive({
  cantidad: 1, // Por defecto iniciamos en 1
  monedaTengo: 'EUR',
  monedaQuiero: 'USD',
})

// Lista fija de conversiones populares
const conversionesPopulares = [
  { base: 'EUR', destino: 'USD' },
  { base: 'EUR', destino: 'CHF' },
  { base: 'EUR', destino: 'JPY' },
  { base: 'EUR', destino: 'CNY' },
  { base: 'EUR', destino: 'GBP' },
  { base: 'EUR', destino: 'HKD' },
  { base: 'EUR', destino: 'AUD' },
  { base: 'EUR', destino: 'NZD' },
  { base: 'EUR', destino: 'CAD' },
  { base: 'EUR', destino: 'SEK' },
]

// Volver atrás en breadcrumbs
const volverAtras = () => {
  router.back()
}

// Búsqueda en los q-select
const filtrarMonedas = (val, update) => {
  if (val === '') {
    update(() => {
      opcionesFiltradas.value = opcionesMonedas.value
    })
    return
  }
  update(() => {
    const termino = val.toLowerCase()
    opcionesFiltradas.value = opcionesMonedas.value.filter(
      (mo) =>
        mo.label.toLowerCase().indexOf(termino) > -1 ||
        mo.value.toLowerCase().indexOf(termino) > -1,
    )
  })
}

// Para que el título grande diga "1 Euro a USD" en lugar de "1 EUR a USD"
const nombreMonedaBase = computed(() => {
  const moneda = opcionesMonedas.value.find((m) => m.value === formulario.monedaTengo)
  // Asumiendo que tu label es "EUR - Euro", extraemos la palabra "Euro". Ajusta según tus datos.
  if (moneda) {
    const partes = moneda.label.split('-')
    return partes.length > 1 ? partes[1].trim() : moneda.value
  }
  return formulario.monedaTengo
})

// Cálculo en tiempo real (formateado a 4 decimales como OANDA)
const cantidadConvertida = computed(() => {
  if (formulario.cantidad === null || formulario.cantidad === '') return ''
  const total = formulario.cantidad * tasaActual.value
  return total > 0 ? total.toFixed(4).replace('.', ',') : '0,0000'
})

// Consumir tu API
const obtenerTasaDesdeApi = async () => {
  if (!formulario.monedaTengo || !formulario.monedaQuiero) return

  cargandoTasa.value = true
  try {
    const tasa = await uniRateService.obtenerTasaReal(
      formulario.monedaTengo,
      formulario.monedaQuiero,
    )
    tasaActual.value = tasa
  } catch (error) {
    console.error('Error al obtener la tasa:', error)
    $q.notify({
      type: 'negative',
      message: 'No se pudo obtener el tipo de cambio actual',
      position: 'top',
    })
  } finally {
    cargandoTasa.value = false
  }
}

// Botón de invertir divisas
const invertirMonedas = () => {
  const temporal = formulario.monedaTengo
  formulario.monedaTengo = formulario.monedaQuiero
  formulario.monedaQuiero = temporal
  // El watch se encargará de disparar obtenerTasaDesdeApi()
}

// Clic en tarjetas populares (La magia del scroll y el reseteo)
const aplicarConversionPopular = (base, destino) => {
  // 1. Efecto visual suave hacia el inicio de la página
  window.scrollTo({ top: 0, behavior: 'smooth' })

  // 2. Setear valores
  formulario.cantidad = 1
  formulario.monedaTengo = base
  formulario.monedaQuiero = destino

  // No necesitamos llamar a la API manualmente aquí,
  // porque el 'watch' detectará el cambio y lo hará por nosotros.
}

// Reaccionar a cualquier cambio de moneda
watch([() => formulario.monedaTengo, () => formulario.monedaQuiero], () => {
  obtenerTasaDesdeApi()
})

// Inicialización
onMounted(async () => {
  // 1. Configurar Migas de Pan
  breadcrumbStore.setHistorial([
    { label: 'Inicio', to: '/' },
    { label: 'Tipo de Cambio', to: '/tipo-cambio' },
  ])

  // 2. Obtener lista de monedas y tasa inicial
  try {
    const monedas = await uniRateService.obtenerMonedasDisponibles()
    opcionesMonedas.value = monedas
    opcionesFiltradas.value = monedas
    await obtenerTasaDesdeApi()
  } catch (error) {
    console.error('Error de inicialización:', error)
  }
})
</script>

<style scoped>
/* Ocultar las flechas nativas del input numérico */
.input-sin-flechas :deep(input[type='number']::-webkit-outer-spin-button),
.input-sin-flechas :deep(input[type='number']::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}
.input-sin-flechas :deep(input[type='number']) {
  -moz-appearance: textfield;
}

/* Eliminar el underline base de los inputs "filled" de Quasar para que parezcan cajas planas */
:deep(.q-field--filled .q-field__control::before) {
  border-bottom: none !important;
}

/* Efecto hover suave para las tarjetas de conversiones populares */
.hover-card {
  transition: all 0.2s ease-in-out;
}
.hover-card:hover {
  border-color: #a87b5d !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transform: translateY(-2px);
}
</style>
