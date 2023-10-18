import type { RouteRecordRaw } from 'vue-router'

const routesConfig: Array<RouteRecordRaw> = [
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
      menuPath: '/index',
    },
  },
]

export default routesConfig
