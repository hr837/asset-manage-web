import { createRouter, createWebHistory } from 'vue-router'
import { h } from 'vue'
import routes from './routes'
import BlankLayout from '@/layout/BlankLayout.vue'
import { appConfig } from '@/config/app.config'
import { useAppStore } from '@/store/app.store'
import { useUserStore } from '@/store/user.store'
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  // 开发模式下可以忽略路由鉴权
  if (appConfig.ignoreAuth === true)
    return
  // 权限检测 // 路由配置需要权限
  const ignoreAuth = to.meta.ignoreAuth ?? false
  if (!ignoreAuth) {
    const userStore = useUserStore()
    // 但是 未授权
    if (!userStore.token)
      return { name: 'login' }

    // 已授权，检测用户菜单权限
    // if (!useUserStore().hasMenuRole(to.path))
    // return { name: 'Forbidden' }
  }
})

// 路由解析守卫
router.beforeResolve((to) => {
  const appStore = useAppStore()
  if (!appStore.microApp)
    return
  if (to.name === 'NotFound')
    return

  const replaceNames = ['WorkSpaceLayout', 'BasicLayout']
  const routeComponents = to.matched[0].components
  if (!routeComponents)
    return
  const defaultComponentName = routeComponents.default?.name ?? ''
  if (replaceNames.includes(defaultComponentName))
    routeComponents.default = h(BlankLayout)
  // 处理微应用模式下的布局解析 end
})

export default router
