<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-grey-3 text-grey-9 custom-header" bordered>
      <q-toolbar class="full-height q-px-xl">
        <div class="text-weight-bold text-h5 cursor-pointer title-brand" @click="goToHome">
          Small Change
        </div>

        <q-space />

        <q-btn flat label="tipo de cambio" to="/tipo-cambio" class="nav-btn" no-caps />
        <q-btn flat label="mis ofertas" to="/ofertas" class="nav-btn" no-caps />

        <q-btn 
          v-if="!isLoggedIn" 
          flat 
          round 
          icon="account_circle" 
          size="lg" 
          class="q-ml-sm" 
          to="/login" 
        />

        <q-btn v-else flat round class="q-ml-sm">
          <q-avatar size="42px">
            <img src="https://cdn.quasar.dev/img/avatar.png" />
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
                  <q-avatar size="48px">
                    <img src="https://cdn.quasar.dev/img/avatar.png" />
                  </q-avatar>
                </q-item-section>
                <q-item-section>
                  <q-item-label class="text-weight-bold text-body1">Mi Usuario</q-item-label>
                  <q-item-label caption class="text-grey-6">usuario@correo.com</q-item-label>
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

const router = useRouter()
const isLoggedIn = ref(false)

// Verificamos si el usuario está logueado al montar el componente
onMounted(() => {
  isLoggedIn.value = !!localStorage.getItem('token')
})

//click en titulo funcional
const goToHome = () => {
  router.push('/')
}

const cerrarSesion = () => {
  localStorage.removeItem('token')
  isLoggedIn.value = false
  router.push('/').then(() => {
    window.location.reload() // Recarga la página para reflejar el cambio de estado
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
