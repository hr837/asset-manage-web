import { useUserStore } from '@/store/user.store'

/** 获取请求头 */
export const getAuthorization = () => {
  const userStore = useUserStore()
  if (!userStore.token)
    return {}

  return { authorization: `token ${userStore.token}` }
}
