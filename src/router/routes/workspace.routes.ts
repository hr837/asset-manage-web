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
  {
    path: '/zone',
    name: 'digital-zone',
    component: () => import('@/views/digital/DigitalZoneView.vue'),
    meta: {
      title: '创作空间',
    },
  },
  {
    path: '/my-production',
    name: 'digital-production',
    component: () => import('@/views/digital/DigitalProductionView.vue'),
    meta: {
      title: '创作空间-我的作品',
      menuPath: '/zone',
    },
  },
  {
    path: '/member',
    name: 'member',
    component: () => import('@/views/member/MemberPlanView.vue'),
    meta: {
      title: '计划&价格',
    },
  },
]

export default routesConfig
