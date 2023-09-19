import type { AssetQueryInput } from '@/http/models/asset.model'

export type AssetActionCommand = 'download' | 'downloadFbx' | 'transfrom' | 'delete'

export interface AssetInfo {
  id: string
  name: string
  status: number
  uploadDate: string
  trasformDate?: string
  url?: string
}

/** 资产状态 */
export interface AssetStateItem {
  /** 状态值 */
  key: number
  /** 状态标签 */
  label: string
}

export type AssetQueryFormData = Omit<AssetQueryInput, 'status'>
