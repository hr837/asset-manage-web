import type { AssetStatus } from '@/types/common-enum'
import type { PhotoShape } from '@/types/digital-asset.type'

/** 默认图片 */
export interface ImageTempleteOutput {
  /** 资产ID */
  id: string
  /** 图片文件在服务器位置 */
  url: string
  /** 图片名称 */
  name: string
}

export interface VoiceTempleteOutput {
  audioLanguage: string
  audioSex: string
  audioTag: string
  id: string
  name: string
  url: string
}

/** 生成声音请求数据 */
export interface GenAduioInput {
  audio_id: string
  /**
   * 输入的文本
   */
  text: string
}

export interface ImageEditInput {
  /**
   * 资产文件id
   */
  id: string
  /** 资产名称 */
  name: string
  /** 图片形状 */
  shape: PhotoShape
  /**
   * 输入的文本
   */
  text: string
  /** 选择的声音ID */
  audioId: string
  /**
   * 是否使用分辨率增强，0 不使用，1使用
   */
  use_enhancer: number
}

export interface ImageEditOutput {
  fileId: string
}

export interface QueryImageListInput {
  /**
     * 结束时间
     */
  endDate?: string
  /**
     * 资产名称
     */
  name?: string
  /**
     * 开始时间
     */
  startDate?: string
  /**
     * 资产状态,传数字（1.仅上传-2.排队中-3.转换中-4.转换失败-5.转换完成）
     */
  status?: AssetStatus
}

export interface QueryImageListOutput {
  /** 声音ID */
  audioId: string
  /**
   * 资产文件id
   */
  id: string
  /**
   * 转换失败时的原因说明
   */
  message: string
  /**
   * 文件名称
   */
  name: string
  /**
   * 文件访问url
   */
  sourceFileUrl: string
  /**
   * 资产状态（1.仅上传-2.排队中-3.转换中-4.转换失败-5.转换完成）
   */
  status: AssetStatus
  shape: PhotoShape
  /** 用户输入的文案，分段标识‘##’ */
  text: string
  /** 视频文件相对路径 */
  videoFileUrl: string
}

export interface GenAudioOutput {
  /** 生成的声音 */
  audioUrl: string
}
