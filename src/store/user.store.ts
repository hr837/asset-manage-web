import { defineStore } from 'pinia'
import type { MenuData } from '@/types/work-tree.type'

/** 一天的毫秒数 */
const DAY_MS = 86400000

interface State {
  // 用户token
  token: string
  // UserId
  id: string
  /** 子菜单列表 */
  subMenuList: MenuData[]
  /** 用户数据过期时间 */
  expiration: number
}

/** 初始化state */
const initialState = (): State => {
  return {
    id: '',
    token: '',
    subMenuList: [],
    expiration: 0,
  }
}

export const useUserStore = defineStore('user', {
  state: initialState,
  actions: {
    /**
     * 更新系统状态
     */
    updateToken(token: string, remember = false) {
      this.token = token
      // 过期时间，1天或者7天
      const expDuration = remember ? DAY_MS * 7 : DAY_MS
      this.expiration = new Date().setHours(0, 0, 0, 0) + expDuration
    },
    updateUserInfo(user: { id: string; name: string }) {
      this.id = user.id
    },
  },
  getters: {
    /** 根据传入的路由检测用户是否拥有此菜单权限 */
    hasMenuRole: state => (path: string) => state.subMenuList.findIndex(x => x.path === path) > -1,
  },
  persist: {
    afterRestore: (ctx) => {
      const expiration = ctx.store.$state.expiration
      if (!expiration)
        return ctx.store.$reset()

      const nowTime = Date.now()
      // 用户数据最大存在时长
      const MAX_DAY_MS = DAY_MS * 7
      if (expiration < nowTime || expiration - MAX_DAY_MS > nowTime) {
        ElMessage.error('账号登录过期')
        ctx.store.$reset()
      }
    },
  },
})
