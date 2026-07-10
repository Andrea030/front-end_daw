<template>
  <q-page padding class="bg-grey-1">
    <div style="max-width: 900px; margin: 0 auto">
      <div class="row justify-start q-mb-lg animate-fade-up">
        <q-breadcrumbs active-color="dark" class="text-grey-7">
          <q-breadcrumbs-el
            label="Volver"
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

      <div
        class="text-h3 text-weight-bold text-dark q-mb-lg animate-fade-up"
        style="letter-spacing: -1px; animation-delay: 0.1s"
      >
        {{ formulario.cantidad }} {{ nombreMonedaBase }} a {{ formulario.monedaQuiero }}
      </div>

      <q-card
        flat
        bordered
        class="q-pa-xl bg-white q-mb-xl animate-fade-up"
        style="border-radius: 8px; border-color: #e0e0e0; animation-delay: 0.2s"
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
              :style="{
                transform: `rotate(${rotacionSwap}deg)`,
                transition: 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }"
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
              :class="{ 'animacion-pulso': pulsoActivo }"
            />
          </div>
        </div>
        <div
          class="row q-col-gutter-md q-mt-xs q-mb-lg animate-fade-up"
          style="animation-delay: 0.25s"
        >
          <div class="col-12 col-md-5">
            <div
              class="text-caption text-grey-6 text-weight-medium q-pl-sm"
              style="font-size: 13px"
            >
              1 {{ formulario.monedaTengo }} = {{ tasaActualFormateada }}
              {{ formulario.monedaQuiero }}
            </div>
          </div>

          <div class="col-12 col-md-2"></div>

          <div class="col-12 col-md-5">
            <div
              class="text-caption text-grey-6 text-weight-medium q-pl-sm"
              style="font-size: 13px"
            >
              1 {{ formulario.monedaQuiero }} = {{ tasaInversaFormateada }}
              {{ formulario.monedaTengo }}
            </div>
          </div>
        </div>
      </q-card>

      <div class="q-mt-xl">
        <div
          class="text-h5 text-weight-bold text-dark q-mb-lg animate-fade-up"
          style="animation-delay: 0.3s"
        >
          Conversiones populares
        </div>

        <div class="row q-col-gutter-md">
          <div
            class="col-12 col-sm-6 animate-fade-up"
            v-for="(par, index) in conversionesPopulares"
            :key="index"
            :style="{ animationDelay: `${0.4 + index * 0.05}s` }"
          >
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
              <q-icon name="chevron_right" size="sm" color="dark" class="flecha-icono" />
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
import { uniRateService } from 'src/services/uniRateService'

const router = useRouter()
const $q = useQuasar()
const breadcrumbStore = useBreadcrumbStore()

// Variables
const opcionesMonedas = ref([])
const opcionesFiltradas = ref([])
const tasaActual = ref(0)
const cargandoTasa = ref(false)

// Variables para Animaciones
const rotacionSwap = ref(0)
const pulsoActivo = ref(false)

const formulario = reactive({
  cantidad: 1,
  monedaTengo: 'EUR',
  monedaQuiero: 'USD',
})

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

const volverAtras = () => {
  router.back()
}

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

const nombreMonedaBase = computed(() => {
  const moneda = opcionesMonedas.value.find((m) => m.value === formulario.monedaTengo)
  if (moneda) {
    const partes = moneda.label.split('-')
    return partes.length > 1 ? partes[1].trim() : moneda.value
  }
  return formulario.monedaTengo
})

// 1. El cálculo de la caja gris derecha
const cantidadConvertida = computed(() => {
  if (formulario.cantidad === null || formulario.cantidad === '') return ''
  const total = formulario.cantidad * tasaActual.value
  return total > 0 ? total.toFixed(4) : '0.0000'
})

// 2. La tasa unitaria que aparece debajo
const tasaActualFormateada = computed(() => {
  return tasaActual.value ? tasaActual.value.toFixed(5) : '0.00000'
})

// 3. La tasa inversa
const tasaInversaFormateada = computed(() => {
  return tasaActual.value ? (1 / tasaActual.value).toFixed(5) : '0.00000'
})

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

// Invertir monedas con incremento de rotación
const invertirMonedas = () => {
  rotacionSwap.value += 180 // Suma 180 grados para que siempre gire fluido
  const temporal = formulario.monedaTengo
  formulario.monedaTengo = formulario.monedaQuiero
  formulario.monedaQuiero = temporal
}

const aplicarConversionPopular = (base, destino) => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
  formulario.cantidad = 1
  formulario.monedaTengo = base
  formulario.monedaQuiero = destino
}

// Escuchar cambios para hacer la llamada y activar el pulso visual
const activarPulso = () => {
  pulsoActivo.value = true
  setTimeout(() => {
    pulsoActivo.value = false
  }, 400)
}

// 1. VIGILANTE DE MONEDAS: Este SÍ llama a la API porque la tasa cambia
watch([() => formulario.monedaTengo, () => formulario.monedaQuiero], async () => {
  await obtenerTasaDesdeApi()
  activarPulso()
})

// 2. VIGILANTE DE CANTIDAD: Este NO llama a la API, solo calcula localmente y anima
watch(
  () => formulario.cantidad,
  () => {
    // Solo se activa la animación, Vue ya calcula el total matemáticamente en el 'computed'
    activarPulso()
  },
)

onMounted(async () => {
  breadcrumbStore.setHistorial([
    { label: 'Inicio', to: '/' },
    { label: 'Tipo de Cambio', to: '/tipo-cambio' },
  ])

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
/* 1. Animación de Cascada (Fade Up) */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-up {
  opacity: 0; /* Inicia oculto */
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* 2. Animación de Pulso para el Input de Resultado */
@keyframes flashPulse {
  0% {
    transform: scale(1);
    color: #424242;
  }
  50% {
    transform: scale(1.02);
    color: #a87b5d;
  }
  100% {
    transform: scale(1);
    color: #424242;
  }
}

.animacion-pulso :deep(input) {
  animation: flashPulse 0.4s ease-out;
  color: #a87b5d !important; /* Brillo momentáneo */
}

/* Ocultar flechas nativas */
.input-sin-flechas :deep(input[type='number']::-webkit-outer-spin-button),
.input-sin-flechas :deep(input[type='number']::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}
.input-sin-flechas :deep(input[type='number']) {
  -moz-appearance: textfield;
}

/* Inputs Planos */
:deep(.q-field--filled .q-field__control::before) {
  border-bottom: none !important;
}

/* Efecto hover interactivo para las tarjetas */
.hover-card {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}
.hover-card:hover {
  border-color: #a87b5d !important;
  box-shadow: 0 4px 15px rgba(168, 123, 93, 0.15);
  transform: translateY(-3px);
}
.hover-card .flecha-icono {
  transition: transform 0.3s ease;
}
.hover-card:hover .flecha-icono {
  transform: translateX(5px);
  color: #a87b5d !important;
}
</style>
