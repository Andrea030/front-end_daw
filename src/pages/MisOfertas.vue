<template>
  <q-page padding class="bg-grey-1">
    <div class="row justify-between items-center q-mb-lg">
      <div class="text-h5 text-weight-bold text-dark">Mis Ofertas Activas</div>
      <q-btn
        unelevated
        label="Nueva Oferta"
        icon="add"
        style="background-color: #a87b5d; color: white"
        no-caps
        to="/crear-oferta"
      />
    </div>

    <div v-if="cargando" class="row justify-center q-pa-xl">
      <q-spinner color="primary" size="3em" />
    </div>

    <div v-else-if="ofertas.length === 0" class="row justify-center q-pa-xl text-center">
      <div>
        <q-icon name="inbox" size="4em" color="grey-4" />
        <div class="text-h6 text-grey-6 q-mt-md">Aún no tienes ofertas publicadas</div>
        <div class="text-body2 text-grey-5">
          Haz clic en "Nueva Oferta" para empezar a intercambiar.
        </div>
      </div>
    </div>

    <div v-else class="row q-col-gutter-md">
      <div class="col-12 col-sm-6 col-md-4" v-for="oferta in ofertas" :key="oferta.id">
        <q-card class="shadow-2" style="border-radius: 12px">
          <q-card-section>
            <div class="row justify-between items-center q-mb-sm">
              <q-badge color="positive" rounded class="q-px-sm q-py-xs"> Activa </q-badge>
              <div class="text-caption text-grey-6">
                {{ formatFecha(oferta.fechaCreacion) }}
              </div>
            </div>

            <div class="text-h6 text-weight-bold">
              {{ oferta.cantidad }} {{ oferta.monedaAEnviar }}
              <q-icon name="arrow_forward" class="q-mx-sm" color="grey-6" />
              {{ calcularObtencion(oferta.cantidad, oferta.tipoCambio) }}
              {{ oferta.monedaARecibir }}
            </div>

            <div class="text-subtitle2 text-grey-7 q-mt-sm">
              Tasa: <span class="text-dark text-weight-bold">{{ oferta.tipoCambio }}</span>
            </div>
          </q-card-section>

          <q-separator />

          <q-card-actions align="right">
            <q-btn
              flat
              color="negative"
              icon="delete"
              label="Eliminar"
              no-caps
              @click="confirmarEliminacion(oferta.id)"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'

const $q = useQuasar()

// Variables de estado
const ofertas = ref([])
const cargando = ref(true)

// Función para obtener las ofertas al entrar a la página
const cargarOfertas = async () => {
  try {
    cargando.value = true

    // Llamamos al endpoint GET (Axios inyectará el Token invisiblemente)
    const response = await api.get('/ofertas')

    // Por ahora, guardamos todas las ofertas que devuelva el servidor
    // (A futuro, filtraremos aquí para mostrar solo las del usuario logueado)
    ofertas.value = response.data
  } catch (error) {
    console.error(error)
    $q.notify({
      type: 'negative',
      message: 'Error al cargar las ofertas',
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

// Función para formatear la fecha que viene de SQL Server
const formatFecha = (fechaIso) => {
  if (!fechaIso) return ''
  const fecha = new Date(fechaIso)
  return fecha.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })
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
})
</script>
