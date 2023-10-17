export const appConfig: AppConfig = {
  title: process.env.VUE_APP_TITLE!,
  http: {
    gateway: process.env.VUE_APP_HTTP_GETWAY!,
    timeout: 3000,
  },
  ignoreAuth: process.env.VUE_APP_ROUTE_IGNOREAUTH === 'true',
}

export interface AppConfig {
  /** 应用名称 */
  title: string
  http: {
    /**
     * 网关地址配置
     */
    gateway: string
    /**
     * 超时时间配置(毫秒)
     */
    timeout?: number
  }
  /** 路由是否忽略鉴权 */
  ignoreAuth?: boolean
}

/** 视频资源所在服务器目录 */
export const AssetVideoPrefix = '/asset/video/'
/** FBX模型资源所在服务器目录 */
export const AssetFBXPrefix = '/assset/fbx/'
