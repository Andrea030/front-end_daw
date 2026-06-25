<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-grey-9">
      <q-toolbar>
        <q-btn flat dense round icon="menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title>Panel Administrativo</q-toolbar-title>
        <q-btn flat label="Salir" @click="logout" />
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-2">
      <q-list>
        <q-item-label header>Menu</q-item-label>
        
        <q-item clickable v-ripple>
          <q-item-section avatar><q-icon name="dns" /></q-item-section>
          <q-item-section>Servidor</q-item-section>
        </q-item>
        
        <q-item clickable v-ripple>
          <q-item-section avatar><q-icon name="people" /></q-item-section>
          <q-item-section>Usuarios</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar><q-icon name="template" /></q-item-section>
          <q-item-section>Database</q-item-section>
        </q-item>

        <q-item clickable v-ripple>
          <q-item-section avatar><q-icon name="template" /></q-item-section>
          <q-item-section>Inbox</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view /> </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue'
const leftDrawerOpen = ref(true)
const logout = () => {}
</script>