import type { RouteRecordRaw } from 'vue-router'
import blankRoutes from './blank.routes'
import workspaceRoutes from './workspace.routes'
import BlankLayout from '@/layout/BlankLayout.vue'
import WorkSpaceLayout from '@/layout/WorkSpaceLayout.vue'
import BasicLayout from '@/layout/BasicLayout.vue'

const routesConfig: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/index',
    component: BlankLayout,
    children: blankRoutes,
  },
  {
    path: '/basic',
    component: BasicLayout,
  },
  {
    path: '/workspace',
    component: WorkSpaceLayout,
    children: workspaceRoutes,
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
