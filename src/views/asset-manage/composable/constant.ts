import type { AssetStateItem } from '@/types/asset-info.type'

/** 资产状态字典 */
export const AssetStatusDict: AssetStateItem[] = [
  {
    key: 1,
    label: '仅上传',
  },
  {
    key: 2,
    label: '排队中',
  },
  {
    key: 3,
    label: '转换中',
  },
  {
    key: 4,
    label: '转换失败',
  },
  {
    key: 5,
    label: '转换完成',
  },
]
