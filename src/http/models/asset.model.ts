export interface AssetQueryInput {
  /**
   * 结束时间
   */
  endDate?: string
  /**
   * 资产名称
   */
  name?: string
  /**
   * 开始时间
   */
  startDate?: string
  /**
   * 资产状态,传数字（1.仅上传-2.排队中-3.转换中-4.转换失败-5.转换完成）
   */
  status?: number

  /** 资产ID */
  id?: string
}

export interface AssetQueryOutItem {
  id: string
  /** 转换已用时长 */
  convertAlreadyWaitTime?: string
  /** 转换开始时间 */
  convertTime?: string
  /** 转换完成用时 */
  convertTotalTime?: string
  extensionName?: string
  fbxFileUrl?: string
  /** 排队等待已用时长 */
  lineAlreadyWaitTime?: string
  /** 排队总用时 */
  lineTotalTime?: string
  /** 文件名 */
  name?: string
  /** 源文件地址 */
  sourceFileUrl?: string
  /**
   * 资产状态,传数字（1.仅上传-2.排队中-3.转换中-4.转换失败-5.转换完成）
  */
  status: number
  /** 上传时间 */
  uploadTime?: string
  /** 当前转换进度 */
  processStage?: string
  /** 失败原因 */
  message?: string
  /** 预估排队时长 */
  predictLineTime?: string
}
