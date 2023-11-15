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
