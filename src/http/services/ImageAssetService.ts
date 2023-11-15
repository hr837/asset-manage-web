import { RequestMethod, type RequestPlugin, RequestService } from '@gopowerteam/request'
import type { PreuploadResponse } from '../models/upload.model'
import type { AssetQueryOutItem } from '../models/asset.model'
import type { PageResonse } from '../models/page.model'
import type { GenAduioInput, ImageTempleteOutput, VoiceTempleteOutput } from '../models/asset-image.model'
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

  /**
   * 获取默认图片资源
   * @param requestPlugins
   * @returns
   */
  getPubImages(
    requestPlugins: RequestPlugin[] = [],
  ): Promise<PageResonse<ImageTempleteOutput>> {
    // 请求数据
    return this.request.send(
      {
        path: '/api/pubImage/list',
        method: RequestMethod.Get,
      },
      requestPlugins,
    )
  }

  /**
   * 获取默认声音资源
   * @param requestPlugins
   * @returns
   */
  getPubVoices(
    requestPlugins: RequestPlugin[] = [],
  ): Promise<PageResonse<VoiceTempleteOutput>> {
    // 请求数据
    return this.request.send(
      {
        path: '/api/pubAudio/list',
        method: RequestMethod.Get,
      },
      requestPlugins,
    )
  }

  /** 文本语句生成音频 */
  genAudio(
    requestBody: GenAduioInput,
    requestPlugins: RequestPlugin[] = [],
  ): Promise<AssetQueryOutItem> {
    // 请求数据
    return this.request.send(
      {
        path: '/api/audio/genAudio',
        method: RequestMethod.Post,
        paramsBody: {
          ...requestBody,
          use_enhancer: 0,
        },
      },
      requestPlugins,
    )
  }
}
