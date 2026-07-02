<template>
  <q-page class="landing-page bg-grey-1 text-black">
    <div class="hero-section q-pa-xl max-width-container">
      <div class="row items-center q-col-gutter-xl">
        <div class="col-12 col-md-6 column items-start text-left">
          <q-avatar size="80px" class="q-mb-md">
            <div class="logo-placeholder bg-olive-green text-white flex flex-center">
              <q-icon name="sync_alt" size="40px" />
              <div class="logo-text-overlay">$€</div>
            </div>
          </q-avatar>

          <h1 class="text-h2 text-black text-bold q-mt-none q-mb-sm">Small Change</h1>
          <p class="text-h5 text-grey-9 q-mb-lg max-width-p-left">
            Tu mercado inteligente para el cambio de divisas al instante.
          </p>

          <div class="row q-gutter-md items-center">
            <q-btn
              color="dark"
              label="Crear tu Cuenta y Empezar"
              to="/crear-cuenta"
              size="lg"
              no-caps
              unelevated
              class="cta-btn q-px-xl q-py-sm"
            />

            <q-btn
              flat
              color="dark"
              label="Ya tengo cuenta, iniciar sesión"
              to="/login"
              no-caps
              class="text-weight-medium"
            />
          </div>
        </div>

        <div class="col-12 col-md-6 flex flex-center">
          <div
            class="image-placeholder bg-grey-3 rounded-borders flex flex-center text-center q-pa-xl"
            style="height: 400px; width: 100%; border: 2px dashed #ccc"
          >
            <div>
              <q-icon name="image" size="64px" color="grey-5" class="q-mb-sm" />
              <div class="text-h6 text-grey-6">IMAGEN SUPER CHEVERE AQUI</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="features-section q-pa-xl bg-grey-2">
      <div class="row q-col-gutter-lg justify-center max-width-container">
        <div class="col-12 text-center q-mb-xl">
          <h3 class="text-h4 text-black text-bold q-mt-none">Por qué elegir Small Change</h3>
        </div>

        <div class="col-12 col-sm-4">
          <div class="feature-card text-center q-pa-lg bg-white rounded-borders">
            <q-icon name="savings" size="64px" class="text-olive-green q-mb-md" />
            <div class="text-h6 text-black text-bold q-mb-xs">Mejores Tasas</div>
            <p class="text-subtitle1 text-grey-9">
              Conecta directamente con otros usuarios y evita las comisiones bancarias
              tradicionales.
            </p>
          </div>
        </div>

        <div class="col-12 col-sm-4">
          <div class="feature-card text-center q-pa-lg bg-white rounded-borders">
            <q-icon name="speed" size="64px" class="text-olive-green q-mb-md" />
            <div class="text-h6 text-black text-bold q-mb-xs">Rapidez y Control</div>
            <p class="text-subtitle1 text-grey-9">
              Gestiona tus propias ofertas de cambio de divisas y obtén tus fondos rápidamente.
            </p>
          </div>
        </div>

        <div class="col-12 col-sm-4">
          <div class="feature-card text-center q-pa-lg bg-white rounded-borders">
            <q-icon name="security" size="64px" class="text-olive-green q-mb-md" />
            <div class="text-h6 text-black text-bold q-mb-xs">Seguridad y Confianza</div>
            <p class="text-subtitle1 text-grey-9">
              Entorno seguro para tus transacciones con verificación de usuarios integradas.
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="cta-section text-center q-pa-xl bg-dark text-white">
      <h3 class="text-h4 q-mt-none q-mb-sm">¿Solo quieres ver qué hay disponible?</h3>
      <p class="text-h6 q-mb-lg">Explora todas las ofertas de cambio actuales.</p>
      <q-btn
        outline
        color="white"
        label="Ver Ofertas Disponibles"
        to="/ofertas"
        size="lg"
        class="q-px-xl"
      />
    </div>

    <div class="footer text-center q-pa-md bg-grey-3 text-grey-7">
      Small Change © 2024. DAW Exchange Platform.
    </div>
  </q-page>
</template>

<script setup>
// Tu lógica de script aquí
</script>

<style lang="scss">
// Definimos los colores extraídos en SCSS
$color-olive-green: #7a846e;
$color-brown-earth: #b39a7e;
$color-gray-blue: #869bb7;
$color-main-bg: #f3f0f2;

.landing-page {
  font-family: 'Poppins', sans-serif;
  background-color: $color-main-bg !important;
}

// Clases de utilidad
.text-olive-green {
  color: $color-olive-green;
}
.bg-olive-green {
  background-color: $color-olive-green;
}

// Contenedor principal para que no se estire demasiado en pantallas ultra anchas
.max-width-container {
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.max-width-p-left {
  max-width: 500px;
}

.feature-card {
  height: 100%;
  border: 1px solid rgba($color-olive-green, 0.2);
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
}

.logo-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
}

.logo-text-overlay {
  position: absolute;
  font-size: 20px;
  font-weight: bold;
  color: #f8f7f8;
  opacity: 0.8;
}

.cta-section {
  // Cambiado para que contraste mejor con el texto negro de arriba
  background-color: #1d1d1d !important;
}
</style>
