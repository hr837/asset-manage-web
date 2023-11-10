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

/** 数字中心，默认的模板 */
export const DefaultCards = [
  { id: 'local-1', label: '圣诞老人', image: require('/public/images/digital/templates/santa.jpg') },
  { id: 'local-2', label: '欧美', image: require('/public/images/digital/templates/US-woman.jpg') },
  { id: 'local-3', label: '卡通少女1', image: require('/public/images/digital/templates/cartoon-girl1.jpg') },
  { id: 'local-4', label: '卡通少女2', image: require('/public/images/digital/templates/cartoon-girl2.jpg') },
  { id: 'local-5', label: '赛博少女', image: require('/public/images/digital/templates/girl.jpg') },
  { id: 'local-6', label: '少年1', image: require('/public/images/digital/templates/juvenile1.jpg') },
  { id: 'local-7', label: '少年2', image: require('/public/images/digital/templates/juvenile2.jpg') },
  { id: 'local-8', label: '少年2', image: require('/public/images/login-front.png') },
]
