<template>
  <q-page class="bg-grey-1 q-pa-lg flex flex-center">
    <div style="max-width: 800px; width: 100%;">
      
      <div class="q-mb-md text-subtitle2 text-grey-6 row items-center q-gutter-xs">
        <span class="cursor-pointer text-hover" @click="$router.go(-1)">Volver</span>
        <span>|</span>
        <span class="cursor-pointer text-hover" @click="$router.push('/')">Inicio</span>
        <q-icon name="chevron_right" />
        <span>Explorar</span>
        <q-icon name="chevron_right" />
        <span class="text-weight-bold text-dark">Mi perfil</span>
      </div>

      <q-card flat bordered class="profile-card q-pa-lg shadow-1 position-relative">
        
        <q-inner-loading :showing="loading" color="primary" label="Cargando perfil..." />

        <template v-if="!loading && cliente">
          <q-card-section class="row items-center q-pb-md q-pt-none">
            <q-avatar size="90px" color="teal-1" text-color="teal-8" icon="account_circle" class="q-mr-lg shadow-1" />
            
            <div>
              <div class="text-h5 text-weight-bold text-dark">{{ cliente.nombre }}</div>
              
              <div class="row items-center q-mt-sm q-gutter-x-md">
                <div class="row items-center">
                  <q-rating v-model="cliente.promedioCalificacionComprador" size="18px" color="amber" icon="star" readonly />
                  <span class="text-caption text-grey-8 q-ml-xs">Comprador ({{ cliente.promedioCalificacionComprador }})</span>
                </div>
                <q-separator vertical inset />
                <div class="row items-center">
                  <q-rating v-model="cliente.calificacionVendedor" size="18px" color="teal" icon="star" readonly />
                  <span class="text-caption text-grey-8 q-ml-xs">Vendedor ({{ cliente.calificacionVendedor }})</span>
                </div>
              </div>
            </div>
          </q-card-section>

          <q-separator class="q-my-md" />

          <q-card-section class="q-pt-none">
            <q-form @submit.prevent="handleUpdate">
              <div class="row q-col-gutter-md">
                
                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="form.nombre"
                    label="Nombre completo"
                    outlined
                    dense
                    :readonly="!isEditing"
                    :borderless="!isEditing"
                    :bg-color="isEditing ? 'white' : 'grey-2'"
                    :rules="[val => !!val || 'El nombre es requerido']"
                    hide-bottom-space
                  />
                </div>

                <div class="col-12 col-sm-6">
                  <q-input
                    v-model="form.email"
                    label="Correo electrónico"
                    type="email"
                    outlined
                    dense
                    :readonly="!isEditing"
                    :borderless="!isEditing"
                    :bg-color="isEditing ? 'white' : 'grey-2'"
                    :rules="[val => !!val || 'El correo es requerido']"
                    hide-bottom-space
                  />
                </div>

                <div class="col-12">
                  <q-input
                    :model-value="formatDate(cliente.fechaRegistro)"
                    label="Usuario desde"
                    outlined
                    dense
                    disable
                    bg-color="grey-3"
                  />
                </div>

              </div>

              <div class="row q-mt-xl justify-start">
                <div v-if="!isEditing">
                  <q-btn
                    label="Editar"
                    outline
                    color="amber-8"
                    text-color="amber-9"
                    icon="edit"
                    class="text-weight-bold px-lg btn-edit"
                    @click="isEditing = true"
                  />
                </div>
                <div v-else class="row q-gutter-sm">
                  <q-btn
                    label="Guardar Cambios"
                    type="submit"
                    color="positive"
                    icon="check"
                    :loading="saving"
                  />
                  <q-btn
                    label="Cancelar"
                    flat
                    color="negative"
                    @click="cancelEditing"
                  />
                </div>
              </div>

            </q-form>
          </q-card-section>
        </template>
      </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'src/stores/auth-store'

const $q = useQuasar()
const authStore = useAuthStore()

const loading = ref(true)
const isEditing = ref(false)
const saving = ref(false)

// Mapea directamente con ClienteResponseDTO del backend
const cliente = ref(null)

// Campos editables vinculados a UpdateClienteDTO
const form = ref({
  nombre: '',
  email: ''
})

const fetchProfile = async () => {
  // ◄ COMENTA O BORRA ESTAS LÍNEAS TEMPORALMENTE PARA QUE DEJE DE VALIDAR EL LOGIN:
  /*
  if (!authStore.userId) {
    $q.notify({ type: 'negative', message: 'Inicia sesión para ver tu perfil.' })
    loading.value = false
    return
  }
  */
  try {
    loading.value = true
    
    // --- MOCK TEMPORAL PARA PRUEBAS LOCALES ---
    await new Promise(resolve => setTimeout(resolve, 800))
    cliente.value = {
      id: authStore.userId || 1,
      nombre: 'Paolo Cristhian Nicho Vera',
      email: 'paolo.nicho@example.com',
      promedioCalificacionComprador: 4.5,
      calificacionVendedor: 3.0,
      fechaRegistro: '2025-03-15T00:00:00Z'
    }
    // ------------------------------------------

    form.value.nombre = cliente.value.nombre
    form.value.email = cliente.value.email
  } catch { 
    $q.notify({ type: 'negative', message: 'Error al recuperar perfil.' })
  } finally { 
    loading.value = false
  }
}

onMounted(() => {
  fetchProfile()
})

const cancelEditing = () => {
  isEditing.value = false
  form.value.nombre = cliente.value.nombre
  form.value.email = cliente.value.email
}

const handleUpdate = async () => {
  saving.value = true
  try {
    const updateDto = {
      nombre: form.value.nombre,
      email: form.value.email,
      passHash: null,
      promedioCalificacionComprador: null,
      calificacionVendedor: null
    }

    // Console log usando el objeto para evitar advertencias de ESLint
    console.log('DTO preparado para mandar al backend:', updateDto)

    // Simulación de éxito de red (204 NoContent)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    $q.notify({ type: 'positive', message: '¡Perfil actualizado con éxito!' })
    
    cliente.value.nombre = form.value.nombre
    cliente.value.email = form.value.email
    isEditing.value = false
  } catch { 
    $q.notify({ type: 'negative', message: 'No se pudieron guardar los cambios.' })
  } finally {
    saving.value = false
  }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).getFullYear().toString()
}
</script>

<style lang="scss" scoped>
.profile-card {
  border-radius: 16px;
  background-color: #ffffff;
}

.text-hover:hover {
  text-decoration: underline;
  color: var(--q-primary);
}

.btn-edit {
  border-radius: 6px;
}

:deep(.q-field--readonly.q-field--borderless) {
  .q-field__control {
    padding: 0 !important;
    &:before {
      border-bottom: none !important;
    }
  }
}
</style>