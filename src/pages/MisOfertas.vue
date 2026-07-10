<template>
  <q-page padding class="bg-grey-1">
    <div class="row justify-start q-mb-lg">
      <q-breadcrumbs active-color="dark" class="text-grey-7">
        <q-breadcrumbs-el
          label="Volver | "
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

    <div class="row justify-between items-center q-mb-xl">
      <div class="text-h5 text-weight-regular text-dark" style="letter-spacing: 0.5px">
        Mis Ofertas Activas
      </div>
    </div>

    <div v-if="cargando" class="row justify-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="ofertas.length === 0" class="row justify-center q-pa-xl text-center">
      <div>
        <q-icon name="inbox" size="4em" color="grey-4" />
        <div class="text-h6 text-grey-6 q-mt-md">Aún no tienes ofertas publicadas</div>
        <div class="text-body2 text-grey-5">
          Haz clic en el botón "+" para empezar a intercambiar.
        </div>
      </div>
    </div>

    <div v-else class="row q-col-gutter-lg">
      <div class="col-12 col-sm-6 col-md-4" v-for="oferta in ofertas" :key="oferta.id">
        <q-card flat bordered style="border-radius: 8px; border-color: #e0e0e0">
          <q-card-section class="q-pb-sm q-pt-md">
            <div class="row items-center">
              <q-icon
                name="circle"
                :color="oferta.estado ? 'positive' : 'negative'"
                size="14px"
                class="q-mr-sm"
              />
              <span class="text-body2 text-grey-9 text-weight-medium">
                {{ oferta.estado ? 'Activo' : 'Finalizada' }}
              </span>
            </div>
          </q-card-section>

          <q-separator inset class="q-mb-sm" />

          <q-card-section class="q-pt-sm">
            <div class="row">
              <div class="col-7">
                <div class="q-mb-md">
                  <div class="text-caption text-grey-8 q-mb-xs">Tipo de cambio:</div>
                  <div class="text-body2 text-weight-bold" style="color: #a87b5d">
                    {{ oferta.tipoCambio }} {{ oferta.monedaARecibir }} / {{ oferta.monedaAEnviar }}
                  </div>
                </div>

                <div class="q-mb-md">
                  <div class="text-caption text-grey-8 q-mb-xs">Monto que daras:</div>
                  <div class="text-body2 text-weight-bold" style="color: #a87b5d">
                    {{ oferta.cantidad }} {{ oferta.monedaAEnviar }}
                  </div>
                </div>

                <div>
                  <div class="text-caption text-grey-8 q-mb-xs">Monto que recibirás:</div>
                  <div class="text-body2 text-weight-bold" style="color: #a87b5d">
                    {{ calcularObtencion(oferta.cantidad, oferta.tipoCambio) }}
                    {{ oferta.monedaARecibir }}
                  </div>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-actions
            v-if="oferta.estado"
            class="q-px-md q-pb-md q-pt-none row q-col-gutter-x-sm"
          >
            <div class="col-6">
              <q-btn
                outline
                class="full-width"
                style="color: #fbc02d"
                label="Editar"
                no-caps
                @click="abrirEdicion(oferta)"
              />
            </div>

            <div class="col-6">
              <q-btn
                outline
                color="negative"
                class="full-width"
                label="Eliminar"
                no-caps
                @click="confirmarEliminacion(oferta.id)"
              />
            </div>
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <q-page-sticky position="bottom-right" :offset="[30, 30]">
      <q-btn
        fab
        icon="add"
        style="background-color: #e0e0e0; color: #424242"
        unelevated
        to="/crear-oferta"
      />
    </q-page-sticky>

    <q-dialog v-model="mostrarDialogoEdicion" persistent>
      <q-card style="min-width: 650px; border-radius: 12px" class="q-pa-sm">
        <q-card-section>
          <div class="text-h6 text-weight-bold text-dark" style="letter-spacing: 0.5px">
            Configuración de la Oferta
          </div>
        </q-card-section>

        <q-separator inset />

        <q-card-section class="q-pt-lg q-pb-md">
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6">
              <div
                class="text-caption text-weight-bold text-grey-8 q-mb-xs text-uppercase"
                style="font-size: 10px"
              >
                Moneda que daras
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-7">
                  <q-select
                    outlined
                    dense
                    bg-color="grey-2"
                    v-model="ofertaEditando.monedaAEnviar"
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
                  />
                </div>
                <div class="col-5">
                  <q-input
                    outlined
                    dense
                    bg-color="grey-2"
                    v-model.number="ofertaEditando.cantidad"
                    type="number"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div class="col-12 col-sm-6">
              <div
                class="text-caption text-weight-bold text-grey-8 q-mb-xs text-uppercase"
                style="font-size: 10px"
              >
                Moneda que recibirás
              </div>
              <div class="row q-col-gutter-sm">
                <div class="col-7">
                  <q-select
                    outlined
                    dense
                    bg-color="grey-2"
                    v-model="ofertaEditando.monedaARecibir"
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
                  />
                </div>
                <div class="col-5">
                  <q-input
                    outlined
                    dense
                    bg-color="grey-2"
                    readonly
                    :model-value="
                      calcularObtencion(ofertaEditando.cantidad, ofertaEditando.tasaCambio)
                    "
                  />
                </div>
              </div>
            </div>

            <div class="col-12 col-sm-6 q-mt-sm">
              <div
                class="text-caption text-weight-bold text-grey-8 q-mb-xs text-uppercase"
                style="font-size: 10px"
              >
                Tasa de cambio
              </div>
              <q-input
                outlined
                dense
                bg-color="grey-2"
                v-model.number="ofertaEditando.tasaCambio"
                type="number"
                min="0"
              >
                <template v-slot:append>
                  <span class="text-caption text-grey-6"
                    >{{ ofertaEditando.monedaARecibir }} / {{ ofertaEditando.monedaAEnviar }}
                  </span>
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>

        <q-card-actions
          class="row justify-between q-pa-md q-mt-sm"
          style="border-top: 1px solid #f5f5f5"
        >
          <div>
            <q-btn
              outline
              color="negative"
              label="Desactivar Oferta"
              no-caps
              class="q-px-md"
              @click="desactivarDesdeModal"
            />
          </div>

          <div class="row q-gutter-sm">
            <q-btn
              flat
              color="dark"
              label="Cancelar"
              no-caps
              class="text-weight-medium"
              v-close-popup
            />
            <q-btn
              unelevated
              label="Actualizar Oferta"
              style="background-color: #a87b5d; color: white"
              no-caps
              class="q-px-md"
              @click="guardarEdicion"
            />
          </div>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { uniRateService } from 'src/services/uniRateService'
import { reactive, ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router' // 1. Faltaba importar el router
import { useBreadcrumbStore } from 'stores/breadcrumbStore' // 2. Faltaba importar tu store

const $q = useQuasar()
const router = useRouter()
const breadcrumbStore = useBreadcrumbStore()

// Variables de estado
const ofertas = ref([])
const cargando = ref(true)

const mostrarDialogoEdicion = ref(false)
// Variables reactivas para el buscador de monedas
const opcionesMonedas = ref([])
const opcionesFiltradas = ref([])

// Función de búsqueda en el selector
const filtrarMonedas = (val, update) => {
  if (val === '') {
    update(() => {
      opcionesFiltradas.value = opcionesMonedas.value
    })
    return
  }

  update(() => {
    const terminoBusqueda = val.toLowerCase()
    opcionesFiltradas.value = opcionesMonedas.value.filter(
      (mo) =>
        mo.label.toLowerCase().indexOf(terminoBusqueda) > -1 ||
        mo.value.toLowerCase().indexOf(terminoBusqueda) > -1,
    )
  })
}
// Objeto reactivo que guardará los datos temporales del formulario
const ofertaEditando = reactive({
  id: null,
  monedaAEnviar: '',
  monedaARecibir: '',
  cantidad: 0,
  tasaCambio: 0,
})

// Función para abrir el modal y cargar los datos de la tarjeta clickeada
const abrirEdicion = (oferta) => {
  ofertaEditando.id = oferta.id
  ofertaEditando.monedaAEnviar = oferta.monedaAEnviar
  ofertaEditando.monedaARecibir = oferta.monedaARecibir
  ofertaEditando.cantidad = oferta.cantidad
  ofertaEditando.tasaCambio = oferta.tipoCambio
  mostrarDialogoEdicion.value = true
}

// Función conectada al botón rojo "Desactivar Oferta" dentro del modal
const desactivarDesdeModal = () => {
  mostrarDialogoEdicion.value = false // Cerramos el modal primero
  confirmarEliminacion(ofertaEditando.id) // Reutilizamos tu función ya existente
}

// Función conectada al botón "Actualizar Oferta"
const guardarEdicion = async () => {
  try {
    $q.loading.show()

    // Armamos el DTO que espera tu backend
    const payload = {
      monedaAEnviar: ofertaEditando.monedaAEnviar,
      monedaARecibir: ofertaEditando.monedaARecibir,
      cantidad: parseFloat(ofertaEditando.cantidad),
      tipoCambio: parseFloat(ofertaEditando.tasaCambio),
    }

    // Petición PUT a .NET
    await api.put(`/ofertas/${ofertaEditando.id}`, payload)

    // Actualizamos la oferta en la vista sin recargar la página
    const index = ofertas.value.findIndex((o) => o.id === ofertaEditando.id)
    if (index !== -1) {
      ofertas.value[index].monedaAEnviar = payload.monedaAEnviar
      ofertas.value[index].monedaARecibir = payload.monedaARecibir
      ofertas.value[index].cantidad = payload.cantidad
      ofertas.value[index].tipoCambio = payload.tipoCambio
    }

    mostrarDialogoEdicion.value = false // Cerramos el popup

    $q.notify({
      type: 'positive',
      message: 'Oferta actualizada exitosamente',
      position: 'top',
    })
  } catch (error) {
    console.error(error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.mensaje || 'Error al actualizar la oferta',
      position: 'top',
    })
  } finally {
    $q.loading.hide()
  }
}
const volverAtras = () => {
  router.back()
}

// Función para obtener las ofertas al entrar a la página
const cargarOfertas = async () => {
  try {
    cargando.value = true

    // CORREGIDO: Apuntamos al endpoint protegido que filtra por el usuario logueado
    const response = await api.get('/ofertas/mis-ofertas')

    // Ahora la variable 'ofertas' solo contendrá tus datos, manteniendo la privacidad
    ofertas.value = response.data
  } catch (error) {
    console.error(error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.mensaje || 'Error al cargar tus ofertas',
      position: 'top',
    })
  } finally {
    cargando.value = false
  }
}

// Función para calcular dinámicamente cuánto se obtiene
const calcularObtencion = (cantidad, tasa) => {
  return (cantidad * tasa).toFixed(2)
}

// Lógica para eliminar la oferta (Conectada a tu [HttpDelete("{id}")] de OfertasController)
const confirmarEliminacion = (id) => {
  $q.dialog({
    title: 'Confirmar Eliminación',
    message: '¿Estás seguro de que deseas desactivar esta oferta? Ya no aparecerá como activa.',
    persistent: true,
    ok: {
      color: 'negative',
      label: 'Desactivar',
      noCaps: true,
    },
    cancel: {
      color: 'grey-8',
      flat: true,
      label: 'Cancelar',
      noCaps: true,
    },
  }).onOk(async () => {
    try {
      $q.loading.show()

      await api.patch(`/ofertas/${id}/estado`, {
        estado: false,
      })

      const ofertaModificada = ofertas.value.find((o) => o.id === id)

      if (ofertaModificada) {
        ofertaModificada.estado = false
      }

      $q.notify({
        type: 'positive',
        message: 'Oferta finalizada correctamente',
        position: 'top',
      })
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.mensaje || 'Error al actualizar la oferta',
        position: 'top',
      })
    } finally {
      $q.loading.hide()
    }
  })
}

// Ejecutar cargarOfertas en el milisegundo en que la pantalla se renderiza
onMounted(async () => {
  cargarOfertas()
  breadcrumbStore.setHistorial([
    { label: 'Inicio', to: '/' },
    { label: 'Mis Ofertas', to: '/mis-ofertas' },
  ])
  try {
    const monedas = await uniRateService.obtenerMonedasDisponibles()
    opcionesMonedas.value = monedas
    opcionesFiltradas.value = monedas
  } catch (error) {
    console.error('Error al cargar divisas para el modal:', error)
  }
})
</script>
