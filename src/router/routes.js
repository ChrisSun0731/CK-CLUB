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
    path: '/upload',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '/upload', component: () => import('pages/UploadPage.vue') }],
  },
  {
    path: '/retakecourses',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '/retakecourses', component: () => import('pages/RetakeCoursesPage.vue') }],
  },
  {
    path: '/notice',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '/notice', component: () => import('pages/NoticePage.vue') }],
  },
  {
    path: '/evaluation',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '/evaluation', component: () => import('pages/EvaluationPage.vue') }],
  },
  {
    path: '/official-leave',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '/official-leave', component: () => import('pages/OfficialLeavePage.vue') }],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
