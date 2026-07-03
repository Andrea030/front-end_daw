<template>
  <q-card :class="bgClass + ' text-white'" flat>
    <q-card-section class="row items-center no-wrap">
      <div>
        <div class="text-h6">{{ title }}</div>
        <div v-for="(line, index) in details" :key="index" class="q-mt-xs">
          {{ line }}
        </div>
      </div>
      <q-space />
      <q-icon :name="icon" size="64px" class="opacity-7" />
    </q-card-section>
  </q-card>
</template>

<script setup>
defineProps({
  title: String,
  details: Array,
  bgClass: String,
  icon: String
})
</script>

<style scoped>
.opacity-7 { opacity: 0.7; }
.q-card { 
    min-height: 139px;
    max-width: 100%;
    }
</style>