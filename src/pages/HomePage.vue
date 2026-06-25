<template>
  <q-page class="main-page bg-grey-1">
    <div class="row q-col-gutter-lg justify-center main-container">
      <div class="col-12 col-md-3 column q-gutter-y-md">
        <q-btn
          label="Publicar oferta"
          unelevated
          no-caps
          class="btn-publish text-weight-bold text-subtitle1"
        />

        <q-card flat bordered class="filter-card q-pa-md">
          <div class="text-subtitle1 text-weight-bold text-grey-9 q-mb-md">Filtros</div>

          <div class="filter-group">
            <span class="filter-label">Tipo de divisa</span>
            <q-select
              v-model="filterCurrency"
              :options="currencyOptions"
              outlined
              dense
              emit-value
              map-options
            />
          </div>

          <div class="filter-group-large">
            <span class="filter-label">Rango de precios (PEN)</span>
            <q-slider v-model="priceRange" :min="0" :max="10000" label color="primary" />
            <div class="row justify-between text-caption text-grey-7">
              <span>S/ 0</span>
              <span>S/ 10,000+</span>
            </div>
          </div>

          <div>
            <span class="filter-label">Calificación de usuario</span>
            <q-checkbox
              v-model="filterRating"
              val="best"
              label="Del mejor al peor calificado"
              dense
              class="checkbox-item"
            />
            <q-checkbox
              v-model="filterRating"
              val="worst"
              label="Del peor al mejor calificado"
              dense
              class="checkbox-item"
            />
            <q-checkbox
              v-model="filterVerified"
              val="verified"
              label="Verificados"
              dense
              class="checkbox-item"
            />
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
            />
          </div>
        </div>

        <div>
          <div class="text-subtitle1 text-weight-bold text-grey-9 q-mb-md">Sugerencias</div>

          <div class="row q-col-gutter-md">
            <div v-for="offer in offers" :key="offer.id" class="col-12 col-sm-6 col-md-4">
              <q-card flat bordered class="offer-card column justify-between full-height">
                <q-card-section class="q-pa-md column q-gutter-y-xs">
                  <div class="text-subtitle1 text-weight-bold text-grey-9">
                    Oferta por: {{ offer.user }}
                  </div>

                  <div class="offer-label">TASA DE CAMBIO</div>
                  <div class="offer-rate text-weight-bold">{{ offer.rate }} PEN / USD</div>

                  <div class="offer-label">MONTO TOTAL</div>
                  <div class="offer-amount text-weight-bold text-grey-9">S/ {{ offer.amount }}</div>

                  <div class="offer-label">CALIFICACIÓN</div>
                  <q-icon name="star" color="warning" size="sm" />
                </q-card-section>

                <div class="offer-timestamp text-grey-6 text-uppercase">Hace {{ offer.time }}</div>

                <q-btn
                  label="Intercambiar"
                  unelevated
                  no-caps
                  class="btn-exchange full-width text-weight-bold"
                />
              </q-card>
            </div>
          </div>
        </div>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" unelevated class="btn-fab-add" />
    </q-page-sticky>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const searchQuery = ref('')
const sortBy = ref('')
const filterCurrency = ref('USD_PEN')
const priceRange = ref(5000)
const filterRating = ref([])
const filterVerified = ref(false)

const currencyOptions = [
  { label: 'USD a PEN', value: 'USD_PEN' },
  { label: 'PEN a USD', value: 'PEN_USD' },
]

const sortOptions = ['Menor Tasa', 'Mayor Tasa', 'Monto de menor a mayor']

const offers = ref([
  { id: 1, user: 'Paolo2203', rate: '3.42', amount: '1,880', time: '5 minutos' },
  { id: 2, user: 'Decidueye', rate: '3.42', amount: '67', time: '2 horas' },
])
</script>

<style scoped>
/* --- Contenedores Principales --- */
.main-page {
  padding: 24px;
}

.main-container {
  margin: 0 auto;
}

/* --- Estilos de la Columna Izquierda (Filtros) --- */
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
  font-size: 0.75rem; /* text-caption */
  font-weight: 700;
  display: block;
  margin-bottom: 4px;
  color: #424242;
}

.filter-group {
  margin-bottom: 16px;
}

.filter-group-large {
  margin-bottom: 24px;
}

.checkbox-item {
  display: flex;
  margin-bottom: 8px;
  font-size: 15px; /* text-body2 */
}

/* --- Estilos de las Tarjetas de Ofertas --- */
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
  font-size: 1.5rem; /* text-h5 */
  color: #a88463; /* Color café del mockup */
}

.offer-amount {
  font-size: 1rem; /* text-subtitle1 */
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
  border-radius: 0 0 12px 12px; /* Redondeado solo abajo para acoplarse a la tarjeta */
}

/* --- Componentes Flotantes --- */
.btn-fab-add {
  background-color: #e0e0e0;
  color: #000000;
}
</style>
