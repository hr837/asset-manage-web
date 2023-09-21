import { RequestMethod, type RequestPlugin, RequestService } from '@gopowerteam/request'
import type { AssetQueryInput, AssetQueryOutItem } from '../models/asset.model'
import type { PageResonse } from '../models/page.model'
export class AssetManageService {
  // 请求实例
  private request = RequestService.getInstance()

  /**
   * 查询资产列表
   */
  getList(
    paramsQuery: AssetQueryInput,
    requestPlugins: RequestPlugin[] = [],
  ): Promise<PageResonse<AssetQueryOutItem>> {
    // 请求数据
    return this.request.send(
      {
        path: '/api/file/list',
        method: RequestMethod.Get,
        paramsQuery,
      },
      requestPlugins,
    )
  }
}
