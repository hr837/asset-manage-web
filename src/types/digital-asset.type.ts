export type PhotoSize = 'O' | 'S' | 'C' | 'L'
export type SoundLang = 'CN' | 'EN'
export type SoundType = 'male' | 'female'

export interface SoundInfo {
  id: string
  /** 标签 */
  tags: string[]
  /** 声音名称 */
  name: string
  /** 声音语言 */
  lang: SoundLang
  /** 声音类型 */
  type: SoundType
  /** 声音文件 */
  url: string
  /** 头像 */
  avatar?: string
}
