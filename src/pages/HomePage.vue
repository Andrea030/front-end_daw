<template>
  <q-page class="main-page bg-grey-1">
    <div class="row q-col-gutter-lg justify-center main-container">
      <div class="col-12 col-md-3 column q-gutter-y-md">
        <q-btn
          label="Publicar oferta"
          unelevated
          no-caps
          class="btn-publish text-weight-bold text-subtitle1"
          @click="handlePublishOffer"
        />

        <q-card flat bordered class="filter-card q-pa-md">
          <div class="text-subtitle1 text-weight-bold text-grey-9 q-mb-md">Filtros</div>

          <div class="filter-group">
            <span class="filter-label">Tengo (Enviar)</span>
            <q-select
              v-model="filterSend"
              :options="currencyOptions"
              outlined
              dense
              emit-value
              map-options
              class="q-mb-sm"
            />

            <span class="filter-label">Quiero (Recibir)</span>
            <q-select
              v-model="filterReceive"
              :options="currencyOptions"
              outlined
              dense
              emit-value
              map-options
            />
          </div>

          <div class="filter-group-large">
            <span class="filter-label">Tipo de cambio máximo</span>
            <div class="row q-col-gutter-sm items-center q-mb-xs">
              <div class="col-7">
                <q-slider v-model="maxRate" :min="0" :max="5" :step="0.01" color="primary" />
              </div>
              <div class="col-5">
                <q-input
                  v-model.number="maxRate"
                  type="number"
                  step="0.01"
                  outlined
                  dense
                  class="text-right"
                />
              </div>
            </div>
            <div class="row justify-between text-caption text-grey-7">
              <span>0.00</span>
              <span>5.00+</span>
            </div>
          </div>

          <div>
            <div class="row justify-between items-center q-mb-xs">
              <span class="filter-label q-ma-none">Calificación de usuario</span>
              <q-btn
                v-if="filterRating"
                label="Limpiar"
                flat
                dense
                color="negative"
                size="xs"
                @click="filterRating = null"
              />
            </div>

            <div class="radio-buttons">
              <q-radio
                v-model="filterRating"
                val="best"
                label="Del mejor al peor calificado"
                dense
                class="radio-item text-body2 text-grey-8"
              />

              <q-radio
                v-model="filterRating"
                val="worst"
                label="Del peor al mejor calificado"
                dense
                class="radio-item text-body2 text-grey-8"
              />
            </div>
          </div>
        </q-card>
      </div>

      <div class="col-12 col-md-8 column q-gutter-y-lg">
        <div class="row q-col-gutter-sm items-center">
          <div class="col-12 col-sm-8">
            <q-input
              v-model="searchQuery"
              outlined
              dense
              placeholder="Busca por moneda, cantidad o usuario..."
              bg-color="white"
              clearable
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-sm-4">
            <q-select
              v-model="sortBy"
              :options="sortOptions"
              outlined
              dense
              prefix="Ordenar por: "
              bg-color="white"
              emit-value
              map-options
            />
          </div>
        </div>

        <div>
          <div class="text-subtitle1 text-weight-bold text-grey-9 q-mb-md">Sugerencias</div>

          <div class="row justify-center q-pa-xl" v-if="loading">
            <q-spinner-dots color="primary" size="40px" />
          </div>

          <div
            v-else-if="filteredOffers.length === 0"
            class="text-center q-pa-xl text-grey-6 text-subtitle1"
          >
            No se encontraron ofertas que coincidan con tus criterios.
          </div>

          <div v-else class="row q-col-gutter-md">
            <div v-for="offer in filteredOffers" :key="offer.id" class="col-12 col-sm-6 col-md-4">
              <q-card flat bordered class="offer-card column justify-between full-height">
                <q-card-section class="q-pa-md column q-gutter-y-xs">
                  <div class="text-subtitle1 text-weight-bold text-grey-9">
                    Oferta por: {{ offer.nombreUsuario }}
                  </div>

                  <div class="offer-label">TASA DE CAMBIO</div>
                  <div class="offer-rate text-weight-bold">
                    {{ offer.tipoCambio }} {{ offer.monedaAEnviar }} / {{ offer.monedaARecibir }}
                  </div>

                  <div class="offer-label">MONTO</div>
                  <div class="offer-amount text-weight-bold text-grey-9">
                    {{ offer.cantidad }}
                  </div>

                  <div class="offer-label">CALIFICACIÓN VENDEDOR</div>
                  <div class="row items-center q-gutter-x-xs">
                    <q-icon name="star" color="warning" size="sm" />
                    <span class="text-subtitle2 text-weight-bold text-grey-9">
                      {{ offer.calificacionUsuario }}
                    </span>
                  </div>
                </q-card-section>

                <div class="offer-timestamp text-grey-6 text-uppercase">
                  Estado: {{ offer.estado ? 'Activo' : 'Inactivo' }}
                </div>

                <q-btn
                  label="Intercambiar"
                  unelevated
                  no-caps
                  class="btn-exchange full-width text-weight-bold"
                  @click="handleExchange(offer.id)"
                />
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const baseUrl = 'http://localhost:5000'

const loading = ref(false)
const rawOffers = ref([])

// --- VARIABLES DE MODELO DE FILTROS ---
const searchQuery = ref('')
const sortBy = ref('default')
const filterSend = ref(null) // Moneda a enviar por defecto
const filterReceive = ref(null) // Moneda a recibir por defecto
const maxRate = ref(5.0) // Sincronizado numéricamente para slider/input
const filterRating = ref(null) // Guarda 'best', 'worst' o null dinámicamente

const currencyOptions = [
  { label: 'Todas las monedas', value: null },
  { label: 'USD - Dólares', value: 'USD' },
  { label: 'PEN - Soles', value: 'PEN' },
  { label: 'EUR - Euros', value: 'EUR' },
]

const sortOptions = [
  { label: 'Todas las monedas', value: null },
  { label: 'Por defecto', value: 'default' },
  { label: 'Menor Tasa', value: 'rate_asc' },
  { label: 'Mayor Tasa', value: 'rate_desc' },
]

const checkIsLoggedIn = () => {
  return !!localStorage.getItem('token')
}

// --- REDIRECCIONES ---
const handlePublishOffer = () => {
  if (checkIsLoggedIn()) {
    router.push('/crear-oferta')
  } else {
    $q.notify({ type: 'warning', message: 'Inicia sesión para publicar.', position: 'top' })
    router.push('/login')
  }
}

const handleExchange = (offerId) => {
  if (checkIsLoggedIn()) {
    router.push({ path: '/ofertaOverview', query: { id: offerId } })
  } else {
    $q.notify({ type: 'warning', message: 'Inicia sesión para intercambiar.', position: 'top' })
    router.push('/login')
  }
}

// --- CONSUMO DE ENDPOINTS ADAPTADO A TU RESPUESTA REAL DE POSTMAN ---
const fetchInitialData = async () => {
  loading.value = true
  try {
    // Ya no necesitas consultar /api/clientes, el DTO de ofertas ya trae esos datos
    const offersResponse = await axios.get(`${baseUrl}/api/ofertas`)

    // Guardamos la respuesta tal cual viene de Postman
    rawOffers.value = offersResponse.data || []
  } catch (error) {
    console.error('Error cargando las ofertas:', error)
  } finally {
    loading.value = false
  }
}

// --- LÓGICA DE FILTRADO Y ORDENAMIENTO EN VUE ---
const filteredOffers = computed(() => {
  // Evaluamos usando la propiedad real 'estado' en minúscula
  let result = rawOffers.value.filter((o) => o.estado === true)

  if (filterSend.value) {
    result = result.filter((o) => o.monedaAEnviar === filterSend.value)
  }

  if (filterReceive.value) {
    result = result.filter((o) => o.monedaARecibir === filterReceive.value)
  }

  if (maxRate.value) {
    result = result.filter((o) => Number(o.tipoCambio) <= Number(maxRate.value))
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (o) =>
        (o.nombreUsuario && o.nombreUsuario.toLowerCase().includes(query)) ||
        (o.monedaAEnviar && o.monedaAEnviar.toLowerCase().includes(query)) ||
        (o.monedaARecibir && o.monedaARecibir.toLowerCase().includes(query))
    )
  }

  if (sortBy.value === 'rate_asc') {
    result.sort((a, b) => a.tipoCambio - b.tipoCambio)
  } else if (sortBy.value === 'rate_desc') {
    result.sort((a, b) => b.tipoCambio - a.tipoCambio)
  }

  // Ordenamiento basado en las llaves correctas de calificación
  if (filterRating.value === 'best') {
    result.sort((a, b) => Number(b.calificacionUsuario) - Number(a.calificacionUsuario))
  } else if (filterRating.value === 'worst') {
    result.sort((a, b) => Number(a.calificacionUsuario) - Number(b.calificacionUsuario))
  }

  return result
})

onMounted(() => {
  fetchInitialData()
})
</script>

<style scoped>
.main-page {
  padding: 24px;
}
.main-container {
  max-width: 1200px;
  margin: 0 auto;
}
.btn-publish {
  background-color: #e0e0e0;
  color: #000000;
  border-radius: 16px;
  padding: 12px 0;
}
.filter-card {
  border-radius: 12px;
  background-color: #ffffff;
}
.filter-label {
  font-size: 0.75rem;
  font-weight: 700;
  display: block;
  margin-bottom: 4px;
  color: #424242;
  margin-top: 8px;
}
.filter-group {
  margin-bottom: 16px;
}
.filter-group-large {
  margin-bottom: 24px;
}

.radio-buttons {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding-top: 5px;
}

/* Estilo unificado para los Radio Buttons ocupando todo el ancho */
.radio-item {
  display: flex;
  margin-bottom: 4px;
}

.offer-card {
  border-radius: 12px;
  background-color: #ffffff;
}
.offer-label {
  font-size: 0.75rem;
  color: #757575;
  margin-top: 4px;
}
.offer-rate {
  font-size: 1.5rem;
  color: #a88463;
}
.offer-amount {
  font-size: 1rem;
}
.offer-timestamp {
  padding: 0 16px;
  text-align: right;
  font-size: 0.75rem;
  margin-bottom: 8px;
}
.btn-exchange {
  background-color: #a88463;
  color: #ffffff;
  padding: 8px 0;
  border-radius: 0 0 12px 12px;
}
</style>
