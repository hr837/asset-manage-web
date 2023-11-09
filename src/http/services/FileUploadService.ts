import { RequestMethod, type RequestPlugin, RequestService } from '@gopowerteam/request'
import type { CoverUploadInput, CoverUploadRes, ImagePreuploadInput, PartUploadInput, PartUploadResponse, PreuploadResponse, VideoPreuploadInput } from '../models/upload.model'
export class FileUploadService {
  // 请求实例
  private request = RequestService.getInstance()

  /**
   * 预上传-处理秒传
   */
  preUpload(
    requestBody: VideoPreuploadInput,
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
   * 图片预上传-处理秒传
   */
  imagePreUpload(
    requestBody: ImagePreuploadInput,
    requestPlugins: RequestPlugin[] = [],
  ): Promise<PreuploadResponse> {
    // 请求数据
    return this.request.send(
      {
        path: '/api/image/preUpload',
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
    const form = new FormData()
    form.append('uploadFileId', requestBody.uploadFileId)
    form.append('segmentIndex', `${requestBody.segmentIndex}`)
    form.append('segmentSize', `${requestBody.segmentSize}`)
    form.append('file', requestBody.file)
    form.append('usetype', requestBody.usetype ?? '0')

    // 请求数据
    return this.request.send(
      {
        path: '/api/file/upload',
        method: RequestMethod.Post,
        paramsBody: form,
        headers: {
          'content-type': 'multipart/form-data',
        },
      },
      requestPlugins,
    )
  }

  /**
   * 上传视频封面
   */
  coverUpload(
    requestBody: CoverUploadInput,
    requestPlugins: RequestPlugin[] = [],
  ): Promise<CoverUploadRes> {
    const form = new FormData()
    form.append('uploadFileId', requestBody.uploadFileId)
    form.append('Size', `${requestBody.file.size}`)
    form.append('file', requestBody.file)
    // 请求数据
    return this.request.send(
      {
        path: '/api/file/cover_upload',
        method: RequestMethod.Post,
        paramsBody: form,
        headers: {
          'content-type': 'multipart/form-data',
        },
      },
      requestPlugins,
    )
  }
}
