<template>
  <q-page class="bg-grey-2 q-pa-xl">
    <div class="max-width-container q-mx-auto">
      
      <div class="q-mb-lg">
        <h1 class="text-h4 text-weight-bolder text-grey-9 q-my-none">Configuración de Cuenta</h1>
        <p class="text-body1 text-grey-7 q-mt-xs">Ajusta los parámetros de seguridad y alertas de Small Change.</p>
      </div>

      <div class="row q-col-gutter-lg">
        <div class="col-12 col-md-7">
          <q-card flat bordered class="q-pa-md radius-custom bg-white">
            <div class="text-subtitle1 text-weight-bold text-grey-9 q-mb-md">
              <q-icon name="security" size="sm" class="q-mr-xs text-primary" /> Actualizar Contraseña
            </div>
            
            <div class="row q-col-gutter-sm">
              <div class="col-12">
                <q-input dense outlined type="password" v-model="security.current" label="Contraseña Actual" />
              </div>
              <div class="col-12 col-sm-6">
                <q-input dense outlined type="password" v-model="security.new" label="Nueva Contraseña" />
              </div>
              <div class="col-12 col-sm-6">
                <q-input dense outlined type="password" v-model="security.confirm" label="Confirmar Nueva Contraseña" />
              </div>
            </div>
            
            <q-card-actions align="right" class="q-px-none q-pt-md">
              <q-btn color="primary" label="Guardar Contraseña" no-caps class="text-weight-bold" @click="guardarPassword" />
            </q-card-actions>
          </q-card>
        </div>

        <div class="col-12 col-md-5">
          <q-card flat bordered class="q-pa-md radius-custom bg-white full-height">
            <div class="text-subtitle1 text-weight-bold text-grey-9 q-mb-md">
              <q-icon name="notifications" size="sm" class="q-mr-xs text-primary" /> Alertas y Notificaciones
            </div>
            
            <q-list class="text-grey-8">
              <q-item tag="label" v-ripple class="q-px-none">
                <q-item-section>
                  <q-item-label class="text-weight-medium">Alertas por Correo</q-item-label>
                  <q-item-label caption>Notificarme cuando compren mis ofertas</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-toggle v-model="notif.email" color="primary" />
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple class="q-px-none">
                <q-item-section>
                  <q-item-label class="text-weight-medium">Disputas de Concurrencia</q-item-label>
                  <q-item-label caption>Avisarme si pierdo prioridad por antigüedad</q-item-label>
                </q-item-section>
                <q-item-section avatar>
                  <q-toggle v-model="notif.disputas" color="primary" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const security = ref({ current: '', new: '', confirm: '' })
const notif = ref({ email: true, disputas: false })

const guardarPassword = () => {
  if(!security.value.current || !security.value.new) {
    $q.notify({ type: 'negative', message: 'Por favor, llena los campos requeridos.' })
    return
  }
  $q.notify({ type: 'positive', message: 'Contraseña cambiada exitosamente en el sistema.' })
  security.value = { current: '', new: '', confirm: '' }
}
</script>

<style scoped>
.max-width-container { max-width: 1000px; }
.radius-custom { border-radius: 8px; }
</style>