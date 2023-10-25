/** 资产状态字典 */
export const AssetStatusDict = [
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

/**
 * [背景，前景]
 */
export const TagColors: Record<number, [string, string]> = {
  1: ['#FFF9E3', '#CB9F02'],
  2: ['#E0EBFF', '#336EDF'],
  3: ['#EFE8FF', '#9D71FF'],
  4: ['#FFECEC', '#E55151'],
  5: ['#E6FFE5', '#51AA32'],
}
