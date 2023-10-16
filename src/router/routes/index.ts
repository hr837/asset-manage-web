import type { RouteRecordRaw } from 'vue-router'
import BlankLayout from '@/layout/BlankLayout.vue'
import WorkSpaceLayout from '@/layout/WorkSpaceLayout.vue'
import BasicLayout from '@/layout/BasicLayout.vue'

const routesConfig: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/index',
    component: BlankLayout,
    children: [
      {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/LoginView.vue'),
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
    // children: [
    //   {
    //     path: '/home',
    //     name: 'home',
    //     component: HomeView,
    //   },
    // ],
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
        path: '/upload',
        name: 'video-upload',
        component: () => import('@/views/video-upload/VideoUploadView.vue'),
        meta: {
          title: '上传视频',
        },
      },
      {
        path: '/detail',
        name: 'asset-detail',
        component: () => import('@/views/asset-detail/AssetDetailView.vue'),
        meta: {
          title: '资产详情',
          menuPath: '/index',
        },
      },
      {
        path: '/play',
        name: 'play-video',
        component: () => import('@/views/asset-manage/AssetPlay.vue'),
        meta: {
          title: '资产播放',
        },
      },
    ],
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
