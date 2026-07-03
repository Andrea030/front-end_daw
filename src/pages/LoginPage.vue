<template>
  <q-page class="flex flex-center q-pa-md" style="background-color: rgb(193, 184, 127">
    <q-card class="split-card row overflow-hidden no-shadow">
      <div class="col-12 col-md-6 bg-white q-pa-xl flex flex-center">
        <div class="form-container">
          <div class="header-section q-mb-lg">
            <h2 class="text-h3 text-weight-bold q-mt-none q-mb-sm title-text">
              Bienvenido de vuelta
            </h2>
            <div class="text-subtitle1 text-grey-9 q-mb-md auth-subtitle">
              ¿No estás registrado?
              <router-link to="/crear-cuenta" class="register-link text-indigo-5"
                >Crea una Cuenta</router-link
              >
            </div>
            <q-separator color="grey-4" />
          </div>

          <div class="form-section">
            <div class="q-mb-md">
              <label class="form-label q-mb-sm">Ingrese su correo electrónico:</label>
              <q-input
                v-model="correo"
                outlined
                dense
                placeholder="Ej: pepitopancracio@yahoo.com"
                class="custom-input"
                hide-bottom-space
              />
            </div>

            <div class="q-mb-xl">
              <label class="form-label q-mb-sm">Ingresar contraseña:</label>
              <q-input
                v-model="contrasena"
                type="password"
                outlined
                dense
                placeholder="● ● ● ● ● ● ● ●"
                class="custom-input"
                hide-bottom-space
              />
            </div>

            <q-btn
              label="INICIAR SESIÓN"
              class="login-btn q-py-sm q-px-lg text-weight-bold"
              unelevated
              no-caps
              @click="iniciarSesion"
              :loading="cargando"
            />
          </div>
        </div>
      </div>

      <div class="col-12 col-md-6 flex flex-center right-panel">
        <div class="logo-circle flex flex-center shadow-3">
          <q-icon name="sync" class="sync-icon" />
          <span class="currency-text">$€</span>
        </div>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import axios from 'axios'

// Variables de Quasar y Vue Router
const router = useRouter()
const $q = useQuasar()

// Variables reactivas para el formulario
const correo = ref('')
const contrasena = ref('')
const cargando = ref(false) // Para mostrar la animación de carga en el botón

// URL de tu API (ajusta el puerto si es diferente)
const baseUrl = 'http://localhost:5000'

const iniciarSesion = async () => {
  // 1. Validación básica en el frontend
  if (!correo.value || !contrasena.value) {
    $q.notify({
      type: 'warning',
      message: 'Por favor, completa ambos campos.',
      position: 'top'
    })
    return
  }

  // Iniciamos la animación del botón
  cargando.value = true

  try {
    // 2. Realizamos la petición POST a la API (Igual que en Postman)
    const response = await axios.post(`${baseUrl}/api/auth/login`, {
      email: correo.value,
      password: contrasena.value
    })

    // 3. Extraemos el token de la respuesta
    const token = response.data.token

    if (token) {
      // 4. Guardamos el token en el almacenamiento del navegador
      localStorage.setItem('token', token)

      $q.notify({
        type: 'positive',
        message: '¡Bienvenido de vuelta!',
        position: 'top'
      })

      // 5. Redirigimos a la página de inicio (ajusta la ruta según tu proyecto)
      router.push('/')
    } else {
      throw new Error('No se recibió el token de la API')
    }

  } catch (error) {
    console.error('Error al iniciar sesión:', error)
    
    // Mostramos mensaje de error si las credenciales fallan o el server cae
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Credenciales incorrectas. Inténtalo de nuevo.',
      position: 'top'
    })
  } finally {
    // Detenemos la animación del botón sin importar si fue éxito o error
    cargando.value = false
  }
}
</script>

<style scoped>
/* Contenedor principal estilo Split Screen (Imagen 3) */
.split-card {
  width: 100%;
  max-width: 1100px;
  min-height: 600px;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
}

.form-container {
  width: 100%;
  max-width: 420px;
}

/* Tipografía basada en tu segunda imagen (estilo monospace/typewriter) */
.title-text {
  font-family: 'Courier New', Courier, monospace;
  letter-spacing: 1px;
  color: #000;
  line-height: 1.1;
}

.auth-subtitle {
  font-family: 'Courier New', Courier, monospace;
  letter-spacing: 0.5px;
}

.form-label {
  display: block;
  font-family: 'Courier New', Courier, monospace;
  letter-spacing: 1.5px;
  font-size: 0.95rem;
  color: #333;
}

.register-link {
  text-decoration: underline;
  font-weight: bold;
}

/* Solución a la doble línea: Limpieza de clases y uso nativo de Quasar */
.custom-input :deep(.q-field__control) {
  border-radius: 8px;
  background-color: #fff;
}

.custom-input :deep(.q-field__native::placeholder) {
  color: #b0b0b0;
  letter-spacing: 2px;
  font-family: 'Courier New', Courier, monospace;
}

/* Estilo del botón (Imagen 2) */
.login-btn {
  background: linear-gradient(to bottom, #98d1f1, #7ab5d6);
  color: white;
  border-radius: 6px;
  letter-spacing: 2px;
  box-shadow: 0 4px 6px rgb(0, 0, 0, 0.15);
  font-family: sans-serif;
}

/* Panel derecho y Logo circular gigante */
.right-panel {
  background-color: #fbf8fa; /* Color sutil de fondo */
}

.logo-circle {
  width: 320px;
  height: 320px;
  background-color: #7a846e; /* Verde oliva de tu marca */
  border-radius: 50%;
  position: relative;
  border: 12px solid #e1d4c2; /* Borde color crema */
  overflow: hidden;
}

.sync-icon {
  font-size: 320px;
  color: #e1d4c2;
  position: absolute;
  opacity: 0.8;
}

.currency-text {
  font-size: 110px;
  font-weight: 900;
  color: #3a2e26; /* Color marrón oscuro para el símbolo */
  z-index: 1;
}
</style>
