// Función auxiliar para verificar si el usuario está autenticado
const isAuthenticated = () => !!localStorage.getItem('token')

const routes = [
  // ================= RUTAS PROTEGIDAS (Con MainLayout habitual) =================
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/HomePage.vue'),
        beforeEnter: () => {
          if (!isAuthenticated()) {
            return '/landing'
          }
          // Si está autenticado, no retorna nada y permite el acceso normal
        },
      },
      { path: 'crear-oferta', component: () => import('pages/CrearOferta.vue') },
      { path: 'ofertaOverview', component: () => import('pages/OfertaOverview.vue') },
      { path: 'mis-ofertas', component: () => import('pages/MisOfertas.vue') },
    ],
  },

  // ================= RUTAS PÚBLICAS (Sin el menú principal) =================
  {
    path: '/landing',
    component: () => import('pages/LandingPage.vue'),
    beforeEnter: () => {
      if (isAuthenticated()) {
        return '/' // Si ya está logeado, lo regresa a la app principal
      }
    },
  },

  { path: '/login', component: () => import('pages/LoginPage.vue') },
  { path: '/crear-cuenta', component: () => import('pages/RegisterPage.vue') },

  // Captura de errores 404
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
