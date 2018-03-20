
export default [
  { path: '/', component: () => import('layouts/Index') },
  { path: '/login/:token', component: () => import('layouts/Index') },

  // Always leave this last one
  { path: '*', component: () => import('pages/404') } // Not found
]
