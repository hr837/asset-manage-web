import type { AssetQueryOutItem } from '@/http/models/asset.model'

export type AssetActionCommand = 'download' | 'downloadFbx' | 'transfrom' | 'delete'

export type AssetInfo = AssetQueryOutItem

/** 资产状态 */
export interface AssetStateItem {
  /** 状态值 */
  key: number
  /** 状态标签 */
  label: string
}

/** 资产时间节点信息 */
export type AssetTimeInfo = Pick<AssetInfo, 'status' | 'convertAlreadyWaitTime' | 'convertTime' | 'convertTotalTime' | 'lineAlreadyWaitTime' | 'lineTotalTime' | 'uploadTime' | 'processStage' | 'predictLineTime'>

/** 页面查询参数定义 */
export interface RouteQeuryInfo {
  n: string
  ts: string
  te: string
  pi: string
  pz: string
  s: string
}
