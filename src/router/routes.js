const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      { path: 'perfil', component: () => import('pages/ProfilePage.vue') } // ◄ Revisa que esté idéntico a esto
    ]
  },

  // Siempre deja esto al final para atrapar los errores 404 reales
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes