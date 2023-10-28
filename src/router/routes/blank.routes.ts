import type { RouteRecordRaw } from 'vue-router'

const routesConfig: Array<RouteRecordRaw> = [
  {
    path: '/account',
    component: () => import('@/views/account/AccountLayout.vue'),
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import('@/views/account/AccountLoginView.vue'),
        meta: {
          ignoreAuth: true,
        },
      },
      {
        path: '/register',
        name: 'register',
        component: () => import('@/views/account/AccountRegisterView.vue'),
        meta: {
          ignoreAuth: true,
        },
      },
    ],
  },
  {
    path: '/dev-test',
    component: () => import('@/views/test/TestView.vue'),
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
