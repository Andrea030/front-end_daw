<template>
  <q-page class="bg-grey-2 q-pa-xl">
    <div class="max-width-container q-mx-auto">
      
      <div class="text-subtitle2 text-grey-6 q-mb-md">
        Volver | Inicio > Mi perfil > <span class="text-grey-9 text-weight-bold">Billetera Digital</span>
      </div>

      <div class="q-mb-xl">
        <h1 class="text-h4 text-weight-bolder text-grey-9 q-my-none">Añadir Fondos a tu Billetera Digital</h1>
        <p class="text-body1 text-grey-7 q-mt-xs q-mb-none">
          Tu billetera te permitirá realizar y recibir pagos de manera automática cuando alguna de tus ofertas haya sido aceptada, sin necesidad de estar pendiente de ella.
        </p>
      </div>

      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-8 row q-col-gutter-y-md">
          <div v-for="opcion in montosRecarga" :key="opcion.valor" class="col-12">
            <q-card flat class="bg-gradient-grey text-white q-pa-md flex justify-between items-center radius-custom border-inset shadow-xs">
              <div>
                <div class="text-h5 text-weight-bold">Añadir S/. {{ opcion.valor.toFixed(2) }}</div>
                <div class="text-caption text-grey-4 text-weight-light">{{ opcion.desc }}</div>
              </div>
              <q-btn 
                color="green-6" 
                label="Añadir Fondos" 
                no-caps 
                class="text-weight-bold px-lg" 
                @click="ejecutarRecarga(opcion.valor)"
              />
            </q-card>
          </div>
        </div>

        <div class="col-12 col-md-4">
          <q-card flat class="bg-grey-4 radius-custom overflow-hidden">
            <div class="bg-grey-6 text-white text-weight-bold text-subtitle1 q-pa-md text-uppercase letter-spacing-1">
              Tu Billetera
            </div>
            <q-card-section class="q-pa-md text-grey-9">
              <div class="row justify-between items-center q-py-sm">
                <div class="text-body2 text-weight-medium text-grey-8">Saldo Actual</div>
                <div class="text-subtitle1 text-weight-bolder">S/. {{ saldoActual.toFixed(2) }}</div>
              </div>
              <q-separator q-my-sm />
              <div class="row justify-between items-center q-py-sm">
                <div class="text-body2 text-weight-medium text-grey-8">Última recarga</div>
                <div class="text-subtitle2 text-weight-bold text-grey-7">S/. {{ ultimaRecarga.toFixed(2) }}</div>
              </div>
            </q-card-section>
          </q-card>

          <q-btn 
            flat 
            bg-color="grey-3" 
            label="Volver" 
            color="grey-9" 
            class="full-width q-mt-md radius-custom text-weight-medium"
            no-caps
          />
        </div>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Simulación de estados reactivos basados en el mockup
const saldoActual = ref(67.69)
const ultimaRecarga = ref(75.00)

const montosRecarga = [
  { valor: 15.00, desc: 'Mínimo de fondos' },
  { valor: 30.00, desc: 'Recarga estándar' },
  { valor: 75.00, desc: 'Recarga recomendada' },
  { valor: 150.00, desc: 'Recarga avanzada' },
  { valor: 300.00, desc: 'Máximo por recarga' }
]

const ejecutarRecarga = (monto) => {
  $q.loading.show({ message: 'Procesando pago con pasarela...' })
  
  setTimeout(() => {
    saldoActual.value += monto
    ultimaRecarga.value = monto
    $q.loading.hide()
    
    $q.notify({
      type: 'positive',
      message: `¡Recarga exitosa! Se han añadido S/. ${monto.toFixed(2)} a tu billetera.`,
      position: 'top'
    })
  }, 1200)
}
</script>

<style scoped>
.max-width-container { max-width: 1100px; }
.radius-custom { border-radius: 6px; }
.bg-gradient-grey {
  background: linear-gradient(90deg, #9E9E9E 0%, #757575 100%) !important;
}
.bg-grey-6 { background-color: #757575 !important; }
.bg-grey-4 { background-color: #EEEEEE !important; }
.letter-spacing-1 { letter-spacing: 1px; }
</style>