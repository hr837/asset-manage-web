export interface AssetQueryInput {
  /**
   * 结束时间
   */
  endDate: string
  /**
   * 资产名称
   */
  name: string
  /**
   * 开始时间
   */
  startDate: string
  /**
   * 资产状态,传数字（1.仅上传-2.排队中-3.转换中-4.转换失败-5.转换完成）
   */
  status: number
}
