<template>
  <q-page class="flex items-center q-pl-xl" style="background-color: rgb(236, 245, 226)">
    <div class="content-container">
      <div class="header-section">
        <div class="header-section">
          <div class="text-h4 text-weight-bold text-grey-9 q-mb-xs">Bienvenido de vuelta</div>
          <div class="text-grey-8 q-mb-md">
            ¿No estás registrado?
            <a href="#" class="text-primary text-weight-bold register-link">Crea una Cuenta</a>
          </div>

          <q-separator color="black" class="q-mb-md" />
        </div>
      </div>

      <div class="form-section">
        <div class="input-group q-mb-md">
          <div class="input-label text-grey-9 q-mb-sm">
            Ingrese su usuario o correo electrónico:
          </div>
          <q-input
            v-model="correo"
            placeholder="Ej: pepitopancracio@yahoo.com"
            dense
            outlined
            class="custom-input"
          />
        </div>

        <div class="input-group q-mb-lg">
          <div class="input-label text-grey-9 q-mb-sm">Ingresar contraseña:</div>
          <q-input
            v-model="contrasena"
            type="password"
            dense
            outlined
            placeholder="Ingrese su contraseña"
            class="custom-input"
            autocomplete="current-password"
          />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'

const correo = ref('')
const contrasena = ref('')
</script>

<style scoped>
.content-container {
  width: 100%;
  max-width: 400px;
}

.header-section {
  margin-bottom: 1rem;
}

.custom-input {
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background-color: white;
  height: 48px;
}

.custom-input :deep(.q-field__control) {
  background-color: white !important;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.custom-input :deep(.q-field__control:before),
.custom-input :deep(.q-field__control:after) {
  display: none !important;
}

.custom-input :deep(.q-field__native::placeholder) {
  color: transparent;
  transition: color 0.3s ease;
}

.custom-input:hover :deep(.q-field__native::placeholder),
.custom-input.q-field--focused :deep(.q-field__native::placeholder) {
  color: #9e9e9e;
}

.register-link {
  text-decoration: underline;
}

.input-label {
  font-size: 1rem;
}
</style>
