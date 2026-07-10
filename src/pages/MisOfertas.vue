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
              <q-btn outline class="full-width" style="color: #fbc02d" label="Editar" no-caps />
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
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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
    message: '¿Estás seguro de que deseas eliminar esta oferta? Esta acción no se puede deshacer.',
    persistent: true,
    ok: {
      color: 'negative',
      label: 'Eliminar',
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

      // Hacemos la petición DELETE a .NET
      await api.delete(`/ofertas/${id}`)

      // Si fue exitoso, removemos la tarjeta de la pantalla sin tener que recargar la página
      ofertas.value = ofertas.value.filter((o) => o.id !== id)

      $q.notify({
        type: 'positive',
        message: 'Oferta eliminada correctamente',
        position: 'top',
      })
    } catch (error) {
      $q.notify({
        type: 'negative',
        message: error.response?.data?.mensaje || 'No tienes permiso para eliminar esto',
        position: 'top',
      })
    } finally {
      $q.loading.hide()
    }
  })
}

// Ejecutar cargarOfertas en el milisegundo en que la pantalla se renderiza
onMounted(() => {
  cargarOfertas()
  breadcrumbStore.setHistorial([
    { label: 'Inicio', to: '/' },
    { label: 'Mis Ofertas', to: '/mis-ofertas' },
  ])
})
</script>
