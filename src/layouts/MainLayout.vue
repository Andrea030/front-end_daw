<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-grey-3 text-grey-9 custom-header" bordered>
      <q-toolbar class="full-height q-px-xl">
        <div class="text-weight-bold text-h5 cursor-pointer title-brand" @click="goToHome">
          Small Change
        </div>
        <q-space />
        <q-btn flat label="tipo de cambio" to="/tipo-cambio" class="nav-btn" no-caps />
        <q-btn flat label="mis ofertas" to="/mis-ofertas" class="nav-btn" no-caps />
        <q-btn flat round class="q-ml-sm">
          <q-avatar color="primary" text-color="white" size="lg" class="text-uppercase">
            {{ usuario.nombreUsuario?.charAt(0) }}
          </q-avatar>
          <q-menu
            transition-show="jump-down"
            transition-hide="jump-up"
            anchor="bottom right"
            self="top right"
            :offset="[0, 10]"
            class="profile-menu"
          >
            <q-list style="min-width: 260px" class="q-py-sm">
              <q-item class="q-pb-md">
                <q-item-section avatar>
                  <q-avatar color="primary" text-color="white" size="md" class="text-uppercase">
                    {{ usuario.nombreUsuario?.charAt(0) }}
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold text-body1">{{usuario.nombreUsuario}}</q-item-label>
                  <q-item-label caption class="text-grey-6">{{usuario.email}}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator class="q-mb-sm" />
              <q-item clickable v-close-popup to="/mi-perfil" class="menu-item">
                <q-item-section avatar class="min-w-0 q-pr-sm">
                  <q-icon name="person_outline" color="grey-8" size="sm" />
                </q-item-section>
                <q-item-section class="text-grey-9">Mi Perfil</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/billetera" class="menu-item">
                <q-item-section avatar class="min-w-0 q-pr-sm">
                  <q-icon name="account_balance_wallet" color="grey-8" size="sm" />
                </q-item-section>
                <q-item-section class="text-grey-9">Billetera Digital</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/historial" class="menu-item">
                <q-item-section avatar class="min-w-0 q-pr-sm">
                  <q-icon name="history" color="grey-8" size="sm" />
                </q-item-section>
                <q-item-section class="text-grey-9">Historial de Operaciones</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/configuracion" class="menu-item">
                <q-item-section avatar class="min-w-0 q-pr-sm">
                  <q-icon name="settings" color="grey-8" size="sm" />
                </q-item-section>
                <q-item-section class="text-grey-9">Configuraciones de Cuenta</q-item-section>
              </q-item>
              <q-separator class="q-my-sm" />
              <q-item clickable v-close-popup @click="cerrarSesion" class="menu-item">
                <q-item-section avatar class="min-w-0 q-pr-sm">
                  <q-icon name="logout" color="grey-8" size="sm" />
                </q-item-section>
                <q-item-section class="text-grey-9">Cerrar Sesión</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>

</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
// Importamos 'api' que ya maneja la URL base e inyecta el Bearer token automáticamente
import { api } from 'src/boot/axios'

const router = useRouter()

const isLoggedIn = ref(false)
const usuario = ref({
  nombreUsuario: '',
  email: ''
})

const fetchUserProfile = async () => {
  const token = localStorage.getItem('token')
  // Leemos el id del usuario plano que guardamos en el localStorage al hacer Login
  const userId = localStorage.getItem('userId') 
  
  if (!token || !userId) {
    isLoggedIn.value = false
    return
  }

  try {
    isLoggedIn.value = true
    
    // Consumimos tu endpoint directo de .NET Core: GET /api/clientes/{id}
    const response = await api.get(`/clientes/${userId}`)

    // Mapeamos las propiedades exactas que retorna tu API
    if (response.data) {
      usuario.value = {
        nombreUsuario: response.data.nombre || 'Usuario', // Propiedad 'nombre' de tu Postman
        email: response.data.email || 'Sin correo'        // Propiedad 'email' de tu Postman
      }
    }
  } catch (error) {
    console.error('Error al cargar el perfil del usuario desde el backend:', error)
    // Nota: Si el token expira (401), el interceptor de tu archivo boot ya maneja la redirección al /login.
  }
}

// Verificamos de forma limpia el estado de la sesión al montar el componente de la aplicación
onMounted(() => {
  const tokenExists = !!localStorage.getItem('token')
  if (tokenExists) {
    fetchUserProfile()
  }
})

const goToHome = () => {
  router.push('/')
}

const cerrarSesion = () => {
  // Limpiamos de forma estricta los datos locales para evitar fugas de estado
  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  
  isLoggedIn.value = false
  usuario.value = { nombreUsuario: '', email: '' }
  
  router.push('/').then(() => {
    window.location.reload() // Fuerza un refresh limpio del DOM para reajustar los botones de la barra
  })
}
</script>

<style scoped>
/* Controla la altura del Navbar global */
.custom-header {
  height: 80px;
}

.title-brand {
  user-select: none;
  transition: opacity 0.2s ease;
}

.title-brand:hover {
  opacity: 0.8; /* Efecto sutil al pasar el mouse */
}

.nav-btn {
  font-size: 1rem;
  letter-spacing: 0.5px;
}

:deep(.profile-menu) {
  border-radius: 12px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid #f0f0f0;
}

.menu-item {
  border-radius: 8px;
  margin: 0 8px;
  transition: background-color 0.2s ease;
}

.menu-item:hover {
  background-color: #f5f5f5;
}

/* Reducir el ancho de la sección del icono para que el texto esté más pegado */
.min-w-0 {
  min-width: 0 !important;
}
</style>
