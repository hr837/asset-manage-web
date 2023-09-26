export interface MessageQueryOutItem {
  /** 信息id */
  id: string
  /** 关联的资产文件id */
  fileId: string
  /** 资产文件状态 */
  fileStatus: number
  /** 信息内容 */
  message: string
  /** 创建时间 */
  createTime: string
}
