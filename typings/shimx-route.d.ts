import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    /**
     * 是忽略身份权限
     * @description 默认不忽略身份验证
     */
    ignoreAuth?: boolean;
    /** 页面标题 */
    title?: String
    /** 对应菜单的路由 */
    menuPath?: string
  }
}
