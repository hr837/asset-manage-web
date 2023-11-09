import { RequestMethod, type RequestPlugin, RequestService } from '@gopowerteam/request'
import type { PreuploadResponse } from '../models/upload.model'
export class ImageAssetService {
  // 请求实例
  private request = RequestService.getInstance()

  /**
   * 照片人脸检测
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
}
