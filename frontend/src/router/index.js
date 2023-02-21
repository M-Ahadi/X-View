import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "login" */ '../views/LoginView.vue'),
  },
  {
    path: '/inbounds',
    name: 'inbounds',
    component: () => import(/* webpackChunkName: "inbounds" */ '../views/InboundListView.vue'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/certificates',
    name: 'certificates',
    component: () => import(/* webpackChunkName: "inbounds" */ '../views/CertificateManagementView'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/status',
    name: 'system_status',
    component: () => import(/* webpackChunkName: "inbounds" */ '../views/SystemStatusView'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/settings',
    name: 'system_settings',
    component: () => import(/* webpackChunkName: "inbounds" */ '../views/PanelSettingsView'),
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/logout',
    name: 'logout',
    component: () => import(/* webpackChunkName: "logout" */ '../views/LogoutView'),
    meta: {
      requiresAuth: true,
    }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const is_authenticated = localStorage.getItem(process.env.VUE_APP_AUTH_TOKEN) && localStorage.getItem(process.env.VUE_APP_AUTH_TOKEN) !== 'undefined'
  if (to.name === "home" && is_authenticated){
    next({name: 'inbounds'})
    return;
  }

  if(to.matched.some(record => record.meta.requiresAuth)) {
    if ( ! is_authenticated ) {
      next({name: 'home'})
      return
    }
  }
  next()
})

export default router
