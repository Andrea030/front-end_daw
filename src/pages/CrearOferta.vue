<template>
  <q-page padding class="bg-grey-1">
    <div class="row justify-center q-mb-md">
      <div class="col-12 col-md-8 col-lg-6">
        <q-breadcrumbs active-color="dark" class="text-grey-7 q-mb-lg">
          <q-breadcrumbs-el label="Volver" icon="arrow_back" class="cursor-pointer" />
          <q-breadcrumbs-el label="Inicio" />
          <q-breadcrumbs-el label="Explorar" />
          <q-breadcrumbs-el label="Ofertas" />
          <q-breadcrumbs-el label="Publica Oferta" class="text-weight-bold" />
        </q-breadcrumbs>
      </div>
    </div>

    <div class="row justify-center">
      <div class="col-12 col-md-8 col-lg-6">
        <q-card class="q-pa-md shadow-2" style="border-radius: 12px">
          <q-card-section>
            <div class="text-h6 text-weight-bold text-dark q-mb-sm">Detalles de la Oferta</div>
            <q-separator class="q-mb-lg" />

            <div class="text-subtitle2 text-grey-8 q-mb-sm">Tipo de Transacción</div>
            <q-btn-toggle
              v-model="formulario.tipoTransaccion"
              spread
              no-caps
              rounded
              unelevated
              toggle-color="primary"
              color="grey-2"
              text-color="grey-8"
              :options="[
                { label: 'Compra', value: 'compra' },
                { label: 'Venta', value: 'venta' },
              ]"
              class="q-mb-lg"
            />

            <div class="row q-col-gutter-md q-mb-md">
              <div class="col-12 col-sm-6">
                <div class="text-subtitle2 text-grey-8 q-mb-sm">Tengo</div>
                <q-select
                  outlined
                  v-model="formulario.monedaTengo"
                  :options="opcionesMonedas"
                  option-label="label"
                  option-value="value"
                  dense
                />
              </div>
              <div class="col-12 col-sm-6">
                <div class="text-subtitle2 text-grey-8 q-mb-sm">Quiero</div>
                <q-select
                  outlined
                  v-model="formulario.monedaQuiero"
                  :options="opcionesMonedas"
                  option-label="label"
                  option-value="value"
                  dense
                />
              </div>
            </div>

            <div class="row q-col-gutter-md q-mb-lg">
              <div class="col-12 col-sm-6">
                <div class="text-subtitle2 text-grey-8 q-mb-sm">Cantidad a intercambiar</div>
                <q-input
                  outlined
                  v-model.number="formulario.cantidad"
                  type="number"
                  dense
                  :suffix="formulario.monedaTengo.value"
                />
              </div>
              <div class="col-12 col-sm-6">
                <div class="text-subtitle2 text-grey-8 q-mb-sm">Tasa de cambio</div>
                <q-input
                  outlined
                  v-model.number="formulario.tasaCambio"
                  type="number"
                  dense
                  :suffix="`${formulario.monedaQuiero.value}/${formulario.monedaTengo.value}`"
                  bottom-slots
                >
                  <template v-slot:hint>
                    <span class="text-grey-7">Esta tasa es muy baja</span>
                  </template>
                </q-input>
              </div>
            </div>
          </q-card-section>

          <q-card-actions align="right" class="q-pt-none q-px-md q-pb-md">
            <q-btn flat label="Cancelar" color="grey-8" no-caps class="q-mr-sm" />
            <q-btn
              unelevated
              label="Publicar Oferta"
              style="background-color: #a87b5d; color: white"
              no-caps
              @click="prepararPublicacion"
            />
          </q-card-actions>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { reactive } from 'vue'

// Opciones de moneda estructuradas para que el sufijo de los inputs sea dinámico
const opcionesMonedas = [
  { label: 'USD - Dólares', value: 'USD' },
  { label: 'EUR - Euro', value: 'EUR' },
  { label: 'PEN - Soles', value: 'PEN' },
]

// Estado reactivo del formulario
const formulario = reactive({
  tipoTransaccion: 'compra',
  monedaTengo: opcionesMonedas[0],
  monedaQuiero: opcionesMonedas[1],
  cantidad: 1000.0,
  tasaCambio: 1.17,
})

// Función temporal para probar en consola antes de conectar Axios
const prepararPublicacion = () => {
  const payload = {
    tipoTransaccion: formulario.tipoTransaccion,
    monedaAEnviar: formulario.monedaTengo.value,
    monedaARecibir: formulario.monedaQuiero.value,
    tipoCambio: formulario.tasaCambio,
    cantidad: formulario.cantidad,
  }

  console.log('JSON listo para enviar a tu DTO en .NET:', payload)
}
</script>
