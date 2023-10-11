export interface PreuploadInput {
  /**
   * 文件大小
   */
  fileSize: number
  /**
   * 文件的md5值
   */
  md5: string
  /**
   * 原始文件名
   */
  originFileName: string
  /**
   * 父目录id,根目录给0
   */
  parentId: number

  /** 是否自动转换 */
  auto: 0 | 1
  /** 视频时长 */
  duration: number
}

export interface PreuploadResponse {
  /**
   * 是否做了秒传，true表示做了秒传,该文件已上传成功
   */
  fastUpload: boolean
  /**
   * 文件名已存在，true表示已存在
   */
  fileExists: boolean
  /**
   * 分片数量
   */
  segmentCount: string
  /**
   * 分片大小，默认是4194304B，也就是4M
   */
  segmentSize: string
  /**
   * 即将上传的文件的id，后续上传时，需要这个id做参数
   */
  uploadFileId: string
}

export interface PartUploadInput {
  /**
   * 分片文件流
   */
  file: Blob
  /**
   * 分片序号
   */
  segmentIndex: number
  /**
   * 分片大小
   */
  segmentSize: number
  /**
   * 上传文件id
   */
  uploadFileId: string
}

export interface PartUploadResponse {
  /**
   * 文件上传结果
   * 如果上传分片后，服务端已校验分片齐全并MD5正确，则返回文件上传成功
   */
  fileUploadResult: boolean
  /**
   * 未上传的分片序号数组,如果当前上传的分片为最后一个分片，会检查是否还有未上传的分片，然后返回给前端,
   *
   * ！！！序号，不是索引，需要减1.
   */
  needSegment: number[]
  /** 分片上传结果 */
  result: boolean
  /** 分片ID */
  segmentFileId: string
  /** 分片是否上传成功 */
  segmentFileUploadResult: boolean
  /** 文件ID */
  fileId: string
}
