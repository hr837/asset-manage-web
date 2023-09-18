import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../../views/HomeView.vue'
import { SystemRoutes } from './system.routes'
import BlankLayout from '@/layout/BlankLayout.vue'
import WorkSpaceLayout from '@/layout/WorkSpaceLayout.vue'
import BasicLayout from '@/layout/BasicLayout.vue'

const routesConfig: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home',
    component: BlankLayout,
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import('@/views/LoginView.vue'),
      },
      {
        path: '/forbidden',
        name: 'Forbidden',
        meta: {
          ignoreAuth: true,
        },
        component: () => import('@/views/ForbiddenView.vue'),
      },
    ],
  },
  {
    path: '/basic',
    component: BasicLayout,
    children: [
      {
        path: '/home',
        name: 'home',
        component: HomeView,
      },
    ],
  },
  {
    path: '/workspace',
    component: WorkSpaceLayout,
    children: [
      {
        path: '/index',
        name: 'assets-manage',
        component: () => import('@/views/asset-manage/AssetManageView.vue'),
        meta: {
          title: '资产管理',
        },
      },
      {
        path: '/about',
        name: 'about',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import(/* webpackChunkName: "about" */ '../../views/AboutView.vue'),
      },
    ],
  },
  // 可以按照模块进行区分，导入
  {
    path: '/system',
    component: WorkSpaceLayout,
    redirect: { name: 'users' }, // 此处可以不写跳转
    children: SystemRoutes,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: {
      ignoreAuth: true,
    },
  },
]

export default routesConfig
