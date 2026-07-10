<template>
  <q-page class="q-pa-md bg-grey-1 flex flex-center">
    <div v-if="loading" class="column items-center q-gutter-md">
      <q-spinner-dots color="primary" size="50px" />
      <span class="text-subtitle1 text-grey-7">Cargando detalles de la oferta...</span>
    </div>

    <q-card v-else-if="oferta" flat bordered class="overview-card q-pa-lg">
      <div class="row items-center q-mb-md border-b q-pb-sm">
        <q-icon name="swap_horizontal_circle" color="primary" size="md" class="q-mr-sm" />
        <div class="text-h5 text-weight-bold text-grey-9">Resumen de Intercambio</div>
      </div>

      <div class="user-section bg-blue-1 q-pa-sm rounded-borders row items-center justify-between q-mb-lg">
        <div class="row items-center q-gutter-x-sm">
          <q-avatar color="primary" text-color="white" size="md" class="text-uppercase">
            {{ oferta.nombreUsuario?.charAt(0) }}
          </q-avatar>
          <div>
            <div class="text-subtitle1 text-weight-bold text-grey-9">Oferta de:</div>
                <span style="font-size: 1.2em; color: #3174BD; font-weight: bold">{{ oferta.nombreUsuario }}</span>
          </div>
        </div>
        <div class="row items-center q-gutter-x-xs bg-white q-px-sm q-py-xs rounded-borders shadow-1">
          <q-icon name="star" color="warning" size="xs" />
          <span class="text-subtitle2 text-weight-bold text-grey-9">{{ oferta.calificacionUsuario }}</span>
        </div>
      </div>

      <div class="row q-col-gutter-md q-mb-lg">
        <div class="col-12 col-sm-6">
          <div class="info-box q-pa-md bordered rounded-borders bg-white">
            <div class="text-caption text-grey-6 text-uppercase text-weight-medium">Vas a entregar</div>
            <div class="text-h4 text-weight-bolder text-negative q-my-xs">
              {{ calcularMontoAEntregar }} <span class="text-subtitle1">{{ oferta.monedaARecibir }}</span>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-6">
          <div class="info-box q-pa-md bordered rounded-borders bg-white">
            <div class="text-caption text-grey-6 text-uppercase text-weight-medium">Vas a recibir</div>
            <div class="text-h4 text-weight-bolder text-positive q-my-xs">
              {{ oferta.cantidad }} <span class="text-subtitle1">{{ oferta.monedaAEnviar }}</span>
            </div>
          </div>
        </div>
      </div>

      <q-list bordered separator class="rounded-borders bg-white q-mb-xl">
        <q-item>
          <q-item-section>
            <q-item-label class="text-grey-7">Tasa de Cambio Ofrecida</q-item-label>
          </q-item-section>
          <q-item-section side class="text-weight-bold text-grey-9 text-subtitle1">
            1 {{ oferta.monedaAEnviar }} = {{ oferta.tipoCambio }} {{ oferta.monedaARecibir }}
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section>
            <q-item-label class="text-grey-7">Estado de la Publicación</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-chip :color="oferta.estado ? 'green-1' : 'red-1'" :text-color="oferta.estado ? 'green-9' : 'red-9'" dense class="text-weight-bold">
              {{ oferta.estado ? 'DISPONIBLE' : 'INACTIVA' }}
            </q-chip>
          </q-item-section>
        </q-item>
      </q-list>

      <div class="row q-col-gutter-sm justify-end">
        <div class="col-12 col-sm-4">
          <q-btn label="Regresar" flat color="grey-7" class="full-width text-weight-bold" @click="router.back()" />
        </div>
        <div class="col-12 col-sm-6">
          <q-btn label="Confirmar Intercambio" unelevated color="primary" class="full-width text-weight-bold" 
            :disable="!oferta.estado"
            :loading="procesandoTransaccion"
            @click="confirmarTransaccion" 
            />
        </div>
      </div>
    </q-card>

    <div v-else class="column items-center q-gutter-sm">
      <q-icon name="error_outline" color="negative" size="xl" />
      <span class="text-subtitle1 text-grey-7">No se pudo encontrar o cargar la oferta solicitada.</span>
      <q-btn label="Volver a la vista principal" flat color="primary" @click="router.push('/')" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/boot/axios' 

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

// Nota: Ya no necesitas concatenar 'baseUrl' manualmente, 'api' ya tiene configurada tu URL base.

const loading = ref(true)
const procesandoTransaccion = ref(false) // Nuevo estado para controlar la animación del botón
const oferta = ref(null)

// --- OBTENER DETALLE POR ID ---
const fetchOfertaDetalle = async () => {
  const offerId = route.query.id

  if (!offerId) {
    $q.notify({ type: 'negative', message: 'No se especificó un ID de oferta válido.', position: 'top' })
    loading.value = false
    return
  }

  try {
    loading.value = true
    // Cambiado de 'axios.get' a 'api.get' para usar la configuración global
    const response = await api.get(`/ofertas/${offerId}`)
    oferta.value = response.data
  } catch (error) {
    console.error('Error al consultar el detalle de la oferta:', error)
    $q.notify({ type: 'negative', message: 'Error al conectar con el servidor.', position: 'top' })
  } finally {
    loading.value = false
  }
}

// --- PROPIEDAD COMPUTADA PARA OPERACIÓN MATEMÁTICA ---
const calcularMontoAEntregar = computed(() => {
  if (!oferta.value) return 0
  const total = Number(oferta.value.cantidad) * Number(oferta.value.tipoCambio)
  return total.toFixed(2)
})

const confirmarTransaccion = () => {
    if (!oferta.value) return

    router.push({
        path: '/formalizar-transaccion',
        query: { id: oferta.value.id }
    })
}

onMounted(() => {
  fetchOfertaDetalle()
})
</script>

<style scoped>
.overview-card {
  width: 100%;
  max-width: 600px;
  background-color: white;
  border-radius: 12px;
}
.border-b {
  border-bottom: 1px solid #e0e0e0;
}
.info-box {
  border: 1px solid #e0e0e0;
}
</style>