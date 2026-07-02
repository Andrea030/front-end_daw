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
                  :options="opcionesMonedas"
                  option-label="label"
                  option-value="value"
                  dense
                />
              </div>
              <div class="col-12 col-sm-6">
                <div class="text-subtitle2 text-grey-8 q-mb-sm">Quiero</div>
                <q-select
                  outlined
                  v-model="formulario.monedaQuiero"
                  :options="opcionesMonedas"
                  option-label="label"
                  option-value="value"
                  dense
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
                  :suffix="formulario.monedaTengo.value"
                />
              </div>
              <div class="col-12 col-sm-6">
                <div class="row justify-between items-center q-mb-sm">
                  <div class="text-subtitle2 text-grey-8">Tasa de cambio</div>

                  <div class="text-caption text-weight-bold" style="color: #a87b5d">
                    Obtendrás: {{ cantidadARecibir }} {{ formulario.monedaQuiero.value }}
                  </div>
                </div>

                <q-input
                  outlined
                  v-model.number="formulario.tasaCambio"
                  type="number"
                  min="0"
                  dense
                  :suffix="`${formulario.monedaQuiero.value}/${formulario.monedaTengo.value}`"
                  bottom-slots
                >
                  <template v-slot:hint>
                    <span class="text-grey-7">Esta tasa es muy baja</span>
                  </template>
                </q-input>
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-pt-none q-px-md q-pb-md">
            <q-btn flat label="Cancelar" color="grey-8" no-caps class="q-mr-sm" />
            <q-btn
              unelevated
              label="Publicar Oferta"
              style="background-color: #a87b5d; color: white"
              no-caps
              @click="prepararPublicacion"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios'
import { useBreadcrumbStore } from 'stores/breadcrumbStore'

const router = useRouter()
const $q = useQuasar()

const breadcrumbStore = useBreadcrumbStore()

const volverAtras = () => {
  router.back()
}

const MAX_DIGITOS = 999999999

const opcionesMonedas = [
  { label: 'USD - Dólares', value: 'USD' },
  { label: 'EUR - Euro', value: 'EUR' },
  { label: 'PEN - Soles', value: 'PEN' },
]

const formulario = reactive({
  tipoTransaccion: 'compra',
  monedaTengo: opcionesMonedas[0],
  monedaQuiero: opcionesMonedas[1],
  cantidad: 1000.0,
  tasaCambio: 1.17,
})

const cantidadARecibir = computed(() => {
  const resultado = formulario.cantidad * formulario.tasaCambio

  // Si el resultado no es un número válido (ej. si el usuario borra todo), devolvemos 0.00
  if (isNaN(resultado) || resultado === 0) return '0.00'

  // Formateamos para que siempre muestre 2 decimales
  return resultado.toFixed(2)
})

watch(
  () => formulario.monedaTengo,
  (nuevaMoneda, viejaMoneda) => {
    // Si la nueva moneda que seleccioné es igual a la que ya estaba en "Quiero"
    if (nuevaMoneda.value === formulario.monedaQuiero.value) {
      // Pasamos la moneda que teníamos antes al campo "Quiero"
      formulario.monedaQuiero = viejaMoneda
    }
  },
)

watch(
  () => formulario.monedaQuiero,
  (nuevaMoneda, viejaMoneda) => {
    // Si la nueva moneda que seleccioné es igual a la que ya estaba en "Tengo"
    if (nuevaMoneda.value === formulario.monedaTengo.value) {
      // Pasamos la moneda que teníamos antes al campo "Tengo"
      formulario.monedaTengo = viejaMoneda
    }
  },
)

watch(
  () => formulario.cantidad,
  (nuevaCantidad) => {
    if (!nuevaCantidad) return

    if (nuevaCantidad < 0) {
      formulario.cantidad = 0
      return
    }

    const cantidadFormateada = parseFloat(nuevaCantidad.toFixed(2))
    if (nuevaCantidad !== cantidadFormateada) {
      formulario.cantidad = cantidadFormateada
      return
    }

    if (nuevaCantidad > MAX_DIGITOS) {
      formulario.cantidad = MAX_DIGITOS
    }

    // Capear si el producto (Obtendrás) supera el límite
    if (formulario.cantidad * formulario.tasaCambio > MAX_DIGITOS) {
      formulario.cantidad = parseFloat((MAX_DIGITOS / formulario.tasaCambio).toFixed(2))
    }
  },
)

watch(
  () => formulario.tasaCambio,
  (nuevaTasa) => {
    if (!nuevaTasa) return

    if (nuevaTasa < 0) {
      formulario.tasaCambio = 0
      return
    }

    const tasaFormateada = parseFloat(nuevaTasa.toFixed(4))
    if (nuevaTasa !== tasaFormateada) {
      formulario.tasaCambio = tasaFormateada
      return
    }

    if (nuevaTasa > MAX_DIGITOS) {
      formulario.tasaCambio = MAX_DIGITOS
    }

    // Capear si el producto (Obtendrás) supera el límite
    if (formulario.cantidad * formulario.tasaCambio > MAX_DIGITOS) {
      formulario.tasaCambio = parseFloat((MAX_DIGITOS / formulario.cantidad).toFixed(4))
    }
  },
)

// Función temporal para probar en consola antes de conectar Axios
const prepararPublicacion = async () => {
  try {
    $q.loading.show({ message: 'Publicando oferta...' })

    const payload = {
      monedaAEnviar: formulario.monedaTengo.value,
      monedaARecibir: formulario.monedaQuiero.value,
      tipoCambio: formulario.tasaCambio,
      cantidad: formulario.cantidad,
    }

    const response = await api.post('/ofertas', payload)

    response.data
    $q.notify({
      type: 'positive',
      message: 'Oferta publicada con éxito',
      position: 'top',
    })

    router.push('/ofertas')
  } catch (error) {
    console.error(error)
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
