<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-grey-3 text-grey-9" bordered>
      <q-toolbar>
        <q-toolbar-title class="text-weight-bold"> Small Change </q-toolbar-title>

        <q-btn flat label="Tipo de cambio" />
        <q-btn flat label="Ofertas" />
        <q-btn flat label="LOG IN" to="/login" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
// POR MIENTRAS SOLO PA QUE FUNCIONE WUHU
</script>
