<template>
  <q-page class="bg-grey-2 q-pa-xl">
    <div class="max-width-container q-mx-auto">
      
        <q-breadcrumbs active-color="dark" class="text-grey-7" style="padding-bottom: 50px;">
          <q-breadcrumbs-el
            label="Volver"
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

      <q-card flat bordered class="radius-custom q-pa-xl bg-white shadow-sm">
        <q-inner-loading :showing="loading">
          <q-spinner-tail color="primary" size="50px" />
        </q-inner-loading>

        <div v-if="usuario" class="row q-col-gutter-y-lg">
          
            <div class="col-12 col-sm-4">
            <div class="text-caption text-grey-6 text-weight-medium">Nombre de usuario:</div>
            <div class="text-subtitle1 text-weight-bold text-brown-9 q-mt-xs">
                {{ usuario.nombreUsuario || 'Usuario' }}
            </div>
            </div>
            <div class="col-12 col-sm-8">
            <div class="text-caption text-grey-6 text-weight-medium">Nombre:</div>
            <div class="text-subtitle1 text-weight-bold text-brown-9 q-mt-xs">
                {{ usuario.nombre || 'No asignado' }}
            </div>
            </div>

          <div class="col-12"><q-separator class="q-my-sm" opacity="0.4" /></div>

          <div class="col-12 col-sm-4">
            <div class="text-caption text-grey-6 text-weight-medium">Correo electrónico:</div>
            <div class="text-subtitle1 text-weight-bold text-brown-9 q-mt-xs">
              {{ usuario.email || 'sin-correo@smallchange.com' }}
            </div>
          </div>
          <div class="col-12 col-sm-8">
            <div class="text-caption text-grey-6 text-weight-medium">Contraseña:</div>
            <div class="text-subtitle1 text-weight-bold text-brown-9 q-mt-xs text-password">
              ••••••••••••
            </div>
          </div>

          <div class="col-12 q-mt-xl"><q-separator class="q-my-sm" opacity="0.4" /></div>

          <div class="col-12 col-sm-4">
            <div class="text-caption text-grey-7 q-mb-xs">Cambiar tema:</div>
            <q-select dense outlined v-model="preferencias.tema" :options="['Elegir tema', 'Claro', 'Oscuro']" />
          </div>
          <div class="col-12 col-sm-4">
            <div class="text-caption text-grey-7 q-mb-xs">Cambiar divisa predeterminada:</div>
            <q-select dense outlined v-model="preferencias.divisa" :options="['Elegir divisa', 'PEN (S/.)', 'USD ($)']" />
          </div>
          <div class="col-12 col-sm-4">
            <div class="text-caption text-grey-7 q-mb-xs">Cambiar idioma:</div>
            <q-select dense outlined v-model="preferencias.idioma" :options="['Elegir idioma', 'Español', 'English']" />
          </div>
        </div>
      </q-card>

      <div class="row q-col-gutter-md q-mt-lg">
        <div class="col-12 col-sm-6">
          <q-btn 
            outline 
            color="amber-8" 
            label="Cerrar Sesión" 
            class="full-width text-weight-bold q-py-sm radius-custom"
            no-caps
            @click="logout"
          />
        </div>
        <div class="col-12 col-sm-6">
          <q-btn 
            outline 
            color="negative" 
            label="Eliminar Cuenta" 
            class="full-width text-weight-bold q-py-sm radius-custom"
            no-caps
            @click="eliminarCuenta"
          />
        </div>
      </div>

    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'
import { useBreadcrumbStore } from 'stores/breadcrumbStore'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const loading = ref(false)
const usuario = ref(null)
const router = useRouter()

const breadcrumbStore = useBreadcrumbStore()

const volverAtras = () => {
  router.back()
}

const preferencias = ref({
  tema: 'Elegir tema',
  divisa: 'Elegir divisa',
  idioma: 'Elegir idioma'
})

const cargarPerfilUsuario = async () => {
  loading.value = true
  try {
    const idLocal = localStorage.getItem('userId') || '2' // Fallback seguro
    const response = await api.get(`/clientes/${idLocal}`)
    usuario.value = response.data
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Error al recuperar datos del perfil.' })
  } finally {
    loading.value = false
  }
}

const logout = () => {
  localStorage.clear()
  window.location.reload()
}

const eliminarCuenta = () => {
  $q.dialog({
    title: 'Confirmar Acción',
    message: '¿Estás completamente seguro de que deseas eliminar tu cuenta? Esta acción es irreversible.',
    cancel: true,
    persistent: true
  }).onOk(() => {
    $q.notify({ type: 'warning', message: 'Solicitud enviada al administrador.' })
  })
}

onMounted(() => { 
    breadcrumbStore.setHistorial([
        { label: 'Inicio', to: '/' },
        { label: 'Mi Perfil', to: '/mi-perfil' },
    ])

    cargarPerfilUsuario() 
})
</script>

<style scoped>
.max-width-container { max-width: 900px; }
.radius-custom { border-radius: 8px; }
.text-brown-9 { color: #5D4037; }
.text-password { letter-spacing: 3px; }
</style>