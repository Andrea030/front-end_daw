const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'crear-oferta', component: () => import('pages/CrearOferta.vue') },
      { path: 'crear-cuenta', component: () => import('pages/RegisterPage.vue') },
      { path: 'home', component: () => import('pages/HomePage.vue') },
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
