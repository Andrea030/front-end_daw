<template>
  <q-page class="bg-grey-2 flex flex-center q-pa-md">
    
    <q-card v-if="pasoActual === 'pasarela'" style="width: 700px;" class="q-pa-lg shadow-2">
      <div class="text-h5 text-primary text-weight-bold q-mb-md text-center">
        Formalizar Transacción
      </div>
      
      <div class="bg-blue-1 text-blue-9 text-center q-pa-sm rounded-borders text-subtitle1 text-weight-bold q-mb-md">
        ⏱️ Tiempo de reserva restante: 14:59
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-8">
          <q-card flat bordered class="q-pa-md bg-white">
            <div class="text-weight-bold q-mb-xs">Resumen de la Operación:</div>
            <div class="text-caption text-grey-8">Vendedor ID: {{ ofertaData?.clienteId || 'Cargando...' }}</div>
            <div class="text-subtitle2">Monto a entregar: ${{ ofertaData?.cantidad }} USD</div>
            <div class="text-subtitle2">Tasa de Cambio: {{ ofertaData?.tipoCambio }} PEN/USD</div>
          </q-card>
        </div>
        
        <div class="col-12 col-md-4">
          <q-card flat bordered class="q-pa-md bg-white text-center">
            <div class="text-weight-bold text-caption text-grey-7">Tu Billetera</div>
            <div class="text-h6 text-weight-bolder">S/. 120.00</div>
          </q-card>
        </div>
      </div>

      <div class="text-weight-bold q-mt-lg q-mb-sm">Seleccionar Método de Pago:</div>
      <div class="row q-col-gutter-sm">
        <div class="col-4" v-for="m in ['Tarjeta de Crédito/Débito', 'Saldo de Billetera', 'Yape / Plin']" :key="m">
          <q-card flat bordered class="q-pa-sm text-center cursor-pointer hover-blue" :class="{'bg-blue-1 border-blue': m.includes('Billetera')}">
            <div class="text-caption text-weight-medium">{{ m }}</div>
          </q-card>
        </div>
      </div>

      <div class="q-mt-xl row justify-between">
        <q-btn label="Volver" color="grey" flat @click="$router.push('/')" />
        <q-btn label="Formalizar Transacción" color="positive" class="text-weight-bold" @click="procesarPagoAnimacion" />
      </div>
    </q-card>

    <q-card v-if="pasoActual === 'procesando'" style="width: 450px;" class="q-pa-xl text-center shadow-0 bg-transparent">
      <q-spinner-cube color="primary" size="6em" />
      <div class="text-h6 text-weight-bold q-mt-md text-grey-9">Procesando tu pago de forma segura...</div>
      <p class="text-grey-6 text-caption">No cierres ni refresques esta ventana</p>
    </q-card>

    <q-card v-if="pasoActual === 'comprobante'" style="width: 650px;" class="q-pa-lg shadow-3 bg-white">
      <div class="text-center q-mb-md">
        <q-icon name="check_circle" color="positive" size="4em" />
        <div class="text-h5 text-weight-bold text-grey-9">¡Transacción Completada!</div>
      </div>

      <div id="voucher-print" class="border-grey q-pa-md bg-grey-1 rounded-borders">
        <div class="text-subtitle2 text-center text-weight-bold q-mb-md text-uppercase text-grey-7">
          Comprobante de Transacción (ID: TRX-{{ Math.floor(Math.random() * 90000) + 10000 }})
        </div>
        <q-separator class="q-mb-md" />
        <div class="row q-col-gutter-sm text-subtitle2">
          <div class="col-6"><strong>Monto Entregado:</strong> ${{ ofertaData?.cantidad }} USD</div>
          <div class="col-6"><strong>Tasa de Cambio:</strong> {{ ofertaData?.tipoCambio }} PEN</div>
          <div class="col-12"><q-separator flat class="q-my-xs"/></div>
          <div class="col-12 text-grey-8 text-caption text-center">Fecha y Hora: {{ new Date().toLocaleString() }}</div>
        </div>
      </div>

      <div class="q-mt-lg row q-gutter-sm justify-center">
        <q-btn label="Descargar como Imagen (.png)" color="brown-5" outline icon="download" @click="descargarVoucher" />
        <q-btn label="Continuar" color="brown-5" class="text-weight-bold text-white" @click="mostrarModalCalificacion = true" />
      </div>
    </q-card>

    <CalificarTransaccionDialog 
      v-if="mostrarModalCalificacion && ofertaData" 
      :vendedorId="ofertaData.clienteId" 
    />

  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'
import CalificarTransaccionDialog from 'components/CalificarTransaccionDialog.vue'

const $q = useQuasar()
const route = useRoute()

const pasoActual = ref('pasarela') // Estados: 'pasarela' -> 'procesando' -> 'comprobante'
const ofertaData = ref(null)
const mostrarModalCalificacion = ref(false)

const obtenerDetalleOferta = async () => {
  try {
    const response = await api.get(`/ofertas/${route.query.id}`)
    ofertaData.value = response.data
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Error cargando datos de la oferta.' })
  }
}

const procesarPagoAnimacion = () => {
  pasoActual.value = 'procesando'
  // Simulamos la espera de procesamiento de la pasarela por 3 segundos (como Rappi)
  setTimeout(() => {
    pasoActual.value = 'comprobante'
  }, 3000)
}

const descargarVoucher = () => {
  $q.notify({ type: 'info', message: 'Descargando comprobante en tu dispositivo...' })
  // Aquí puedes vincular una librería como html2canvas si requieres exportar el div exacto
}

onMounted(() => {
  if (route.query.id) obtenerDetalleOferta()
})
</script>