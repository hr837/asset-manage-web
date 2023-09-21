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
}

export interface PreuploadResponse {
  /**
   * 是否做了秒传，true表示做了秒传,该文件已上传成功
   */
  fastUpload: boolean
  /**
   * 文件名已存在，true表示已存在
   */
  fileNameExists: boolean
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
  segmentIndex: string
  /**
   * 分片大小
   */
  segmentSize: string
  /**
   * 上传文件id
   */
  uploadFileId: string
}

export interface PartUploadResponse {
  /** 文件上传结果 */
  fileUploadResult: boolean
  /**
   * 未上传的分片序号数组,如果当前上传的分片为最后一个分片，会检查是否还有未上传的分片，然后返回给前端
   */
  needSegment: string[]
  /** 分片上传结果 */
  result: boolean
  /** 分片索引 */
  segmentIndex: boolean
  uploadFileId: number
}
