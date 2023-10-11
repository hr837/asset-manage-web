import { shallowRef } from 'vue'

interface FileInfo {
  /** 原始文件 */
  raw: File
  /** 文件在列表的ID */
  uid: number
  /** 预上传后的文件id */
  uploadFileId: string
  uploaded: boolean
  /** 是否可以上传 */
  canUpload: boolean
  /** 文件时长 */
  duration: number
}

/** 文件列表 */
export const fileList = shallowRef<FileInfo[]>([])

/** 获取单个文件信息 */
export const getFileInfo = (uid: number) => fileList.value.find(x => x.uid === uid)
