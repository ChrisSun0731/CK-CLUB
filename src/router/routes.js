const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/about',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '/about', component: () => import('pages/AboutPage.vue') }],
  },
  {
    path: '/application',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '/application', component: () => import('pages/ApplicationPage.vue') }],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
