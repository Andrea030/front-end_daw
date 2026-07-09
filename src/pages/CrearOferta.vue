<template>
  <q-page padding class="bg-grey-1">
    <div class="row justify-center q-mb-md">
      <div class="col-12 col-md-8 col-lg-6">
        <q-breadcrumbs active-color="dark" class="text-grey-7 q-mb-lg">
          <q-breadcrumbs-el
            label="Volver"
            icon="arrow_back"
            class="cursor-pointer"
            @click="volverAtras"
          />

          <q-breadcrumbs-el
            v-for="(ruta, index) in breadcrumbStore.historialRutas"
            :key="index"
            :label="ruta.label"
            :to="ruta.to"
            :class="{ 'text-weight-bold': index === breadcrumbStore.historialRutas.length - 1 }"
          />
        </q-breadcrumbs>
      </div>
    </div>

    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <q-card class="q-pa-md shadow-2" style="border-radius: 12px">
          <q-card-section>
            <div class="text-h6 text-weight-bold text-dark q-mb-sm">Detalles de la Oferta</div>
            <q-separator class="q-mb-lg" />
            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-sm-6">
                <div class="text-subtitle2 text-grey-8 q-mb-sm">Tengo</div>
                <q-select
                  outlined
                  v-model="formulario.monedaTengo"
                  :options="opcionesFiltradas"
                  option-label="label"
                  option-value="value"
                  dense
                  emit-value
                  map-options
                  use-input
                  hide-selected
                  fill-input
                  input-debounce="0"
                  @filter="filtrarMonedas"
                  placeholder="Seleccionar moneda..."
                />
              </div>
              <div class="col-12 col-sm-6">
                <div class="text-subtitle2 text-grey-8 q-mb-sm">Quiero</div>
                <q-select
                  outlined
                  v-model="formulario.monedaQuiero"
                  :options="opcionesFiltradas"
                  option-label="label"
                  option-value="value"
                  dense
                  emit-value
                  map-options
                  use-input
                  hide-selected
                  fill-input
                  input-debounce="0"
                  @filter="filtrarMonedas"
                  placeholder="Seleccionar moneda..."
                />
              </div>
            </div>

            <div class="row q-col-gutter-md q-mb-lg">
              <div class="col-12 col-sm-6">
                <div class="text-subtitle2 text-grey-8 q-mb-sm">Cantidad a intercambiar</div>
                <q-input
                  outlined
                  v-model.number="formulario.cantidad"
                  type="number"
                  min="0"
                  dense
                  :suffix="formulario.monedaTengo || ''"
                />
              </div>
              <div class="col-12 col-sm-6">
                <div class="row justify-between items-center q-mb-sm">
                  <div class="text-subtitle2 text-grey-8">Tasa de cambio</div>

                  <div class="text-caption text-weight-bold" style="color: #a87b5d">
                    Obtendrás: {{ cantidadARecibir }} {{ formulario.monedaQuiero || '' }}
                  </div>
                </div>

                <q-input
                  outlined
                  v-model.number="formulario.tasaCambio"
                  type="number"
                  min="0"
                  dense
                  :suffix="formulario.monedaTengo && formulario.monedaQuiero ? `${formulario.monedaQuiero}/${formulario.monedaTengo}` : ''"
                  bottom-slots
                >
                  <template v-slot:hint>
                    <span v-if="mostrarAdvertenciaTasa" class="text-negative text-weight-bold">
                      ¡! Esta tasa es muy baja respecto al mercado (Tasa Real: {{ tasaRealMercado.toFixed(4) }})
                    </span>
                    <span v-else class="text-grey-7">
                      Tasa aceptable (Mercado en vivo: {{ tasaRealMercado.toFixed(4) }})
                    </span>
                  </template>
                </q-input>
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-pt-none q-px-md q-pb-md">
            <q-btn flat label="Cancelar" color="grey-8" no-caps class="q-mr-sm" @click="volverAtras"/>
            <q-btn
              unelevated
              label="Publicar Oferta"
              style="background-color: #a87b5d; color: white"
              no-caps
              :disable="publicando ||!formulario.monedaTengo || !formulario.monedaQuiero || formulario.cantidad <= 0"
              @click="prepararPublicacion"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { useBreadcrumbStore } from 'stores/breadcrumbStore'
import { uniRateService } from 'src/services/uniRateService'

const router = useRouter()
const $q = useQuasar()
const breadcrumbStore = useBreadcrumbStore()

const volverAtras = () => {
  router.back()
}

const MAX_DIGITOS = 999999999

const opcionesMonedas = ref([])
const opcionesFiltradas = ref([])
const tasaRealMercado = ref(0)

const filtrarMonedas = (val, update) => {
  // Si el campo está vacío, mostramos todas las monedas disponibles
  if (val === '') {
    update(() => {
      opcionesFiltradas.value = opcionesMonedas.value
    })
    return
  }

  update(() => {
    const terminoBusqueda = val.toLowerCase()
    // Filtramos tanto por el código (value) como por el texto (label)
    opcionesFiltradas.value = opcionesMonedas.value.filter(
      mo => mo.label.toLowerCase().indexOf(terminoBusqueda) > -1 || 
            mo.value.toLowerCase().indexOf(terminoBusqueda) > -1
    )
  })
}

const formulario = reactive({
  monedaTengo: null,
  monedaQuiero: null,
  cantidad: 0.00,
  tasaCambio: 0.00,
})

const publicando = ref(false)

onMounted(async () => {
  $q.loading.show({ message: 'Cargando divisas disponibles...' })
  try {
    const monedas = await uniRateService.obtenerMonedasDisponibles()
    opcionesMonedas.value = monedas
    opcionesFiltradas.value = monedas

    formulario.monedaTengo = null
    formulario.monedaQuiero = null
    tasaRealMercado.value = 0.00

  } catch (error) {
    console.error('Error al inicializar formulario:', error)
  } finally {
    $q.loading.hide()
  }
})

// Función aislada para actualizar la tasa real del mercado en background
const actualizarTasaMercado = async () => {
  // 1. Validamos de forma estricta que AMBAS monedas existan y tengan texto
  if (!formulario.monedaTengo || !formulario.monedaQuiero) {
    tasaRealMercado.value = 0.00
    formulario.tasaCambio = 0.00
    return
  }
  
  try {
    // 2. Pasamos las variables directamente (ya son strings como "USD", no objetos)
    const tasa = await uniRateService.obtenerTasaReal(
      formulario.monedaTengo,
      formulario.monedaQuiero
    )
    
    tasaRealMercado.value = tasa
    formulario.tasaCambio = parseFloat(tasa.toFixed(4))
  } catch (error) {
    console.error("Error al actualizar la tasa:", error)
  }
}

// Lógica de la advertencia con tolerancia del 10%
const mostrarAdvertenciaTasa = computed(() => {
  if (!formulario.tasaCambio || !tasaRealMercado.value) return false
  
  // Calculamos el límite mínimo aceptable (90% de la tasa real)
  const limiteMinimo = tasaRealMercado.value * 0.90
  
  // Solo se muestra si la tasa ingresada es menor al límite mínimo
  return formulario.tasaCambio < limiteMinimo
})

const cantidadARecibir = computed(() => {
  const resultado = formulario.cantidad * formulario.tasaCambio
  if (isNaN(resultado) || resultado === 0) return '0.00'
  return resultado.toFixed(2)
})

// Watcher para Moneda Tengo
watch(
  () => formulario.monedaTengo,
  async (nuevaMoneda, viejaMoneda) => {
    if (!nuevaMoneda) return
    // Comparación directa de strings sin usar .value
    if (formulario.monedaQuiero && nuevaMoneda === formulario.monedaQuiero) {
      formulario.monedaQuiero = viejaMoneda
    }
    await actualizarTasaMercado()
  }
)

// Watcher para Moneda Quiero
watch(
  () => formulario.monedaQuiero,
  async (nuevaMoneda, viejaMoneda) => {
    if (!nuevaMoneda) return
    // Comparación directa de strings sin usar .value
    if (formulario.monedaTengo && nuevaMoneda === formulario.monedaTengo) {
      formulario.monedaTengo = viejaMoneda
    }
    await actualizarTasaMercado()
  }
)

// Validadores de límites de dígitos (Se mantienen igual)
watch(
  () => formulario.cantidad,
  (nuevaCantidad) => {
    if (!nuevaCantidad) return
    if (nuevaCantidad < 0) { formulario.cantidad = 0; return }
    const cantidadFormateada = parseFloat(nuevaCantidad.toFixed(2))
    if (nuevaCantidad !== cantidadFormateada) { formulario.cantidad = cantidadFormateada; return }
    if (nuevaCantidad > MAX_DIGITOS) { formulario.cantidad = MAX_DIGITOS }
    if (formulario.cantidad * formulario.tasaCambio > MAX_DIGITOS) {
      formulario.cantidad = parseFloat((MAX_DIGITOS / formulario.tasaCambio).toFixed(2))
    }
  },
)

watch(
  () => formulario.tasaCambio,
  (nuevaTasa) => {
    if (!nuevaTasa) return
    if (nuevaTasa < 0) { formulario.tasaCambio = 0; return }
    const tasaFormateada = parseFloat(nuevaTasa.toFixed(4))
    if (nuevaTasa !== tasaFormateada) { formulario.tasaCambio = tasaFormateada; return }
    if (nuevaTasa > MAX_DIGITOS) { formulario.tasaCambio = MAX_DIGITOS }
    if (formulario.cantidad * formulario.tasaCambio > MAX_DIGITOS) {
      formulario.tasaCambio = parseFloat((MAX_DIGITOS / formulario.cantidad).toFixed(4))
    }
  },
)

// 3. FLUJO DE CONTROL: Publicación y Verificación de Duplicados
const prepararPublicacion = async () => {
  if (!formulario.monedaTengo || !formulario.monedaQuiero) return

  if (publicando.value) return // Evita múltiples clics

  try {
    publicando.value = true //bloquear boton de inmediato
    $q.loading.show({ message: 'Buscando coincidencias en el mercado...' })

    const respuestaCoincidencia = await api.get('/ofertas/buscar-coincidencia', {
      params: {
        monedaAEnviar: formulario.monedaTengo,
        monedaARecibir: formulario.monedaQuiero,
        cantidad: formulario.cantidad,
        tipoCambio: formulario.tasaCambio
      }
    })

    $q.loading.hide() // Ocultamos para poder mostrar diálogos si es necesario

    if (respuestaCoincidencia.data) {
      const match = respuestaCoincidencia.data

      $q.dialog({
        title: '¡Coincidencia de mercado encontrada!',
        message: `El usuario ${match.nombreUsuario} tiene una oferta activa que calza con lo que buscas. Está ofreciendo una tasa de ${match.tipoCambio.toFixed(4)} por una cantidad de ${match.cantidad}. ¿Deseas ver su oferta para realizar el intercambio directo o prefieres publicar tu oferta de todos modos?`,
        cancel: { label: 'Publicar de todos modos', flat: true, color: 'grey-8' },
        ok: { label: 'Ver Oferta de Contraparte', color: 'primary' },
        persistent: true
      }).onOk(() => {
        publicando.value = false // Liberamos el botón si decide salir de la pantalla
        // Redirecciona al detalle de la oferta que le hace el match perfecto
        router.push(`/ofertas/${match.id}`)
      }).onCancel(async () => {
        // Si el usuario decide ignorar el match y prefiere dejar su propia oferta flotando
        await ejecutarPublicacionPost()
      })
    } else {
      await ejecutarPublicacionPost()
    }

  } catch (error) {
    $q.loading.hide()
    publicando.value = false // Desbloqueamos el botón si el servidor falla
    console.error('Error en el flujo de matching:', error)
    $q.notify({
      type: 'negative',
      message: 'Error al verificar coincidencias con el servidor.',
      position: 'top'
    })
  }
}

// El método POST real aislado
const ejecutarPublicacionPost = async () => {
  try {
    $q.loading.show({ message: 'Publicando oferta...' })

    const payload = {
      monedaAEnviar: formulario.monedaTengo,
      monedaARecibir: formulario.monedaQuiero,
      tipoCambio: formulario.tasaCambio,
      cantidad: formulario.cantidad,
    }

    await api.post('/ofertas', payload)

    $q.notify({
      type: 'positive',
      message: 'Oferta publicada con éxito',
      position: 'top',
    })

    router.push('/')
  } catch (error) {
    console.error('Error al publicar la oferta:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.mensaje || 'Error al conectar con el servidor',
      position: 'top',
    })
  } finally {
    $q.loading.hide()
  }
}
</script>
