<template>
  <q-page class="bg-grey-2 flex flex-center q-pa-md">
    
    <q-card v-if="pasoActual === 'pasarela'" style="width: 700px;" class="q-pa-lg shadow-2">
      <div class="text-h5 text-primary text-weight-bold q-mb-md text-center"
        style="padding-bottom: 10px;"
      >
        Formalizar Transacción
      </div>
      
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-8">
          <q-card flat bordered class="q-pa-md bg-white" style="display: flex; flex-direction: column; gap: 5px;">
            <div class="text-weight-bold q-mb-md">Resumen de la Operación:</div>
            <div class="text-subtitle text-grey-8">Nombre de la contraparte: <strong>{{ ofertaData?.nombreUsuario || 'Cargando...' }}</strong></div>
            <div class="text-subtitle3">Monto a entregar: ${{ ofertaData?.cantidad }} USD</div>
            <div class="text-subtitle3">Tasa de Cambio: {{ ofertaData?.tipoCambio }} PEN/USD</div>
          </q-card>
        </div>
        
        <div class="col-12 col-md-4">
          <q-card flat bordered class="q-pa-md bg-white text-center">
            <div class="text-weight-bold text-caption text-grey-7">Tu Billetera</div>
            <div class="text-h6 text-weight-bolder">S/. 4560.00</div>
          </q-card>
        </div>
      </div>

      <div class="text-weight-bold q-mt-lg q-mb-sm">Seleccionar Método de Pago:</div>
      <div class="row q-col-gutter-sm">
        <div 
          class="col-4" 
          v-for="m in ['Tarjeta de Crédito/Débito', 'Saldo de Billetera', 'Yape / Plin']" 
          :key="m"
        >
          <q-card 
            flat 
            bordered 
            class="q-pa-sm text-center cursor-pointer transition-colors"
            :class="metodoSeleccionado === m 
              ? 'bg-blue-1 text-blue-9 text-weight-bold border-blue' 
              : 'bg-white text-grey-8'"
            @click="metodoSeleccionado = m"
          >
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
          Comprobante de Transacción (ID: {{ transaccionId }})
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

const metodoSeleccionado = ref('Saldo de Billetera')

const pasoActual = ref('pasarela') // Estados: 'pasarela' -> 'procesando' -> 'comprobante'
const ofertaData = ref(null)
const mostrarModalCalificacion = ref(false)
const transaccionId = ref(null) //captura el ID devuelto por .NET

const obtenerDetalleOferta = async () => {
  try {
    const response = await api.get(`/ofertas/${route.query.id}`)
    ofertaData.value = response.data
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Error cargando datos de la oferta.' })
  }
}

const procesarPagoAnimacion = async () => {
  if (!ofertaData.value) return

  try {
    pasoActual.value = 'procesando'

    // Recuperamos el ID guardado localmente. 
    // Usamos Number() porque localStorage siempre guarda todo como texto (string)
    const idLocal = localStorage.getItem('userId')
    const clienteCompradorId = idLocal

    // 2. Enviamos el POST real a .NET con tu estructura
    const response = await api.post('/transacciones', {
      OfertaId: ofertaData.value.id,
      ClienteCompradorId: clienteCompradorId,
      estado: 'pendiente'
    })

    transaccionId.value = response.data.id

    await api.patch(`/ofertas/${ofertaData.value.id}/estado`, {
      estado: false // Cambiamos el estado a false para desactivarla/retirarla del mercado
    })
    
    setTimeout(() => {
      pasoActual.value = 'comprobante'
    }, 2000)

    await api.put(`/transacciones/${transaccionId.value}`, {
      estado: "completada" // Cambiamos el estado de la transaccion a completada
    })

  } catch (error) {
    console.error('Error al registrar la transacción:', error)
    pasoActual.value = 'pasarela'
    
    const mensajeError = error.response?.data?.mensaje || 'No se pudo procesar el pago.'
    $q.notify({ type: 'negative', message: mensajeError, position: 'top' })
  }
}

const descargarVoucher = () => {
  $q.notify({ type: 'info', message: 'Descargando comprobante en tu dispositivo...' })
  // Aquí puedes vincular una librería como html2canvas si requieres exportar el div exacto
}

onMounted(() => {
  if (route.query.id) obtenerDetalleOferta()
})
</script>