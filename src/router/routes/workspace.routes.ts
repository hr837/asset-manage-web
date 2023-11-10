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
    path: '/digital',
    name: 'digital',
    component: () => import('@/views/digital/DigitalView.vue'),
    meta: {
      title: '数字中心',
    },
  },
  {
    path: '/photo-edit',
    name: 'AssetPhotoEdit',
    component: () => import('@/views/digital/DigitalEditView.vue'),
    meta: {
      title: '数字中心-编辑',
      menuPath: '/digital',
    },
  },
]

export default routesConfig
