import { RequestMethod, type RequestPlugin, RequestService } from '@gopowerteam/request'
export class AssetManageService {
  // 请求实例
  private request = RequestService.getInstance()

  /**
   * 获取验证码
   */
  getList(
    requestBody: string,
    requestPlugins: RequestPlugin[] = [],
  ): Promise<Blob> {
    // 请求数据
    return this.request.send(
      {
        path: '/api/file/list',
        method: RequestMethod.Get,
        paramsBody: requestBody,
      },
      requestPlugins,
    )
  }
}
