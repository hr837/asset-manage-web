/** 资产状态 */
export enum AssetStatus {
  /** 仅保存 */
  SAVE = 1,
  /** 排队中 */
  QUEUE = 2,
  /** 转换中 */
  TRANSFORM = 3,
  /** 转换失败 */
  FAIL = 4,
  /** 转换完成 */
  SUCCESSFUL = 5,
}
