const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/about',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/AboutPage.vue') }],
  },
  {
    path: '/application',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/ApplicationPage.vue') }],
  },
  {
    path: '/upload',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/UploadPageNew.vue') }],
  },
  {
    path: '/uploadnew',
    redirect: '/upload',
  },
  {
    path: '/retakecourses',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/RetakeCoursesPage.vue') }],
  },
  {
    path: '/notice',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/NoticePage.vue') }],
  },
  {
    path: '/evaluation',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/EvaluationPage.vue') }],
  },
  {
    path: '/official-leave',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/OfficialLeavePage.vue') }],
  },
  {
    path: '/skip',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/SkipPage.vue') }],
  },
  {
    path: '/announcement',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/AnnouncementPage.vue') }],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
