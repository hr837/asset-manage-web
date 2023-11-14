declare module 'element-plus/dist/locale/zh-cn.mjs'

/** HTTP请求返回实体 */
declare interface HttpResponseBase<T = any> {
  /** code 为200 表示成功 */
  code:string
  data:T
  /** http请求失败描述信息 */
  msg:string
}
