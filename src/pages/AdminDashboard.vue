<template>
  <q-page class="q-pa-lg bg-grey-2">
    <div class="text-h5 q-mb-md text-weight-bold">Dashboard</div>

    <div class="row q-col-gutter-md q-mb-lg">
      <div class="col-12 col-md-6">
        <ServerHardwareCards 
          title="Ubuntu 16.04.5 LTS" 
          :details="['Load avg: ____', 'Up Time: ____', 'Server Time: ____']"
          bg-class="bg-orange-8"
          icon="cloud"
        />
      </div>
      <div class="col-12 col-md-6">
        <ServerHardwareCards 
          title="Hardware" 
          :details="['CPU: ________', 'Memory: ____']"
          bg-class="bg-cyan-6"
          icon="storage"
        />
      </div>
    </div>

    <div class="row q-col-gutter-md">

        <div class="col-12 col-md-4">
        <q-card flat bordered class="full-height">
          <q-card-section>
            <div class="text-h6">Usuarios</div>
            <q-select outlined dense v-model="filter" :options="['IP', 'Nombre']" label="Filtrar por" class="q-mt-sm" />
          </q-card-section>
          <q-separator />
          <q-list>
            <q-item v-for="i in 5" :key="i" clickable v-ripple>
              <q-item-section avatar><q-icon name="star" color="grey-7"/></q-item-section>
              <q-item-section>192.********</q-item-section>
              <q-item-section side>Profile</q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>

      <div class="col-12 col-md-8">
        <q-card flat bordered class="q-mb-md">
          <q-card-section class="row items-center justify-between">
            <div class="text-h6">System Load</div>
            <q-btn icon="refresh" flat round />
          </q-card-section>
          <q-card-section>
            <div class="bg-grey-1" style="height: 150px; display: flex; align-items: center; justify-content: center;">
              [Gráfico de Carga del Sistema]
            </div>
          </q-card-section>
        </q-card>
        
        <ProcessTable />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import ServerHardwareCards from 'components/ServerHardwareCards.vue'
import ProcessTable from 'components/ProcessTable.vue'

const filter = ref('IP')
</script>