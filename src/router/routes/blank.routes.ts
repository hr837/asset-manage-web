import type { RouteRecordRaw } from 'vue-router'

const routesConfig: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/LoginView.vue'),
    meta: {
      ignoreAuth: true,
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/register/RegisterView.vue'),
    meta: {
      ignoreAuth: true,
    },
  },
  {
    path: '/forbidden',
    name: 'Forbidden',
    meta: {
      ignoreAuth: true,
    },
    component: () => import('@/views/ForbiddenView.vue'),
  },
]

export default routesConfig
