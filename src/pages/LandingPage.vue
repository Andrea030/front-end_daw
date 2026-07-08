<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="landing-page bg-grey-1 text-black">
        
        <div class="hero-section q-py-xl q-px-md max-width-container">
          <div class="row items-center q-col-gutter-xl">
            
            <div class="col-12 col-md-6 column items-start text-left q-py-xl">
              <div class="badge-p2p q-px-sm q-py-xs q-mb-md text-caption text-weight-bold rounded-borders">
                ✨ PLATAFORMA P2P INTELIGENTE
              </div>

              <div class="row items-center q-gutter-md q-mb-md">
                <q-avatar size="64px" class="logo-avatar shadow-2">
                  <div class="logo-placeholder bg-olive-green text-white flex flex-center">
                    <q-icon name="sync_alt" size="32px" />
                    <div class="logo-text-overlay">$€</div>
                  </div>
                </q-avatar>
                <h1 class="text-h2 text-black text-bold q-my-none font-brand">Small Change</h1>
              </div>

              <p class="text-h5 text-grey-8 q-mb-xl max-width-p-left text-weight-light line-height-relaxed">
                Tu mercado inteligente para el <span class="text-olive-green text-weight-bold">cambio de divisas</span> directo, seguro y al instante.
              </p>
    
              <div class="row q-gutter-md items-center">
                <q-btn
                  color="dark"
                  label="Crear Cuenta y Empezar"
                  to="/crear-cuenta"
                  size="lg"
                  no-caps
                  unelevated
                  class="cta-btn q-px-xl shadow-2"
                />
    
                <q-btn
                  flat
                  color="dark"
                  label="Iniciar sesión"
                  to="/login"
                  no-caps
                  class="text-weight-bold hover-underline"
                />
              </div>
            </div>
    
            <div class="col-12 col-md-6 flex flex-center relative-position q-py-xl">
              <div class="visual-mockup-container full-width relative-position">
                <div class="decor-card bg-brown-earth text-white q-pa-lg shadow-3 absolute">
                  <div class="text-caption opacity-70">Tengo (Enviar)</div>
                  <div class="text-h5 text-weight-bold">1,000 USD</div>
                </div>

                <div class="main-mockup-card bg-white text-black q-pa-xl shadow-6 relative-position">
                  <div class="row justify-between items-center q-mb-md">
                    <div class="text-weight-bold text-subtitle1 text-grey-7">Mercado en vivo</div>
                    <q-badge color="green-11" text-color="black" class="text-weight-bold">✓ Conectado</q-badge>
                  </div>
                  
                  <div class="mockup-line q-mb-sm"></div>
                  <div class="mockup-line short q-mb-lg"></div>

                  <div class="row items-center justify-between bg-grey-2 q-pa-md rounded-borders">
                    <div class="column">
                      <span class="text-caption text-grey-6">Recibes</span>
                      <span class="text-h6 text-bold text-olive-green">3,420 PEN</span>
                    </div>
                    <q-icon name="trending_up" size="32px" class="text-olive-green" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
    
        <div class="features-section q-py-xl q-px-md bg-white-gradient">
          <div class="row q-col-gutter-xl justify-center max-width-container q-py-xl">
            <div class="col-12 text-center q-mb-md">
              <div class="text-overline text-olive-green text-weight-bold">BENEFICIOS</div>
              <h3 class="text-h4 text-black text-bold q-mt-none">Por qué elegir Small Change</h3>
            </div>
    
            <div class="col-12 col-sm-4">
              <div class="feature-card text-center q-pa-xl bg-white shadow-1">
                <div class="icon-wrapper q-mx-auto q-mb-lg flex flex-center">
                  <q-icon name="savings" size="36px" class="text-olive-green" />
                </div>
                <div class="text-h6 text-black text-bold q-mb-sm">Mejores Tasas</div>
                <p class="text-body1 text-grey-7">
                  Conecta directamente con otros usuarios y evita las comisiones bancarias tradicionales.
                </p>
              </div>
            </div>
    
            <div class="col-12 col-sm-4">
              <div class="feature-card text-center q-pa-xl bg-white shadow-1">
                <div class="icon-wrapper q-mx-auto q-mb-lg flex flex-center">
                  <q-icon name="speed" size="36px" class="text-olive-green" />
                </div>
                <div class="text-h6 text-black text-bold q-mb-sm">Rapidez y Control</div>
                <p class="text-body1 text-grey-7">
                  Gestiona tus propias ofertas de cambio de divisas y obtén tus fondos rápidamente.
                </p>
              </div>
            </div>
    
            <div class="col-12 col-sm-4">
              <div class="feature-card text-center q-pa-xl bg-white shadow-1">
                <div class="icon-wrapper q-mx-auto q-mb-lg flex flex-center">
                  <q-icon name="security" size="36px" class="text-olive-green" />
                </div>
                <div class="text-h6 text-black text-bold q-mb-sm">Seguridad y Confianza</div>
                <p class="text-body1 text-grey-7">
                  Entorno seguro para tus transacciones con verificación de usuarios integradas.
                </p>
              </div>
            </div>
          </div>
        </div>
    
        <div class="cta-section text-center q-py-xl q-px-md text-white relative-position overflow-hidden">
          <div class="absolute-full bg-overlay-texture opacity-10"></div>
          <div class="max-width-container q-py-lg relative-position">
            <h3 class="text-h4 text-bold q-mt-none q-mb-sm">¿Solo quieres ver qué hay disponible?</h3>
            <p class="text-h6 text-grey-4 q-mb-xl font-light">Explora todas las ofertas de cambio actuales en tiempo real.</p>
            <q-btn
              outline
              color="white"
              label="Ver Ofertas Disponibles"
              to="/"
              size="lg"
              class="q-px-xl cta-outline-btn"
            />
          </div>
        </div>
    
        <div class="footer text-center q-py-lg bg-grey-2 text-grey-6 text-caption border-top-light">
          Small Change © 2026. DAW Exchange Platform.
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
// Tu lógica de script se mantiene limpia
</script>

<style lang="scss">
$color-olive-green: #7a846e;
$color-brown-earth: #b39a7e;
$color-main-bg: #fdfbfd; // Un tono sutilmente más limpio y claro

.landing-page {
  font-family: 'Poppins', sans-serif;
  background-color: $color-main-bg !important;
}

.font-brand {
  letter-spacing: -1px;
}

.line-height-relaxed {
  line-height: 1.6;
}

// Clases de utilidad de color
.text-olive-green { color: $color-olive-green; }
.bg-olive-green { background-color: $color-olive-green; }
.bg-brown-earth { background-color: $color-brown-earth; }

.max-width-container {
  max-width: 1140px;
  margin: 0 auto;
}

.max-width-p-left {
  max-width: 480px;
}

// Indicador P2P superior
.badge-p2p {
  background-color: rgba($color-olive-green, 0.12);
  color: $color-olive-green;
  letter-spacing: 1px;
}

// Animación e Interacción de botones
.cta-btn {
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0,0,0,0.15) !important;
  }
}

.cta-outline-btn {
  border-radius: 8px;
  transition: all 0.2s ease;
  &:hover {
    background-color: rgba(255,255,255,0.1);
  }
}

// DISEÑO DEL VISUAL MOCKUP (Adiós caja punteada)
.visual-mockup-container {
  max-width: 460px;
  height: 360px;
}

.main-mockup-card {
  border-radius: 16px;
  width: 90%;
  border: 1px solid rgba(0,0,0,0.05);
}

.decor-card {
  border-radius: 12px;
  width: 220px;
  bottom: -10px;
  left: -20px;
  z-index: 1;
}

.mockup-line {
  height: 8px;
  background-color: #f1edf0;
  border-radius: 4px;
  width: 100%;
  &.short { width: 60%; }
}

// SECCIÓN DE CARACTERÍSTICAS CON DEGRADADO SUAVE
.bg-white-gradient {
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, #f4f1f3 100%);
}

.icon-wrapper {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background-color: rgba($color-olive-green, 0.08);
}

.feature-card {
  border-radius: 16px;
  border: 1px solid rgba(0,0,0,0.02);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  height: 100%;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 30px rgba(122, 132, 110, 0.12) !important;
  }
}

// SECCIÓN CTA OSCURA
.cta-section {
  background-color: #1a1a1a !important;
}

.border-top-light {
  border-top: 1px solid rgba(0,0,0,0.05);
}
</style>