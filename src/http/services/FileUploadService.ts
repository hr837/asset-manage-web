import { RequestMethod, type RequestPlugin, RequestService } from '@gopowerteam/request'
import type { PartUploadInput, PartUploadResponse, PreuploadInput, PreuploadResponse } from '../models/upload.model'
export class FileUploadService {
  // 请求实例
  private request = RequestService.getInstance()

  /**
   * 预上传-处理秒传
   */
  preUpload(
    requestBody: PreuploadInput,
    requestPlugins: RequestPlugin[] = [],
  ): Promise<PreuploadResponse> {
    // 请求数据
    return this.request.send(
      {
        path: '/api/file/preUpload',
        method: RequestMethod.Post,
        paramsBody: requestBody,
      },
      requestPlugins,
    )
  }

  /**
   * 分片上传
   */
  partUpload(
    requestBody: PartUploadInput,
    requestPlugins: RequestPlugin[] = [],
  ): Promise<PartUploadResponse> {
    // 请求数据
    return this.request.send(
      {
        path: '/api/upload',
        method: RequestMethod.Post,
        paramsBody: requestBody,
        headers: {
          'content-type': 'application/x-www-form-urlencoded',
        },
      },
      requestPlugins,
    )
  }
}
