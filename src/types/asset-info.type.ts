export type AssetState = '仅上传' | '排队中' | '转换中' | '转换失败' | '转换完成'
export type AssetActionCommand = 'download' | 'downloadFbx' | 'transfrom' | 'delete'

export interface QueryForm {
  /** 用户名 */
  name: string
  /** 创建时间 */
  date: [string, string]
}

export interface AssetInfo {
  id: string
  name: string
  state: AssetState
  uploadDate: string
  trasformDate?: string
}
