<template>
  <q-page class="flex flex-center q-pa-md" style="background-color: #b2ab8c">
    <q-card class="split-card row overflow-hidden no-shadow">
      <div class="col-12 col-md-6 bg-white q-pa-xl flex flex-center">
        <div class="form-container">
          <div class="header-section q-mb-lg text-left">
            <h2 class="text-h3 text-weight-bold q-mt-none q-mb-sm title-text">Crea tu Cuenta</h2>
            <div class="text-subtitle1 text-grey-9 q-mb-md auth-subtitle">
              ¿Ya tienes una cuenta?
              <router-link to="/login" class="login-link text-indigo-5">Inicia Sesión</router-link>
            </div>
            <q-separator color="grey-4" />
          </div>

          <div class="form-section">
            <div class="q-mb-md">
              <q-input
                v-model="usuario"
                outlined
                dense
                placeholder="Ingrese su Usuario"
                class="custom-input"
                hide-bottom-space
              />
              <div class="hint-text q-mt-xs q-ml-sm text-grey-6 text-left">
                Su usuario será visible en todos lados.
              </div>
            </div>

            <div class="q-mb-md">
              <q-input
                v-model="correo"
                type="email"
                outlined
                dense
                placeholder="Correo Electrónico"
                class="custom-input"
                hide-bottom-space
              />
            </div>

            <div class="q-mb-md">
              <q-input
                v-model="contrasena"
                type="password"
                outlined
                dense
                placeholder="Ingresar Contraseña"
                class="custom-input"
                hide-bottom-space
              />
            </div>

            <div class="q-mb-xl">
              <q-input
                v-model="confirmarContrasena"
                type="password"
                outlined
                dense
                placeholder="Confirmar Contraseña"
                class="custom-input"
                hide-bottom-space
              />
            </div>

            <div class="text-left">
              <q-btn
                label="CREAR CUENTA"
                class="action-btn q-py-sm q-px-lg text-weight-bold"
                unelevated
                no-caps
                @click="crearCuenta"
                :loading="cargando"
              />
            </div>
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

// Variables de Vue Router y Quasar
const router = useRouter()
const $q = useQuasar()

// Variables reactivas del formulario
const usuario = ref('')
const correo = ref('')
const contrasena = ref('')
const confirmarContrasena = ref('')
const cargando = ref(false)

// URL de tu API
const baseUrl = 'http://localhost:5000'

const crearCuenta = async () => {
  // 1. Validaciones básicas en el frontend antes de enviar a la API
  if (!usuario.value || !correo.value || !contrasena.value || !confirmarContrasena.value) {
    $q.notify({ type: 'warning', message: 'Por favor, completa todos los campos.', position: 'top' })
    return
  }

  if (contrasena.value !== confirmarContrasena.value) {
    $q.notify({ type: 'warning', message: 'Las contraseñas no coinciden.', position: 'top' })
    return
  }

  cargando.value = true

  try {
    // 2. Realizamos la petición POST al backend
    const response = await axios.post(`${baseUrl}/api/auth/registro`, {
      nombre: usuario.value,
      email: correo.value,
      password: contrasena.value
    })

    // 3. Éxito: Mostramos el mensaje de la API (Imagen 1) y redirigimos
    $q.notify({
      type: 'positive',
      message: response.data.mensaje || 'Usuario registrado exitosamente.',
      position: 'top'
    })
    
    router.push('/')

  } catch (error) {
    console.error('Error al registrar usuario:', error)

    // 4. Manejo de Errores Dinámico (Imágenes 2 y 3)
    if (error.response && error.response.status === 400) {
      const data = error.response.data

      // Escenario A: Error estructurado de validación (.NET ModelState - Imagen 2)
      // Ejemplo: La contraseña debe tener al menos 6 caracteres
      if (data.errors) {
        // Recorremos los errores y mostramos una notificación por cada uno
        for (const campo in data.errors) {
          data.errors[campo].forEach(mensajeError => {
            $q.notify({
              type: 'negative',
              message: mensajeError,
              position: 'top'
            })
          })
        }
      } 
      // Escenario B: Mensaje de error personalizado (Imagen 3)
      // Ejemplo: El correo electrónico ya se encuentra registrado
      else if (data.mensaje) {
        $q.notify({
          type: 'negative',
          message: data.mensaje,
          position: 'top'
        })
      } 
      // Escenario C: Error 400 genérico
      else {
        $q.notify({
          type: 'negative',
          message: 'Error en el registro. Revisa tus datos.',
          position: 'top'
        })
      }
    } else {
      // Error 500 u otros problemas de conexión
      $q.notify({
        type: 'negative',
        message: 'No se pudo conectar con el servidor.',
        position: 'top'
      })
    }
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
/* Contenedor principal estilo Split Screen */
.split-card {
  width: 100%;
  max-width: 1100px;
  min-height: 600px;
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5) !important;
}

.form-container {
  width: 100%;
  max-width: 450px; /* Un poco más ancho para que nombres y apellidos quepan bien */
}

/* Tipografía Consistente (estilo monospace/typewriter) */
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

.hint-text {
  font-family: 'Courier New', Courier, monospace;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.login-link {
  text-decoration: underline;
  font-weight: bold;
}

/* Estilos de los inputs */
.custom-input :deep(.q-field__control) {
  border-radius: 8px;
  background-color: #fff;
}

.custom-input :deep(.q-field__native::placeholder) {
  color: #b0b0b0;
  letter-spacing: 1.5px;
  font-family: 'Courier New', Courier, monospace;
}

/* Estilo del botón consistente con Login */
.action-btn {
  background: linear-gradient(to bottom, #98d1f1, #7ab5d6);
  color: white;
  border-radius: 6px;
  letter-spacing: 2px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  font-family: sans-serif;
}

/* Panel derecho y Logo circular gigante */
.right-panel {
  background-color: #fbf8fa;
}

.logo-circle {
  width: 320px;
  height: 320px;
  background-color: #7a846e;
  border-radius: 50%;
  position: relative;
  border: 12px solid #e1d4c2;
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
  color: #3a2e26;
  z-index: 1;
}
</style>
