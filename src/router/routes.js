const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'login', component: () => import('pages/LoginPage.vue') },
      {
        path: 'admin',
        component: () => import('layouts/AdminLayout.vue'), 
        children: [
          { path: '', component: () => import('pages/AdminDashboard.vue') }
        ]
      }
    ],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
