import type { AssetQueryInput, AssetQueryOutItem } from '@/http/models/asset.model'

export type AssetActionCommand = 'download' | 'downloadFbx' | 'transfrom' | 'delete'

export type AssetInfo = AssetQueryOutItem

/** 资产状态 */
export interface AssetStateItem {
  /** 状态值 */
  key: number
  /** 状态标签 */
  label: string
}

export type AssetQueryFormData = Omit<AssetQueryInput, 'status'>
