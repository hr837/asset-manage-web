import type { RouteRecordRaw } from 'vue-router'

export const SystemRoutes: Array<RouteRecordRaw> = [
  {
    path: 'organize/users', // 不带 / 所以会拼接父路由
    name: 'users',
    component: () => import('@/views/system/organizational-management/OrganizationUsersView.vue'),
  },
]
