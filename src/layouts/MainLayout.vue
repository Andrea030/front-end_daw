<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-grey-3 text-grey-9 custom-header" bordered>
      <q-toolbar class="full-height q-px-xl">
        <div class="text-weight-bold text-h5 cursor-pointer title-brand" @click="goToHome">
          Small Change
        </div>

        <q-space />

        <q-btn flat label="tipo de cambio" class="nav-btn" />
        <q-btn flat label="mis ofertas" class="nav-btn" />

        <q-btn flat round icon="account_circle" size="lg" class="q-ml-sm" to="/login" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

// Función para redirigir a la página de inicio al hacer click en el título
const goToHome = () => {
  router.push('/')
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
}
</style>
