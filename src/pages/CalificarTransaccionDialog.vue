<template>
  <q-dialog v-model="isOpen" persistent>
    <q-card style="width: 450px; max-width: 90vw;" class="q-pa-md text-center">
      <q-card-section>
        <div class="text-h6 text-weight-bold text-uppercase">
          Califica tu experiencia de transacción
        </div>
        <p class="text-grey-7 q-mt-sm">¿Qué te pareció la transacción con el vendedor?</p>
      </q-card-section>

      <q-card-section class="column items-center q-gutter-md">
        <q-rating
          v-model="puntuacion"
          size="3.5em"
          color="amber"
          icon="star_border"
          icon-selected="star"
          :max="5"
        />
        <div class="text-subtitle1 text-weight-bold text-amber-9">
          {{ labelPuntuacion }}
        </div>

        <q-input
          v-model="comentarios"
          type="textarea"
          outlined
          dense
          placeholder="Escribe tus comentarios adicionales (Opcional)..."
          class="full-width"
          rows="3"
        />
      </q-card-section>

      <q-card-actions align="center" class="q-mt-md">
        <q-btn
          label="Enviar Calificación"
          color="brown-5"
          class="full-width text-weight-bold text-white q-py-sm"
          :loading="enviando"
          @click="enviarCalificacionBackend"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { api } from 'src/boot/axios'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'

const props = defineProps({
  vendedorId: { type: Number, required: true }
})

const $q = useQuasar()
const router = useRouter()

const isOpen = ref(true)
const puntuacion = ref(4)
const comentarios = ref('')
const enviando = ref(false)

const labelPuntuacion = computed(() => {
  const labels = { 1: '1 de 5 - Muy Mala', 2: '2 de 5 - Mala', 3: '3 de 5 - Regular', 4: '4 de 5 - Muy Buena', 5: '5 de 5 - Excelente' }
  return labels[puntuacion.value] || ''
})

const enviarCalificacionBackend = async () => {
  try {
    enviando.value = true
    // Invocamos tu nuevo endpoint matemático en .NET
    await api.post(`/clientes/${props.vendedorId}/calificar`, {
      calificacion: puntuacion.value
    })

    $q.notify({ type: 'positive', message: '¡Gracias por calificar al vendedor!', position: 'top' })
    isOpen.value = false
    router.push('/') // Volvemos al home limpios
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'No se pudo guardar la calificación.' })
  } finally {
    enviando.value = false
  }
}
</script>