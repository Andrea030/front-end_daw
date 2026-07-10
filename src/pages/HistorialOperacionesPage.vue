<template>
  <q-page class="bg-grey-2 q-pa-lg">
    <div class="max-width-container q-mx-auto">
      
      <div class="q-mb-xl">
        <h1 class="text-h4 text-weight-bolder text-grey-9 q-my-none">Historial de Operaciones</h1>
        <p class="text-body1 text-grey-7 q-mt-xs q-mb-none">
          Gestiona y descarga los comprobantes de tus transacciones realizadas.
        </p>
      </div>

      <q-card flat class="bg-brown-6 text-white q-pa-md q-mb-lg radius-custom">
        <div class="row q-col-gutter-md items-center">
          <div class="col-12 col-sm-4">
            <div class="text-caption text-weight-bold q-mb-xs text-uppercase text-brown-2">Tipo de Operación</div>
            <q-select 
              v-model="filtroAccion" 
              :options="['Todas las operaciones', 'CREAR', 'ACTUALIZAR_ESTADO']" 
              dense 
              filled 
              bg-color="white" 
              emit-value
              map-options
            />
          </div>
          <div class="col-12 col-sm-4">
            <div class="text-caption text-weight-bold q-mb-xs text-uppercase text-brown-2">Estado</div>
            <q-select 
              v-model="filtroEstado" 
              :options="['Todos los estados', 'pendiente', 'completada', 'finalizado']" 
              dense 
              filled 
              bg-color="white" 
            />
          </div>
          <div class="col-12 col-sm-4 text-right self-end">
            <q-btn 
              color="white" 
              text-color="brown-9" 
              label="Exportar Reporte" 
              icon="download" 
              no-caps 
              class="text-weight-bold full-width" 
            />
          </div>
        </div>
      </q-card>

      <q-card flat class="radius-custom shadow-sm overflow-hidden">
        <q-table
          :rows="operacionesFiltradas"
          :columns="columns"
          row-key="id"
          :loading="loading"
          flat
          bordered
          :pagination="{ rowsPerPage: 10 }"
          no-data-label="No se encontraron registros en tu historial"
          loading-label="Cargando operaciones desde el sistema..."
        >
          <template v-slot:body-cell-fecha="props">
            <q-td :props="props">
              {{ formatearFecha(props.row.fechaAccion) }}
            </q-td>
          </template>

          <template v-slot:body-cell-accion="props">
            <q-td :props="props" class="text-weight-bold">
              <q-chip 
                dense 
                :color="props.row.accion === 'CREAR' ? 'blue-1' : 'purple-1'" 
                :text-color="props.row.accion === 'CREAR' ? 'blue-9' : 'purple-9'"
              >
                {{ props.row.accion }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-estado="props">
            <q-td :props="props" class="text-center">
              <q-chip
                v-if="props.row.estadoNuevo"
                dense
                class="text-weight-bold text-uppercase px-md text-caption"
                :color="obtenerColorEstado(props.row.estadoNuevo).bg"
                :text-color="obtenerColorEstado(props.row.estadoNuevo).text"
              >
                {{ props.row.estadoNuevo }}
              </q-chip>
              <span v-else class="text-grey-5">—</span>
            </q-td>
          </template>

          <template v-slot:body-cell-opciones="props">
            <q-td :props="props" class="text-center">
              <q-btn
                flat
                round
                color="primary"
                icon="visibility"
                dense
                @click="verDetalleTransaccion(props.row.transaccionId)"
              >
                <q-tooltip>Ver Detalle Seguro</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card>

      <q-dialog v-model="dialogoDetalle">
        <q-card style="width: 500px; max-width: 90vw;" class="q-pa-md radius-custom">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6 text-weight-bold text-grey-9">Detalle de Transacción #{{ detalleTransaccion?.id }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section class="q-mt-md" v-if="detalleTransaccion">
            <div class="bg-grey-1 q-pa-md radius-custom border-light">
              <div class="row q-col-gutter-sm text-body2">
                <div class="col-6 text-grey-7">ID de Oferta:</div>
                <div class="col-6 text-weight-bold text-right">{{ detalleTransaccion.ofertaId }}</div>
                
                <div class="col-6 text-grey-7">Comprador Asociado:</div>
                <div class="col-6 text-weight-bold text-right">Usuario #{{ detalleTransaccion.clienteCompradorId }}</div>
                
                <div class="col-6 text-grey-7">Estado de Registro:</div>
                <div class="col-6 text-right">
                  <q-chip dense :color="obtenerColorEstado(detalleTransaccion.estado).bg" :text-color="obtenerColorEstado(detalleTransaccion.estado).text" class="text-weight-bold text-uppercase">
                    {{ detalleTransaccion.estado }}
                  </q-chip>
                </div>

                <div class="col-12"><q-separator class="q-my-sm" /></div>

                <div class="col-6 text-grey-7">Fecha de Creación:</div>
                <div class="col-6 text-right text-caption text-grey-9">
                  {{ formatearFecha(detalleTransaccion.fechaCreacion) }}
                </div>
              </div>
            </div>
          </q-card-section>
          
          <q-card-actions align="right" class="q-pt-md">
            <q-btn flat label="Cerrar" color="grey-7" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useQuasar } from 'quasar'
import { api } from 'boot/axios' // Tu instancia Axios configurada con interceptor para Token Bearer

const $q = useQuasar()

// Estados y Datos
const listaAuditoria = ref([])
const loading = ref(false)
const filtroAccion = ref('Todas las operaciones')
const filtroEstado = ref('Todos los estados')

// Diálogo de Inspección por ID
const dialogoDetalle = ref(false)
const detalleTransaccion = ref(null)

// Configuración de Columnas de la Tabla (Haciendo match con tu respuesta JSON)
const columns = [
  { name: 'id', label: 'ID AUDITORÍA', field: 'id', align: 'left', sortable: true },
  { name: 'transaccionId', label: 'ID TX', field: 'transaccionId', align: 'left', sortable: true },
  { name: 'fecha', label: 'FECHA Y HORA', field: 'fechaAccion', align: 'left', sortable: true },
  { name: 'accion', label: 'ACCIÓN', field: 'accion', align: 'left' },
  { name: 'estadoAnterior', label: 'ESTADO ANTERIOR', field: 'estadoAnterior', align: 'left', format: val => val || 'Ninguno' },
  { name: 'estado', label: 'ESTADO MÁS RECIENTE', field: 'estadoNuevo', align: 'center' },
  { name: 'opciones', label: 'ACCIONES', field: 'opciones', align: 'center' }
]

// Consumir el endpoint seguro 'api/transacciones/auditoria/mi-historial'
const cargarHistorial = async () => {
  loading.value = true
  try {
    const response = await api.get('/transacciones/auditoria/mi-historial')
    listaAuditoria.value = response.data
  } catch (error) {
    console.error('Error al traer auditorías:', error)
    $q.notify({
      type: 'negative',
      message: 'No se pudo recuperar tu historial. Inicia sesión de nuevo.',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}

// Consumir el endpoint por ID seguro (Soporta validación de pertenencia en backend)
const verDetalleTransaccion = async (id) => {
  $q.loading.show({ message: 'Validando permisos de transacción...' })
  try {
    const response = await api.get(`/transacciones/${id}`)
    detalleTransaccion.value = response.data
    dialogoDetalle.value = true
  } catch (error) {
    console.error('Error al recuperar por ID:', error)
    if (error.response?.status === 403) {
      $q.notify({
        type: 'negative',
        message: 'Acceso Denegado: No tienes permisos para inspeccionar esta transacción.',
        position: 'top'
      })
    } else {
      $q.notify({ type: 'negative', message: 'Error al cargar el detalle.' })
    }
  } finally {
    $q.loading.hide()
  }
}

// Lógica de filtrado en el cliente
const operacionesFiltradas = computed(() => {
  return listaAuditoria.value.filter(item => {
    const cumpleAccion = filtroAccion.value === 'Todas las operaciones' || item.accion === filtroAccion.value
    const cumpleEstado = filtroEstado.value === 'Todos los estados' || item.estadoNuevo === filtroEstado.value
    return cumpleAccion && cumpleEstado
  })
})

// Mapeador de estilos estéticos para los chips según tu Mockup
const obtenerColorEstado = (estado) => {
  switch (estado?.toLowerCase()) {
    case 'completada':
    case 'finalizado':
      return { bg: 'green-1', text: 'green-9' }
    case 'pendiente':
    case 'en proceso':
      return { bg: 'amber-1', text: 'amber-9' }
    case 'cancelada':
      return { bg: 'red-1', text: 'red-9' }
    default:
      return { bg: 'grey-3', text: 'grey-8' }
  }
}

// Formateador de fechas legible
const formatearFecha = (stringFecha) => {
  if (!stringFecha) return ''
  const fecha = new Date(stringFecha)
  return fecha.toLocaleString('es-PE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

onMounted(() => {
  cargarHistorial()
})
</script>

<style scoped>
.max-width-container {
  max-width: 1100px;
}
.radius-custom {
  border-radius: 12px;
}
.bg-brown-6 {
  background-color: #8D6E63 !important; /* El color café de cabecera de tus tablas */
}
.text-brown-2 {
  color: #D7CCC8 !important;
}
.border-light {
  border: 1px solid #e0e0e0;
}
</style>