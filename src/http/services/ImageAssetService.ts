import { RequestMethod, type RequestPlugin, RequestService } from '@gopowerteam/request'
import type { PreuploadResponse } from '../models/upload.model'
import type { AssetQueryOutItem } from '../models/asset.model'
export class ImageAssetService {
  // 请求实例
  private request = RequestService.getInstance()

  /**
   * 照片人脸检测
   * @deprecated 上传时直接检测人脸
   */
  facedetect(
    assetId: string,
    requestPlugins: RequestPlugin[] = [],
  ): Promise<PreuploadResponse> {
    // 请求数据
    return this.request.send(
      {
        path: '/api/image/facedetect',
        method: RequestMethod.Post,
        paramsBody: {
          id: assetId,
        },
      },
      requestPlugins,
    )
  }

  /**
   * 获取图片资产详情
   */
  query(
    assetId: string,
    requestPlugins: RequestPlugin[] = [],
  ): Promise<AssetQueryOutItem> {
    // 请求数据
    return this.request.send(
      {
        path: '/api/image/query',
        method: RequestMethod.Post,
        paramsBody: {
          id: assetId,
        },
      },
      requestPlugins,
    )
  }
}
