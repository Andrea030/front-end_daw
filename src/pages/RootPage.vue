<template>
  <HomePage v-if="isLoggedIn" />
  
  <LandingPage v-else />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import HomePage from 'pages/HomePage.vue'
import LandingPage from 'pages/LandingPage.vue'

// Verificamos si existe el token en el localStorage
const isLoggedIn = ref(!!localStorage.getItem('token'))

// Volver a comprobar cuando el componente se monta 
// por si el estado cambió justo antes de cargar
onMounted(() => {
  isLoggedIn.value = !!localStorage.getItem('token')
})
</script>