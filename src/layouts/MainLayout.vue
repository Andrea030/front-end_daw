<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-grey-3 text-grey-9 q-py-sm" flat bordered>
      <q-toolbar class="q-px-xl">
        
        <q-toolbar-title 
          class="text-h5 text-weight-regular cursor-pointer text-dark font-brand"
          @click="$router.push('/')"
        >
          Small Change
        </q-toolbar-title>

        <div class="row items-center q-gutter-x-lg">
          <q-btn 
            flat 
            no-caps 
            label="tipo de cambio" 
            class="text-weight-bold text-subtitle1" 
            to="/" 
          />
          
          <q-btn 
            flat 
            no-caps 
            label="mis ofertas" 
            class="text-weight-bold text-subtitle1" 
            to="/ofertas" 
          />

          <q-btn 
            v-if="!authStore.isLoggedIn"
            flat 
            no-caps 
            label="LOG IN" 
            class="text-weight-bold text-subtitle1 bg-white text-primary q-px-md shadow-1" 
            to="/login" 
          />

          <q-btn 
            v-else
            flat 
            round 
            to="/perfil"
            class="avatar-button"
          >
            <q-avatar size="44px" color="white" text-color="grey-8" icon="person" class="shadow-1" />
            <q-tooltip>Mi Perfil</q-tooltip>
          </q-btn>
        </div>

      </q-toolbar>
    </q-header>

    <q-page-container class="bg-white">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useAuthStore } from 'src/stores/auth-store'

// Instanciamos el store de autenticación para controlar si se muestra el avatar o el botón de Login
const authStore = useAuthStore()
</script>

<style lang="scss" scoped>
// Tipografía y estilos personalizados del Header
.font-brand {
  font-family: 'Inter', '-apple-system', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  letter-spacing: 0.5px;
}

// Botones de navegación en minúsculas/estilo limpio
:deep(.q-btn) {
  letter-spacing: 0.2px;
  
  .q-btn__content {
    color: #1d1d1d; // Color exacto para simular el diseño moderno
  }
}

// Estilo del Avatar para que reaccione elegantemente al pasar el cursor (Hover)
.avatar-button {
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.05);
  }
}
</style>
