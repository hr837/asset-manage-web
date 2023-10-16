import SparkMD5 from 'spark-md5'
import { fileSlice } from '@/utils/file.util'

// 计算文件大小
export function getVideoSize(size: number) {
  const kb = Math.round(size / 1024)
  if (kb < 1024) {
    return `${kb}KB`
  }
  else {
    const mb = Math.round(size / 1024 / 1024)
    return `${mb}MB`
  }
}

const MIN_CHUNKSIZE = 1024 * 1024

/** 切片信息 */
export interface FilePart {
  /** 切片索引 */
  index: number
  /** 当前切片的大小 */
  size: number
  /** 切片二进制数据 */
  part: Blob
}

/**
 *
 * @param file 要分片的文件
 * @param chunkSize 切片大小
 * @param progressChange 切片进度回调
 * @returns
 */
export function getSliceFileMd5(file: Blob, chunkSize = MIN_CHUNKSIZE, progressChange: (precent: number) => void) {
  return new Promise<{ md5: string; fileParts: FilePart[] }>((resolve, reject) => {
    if (chunkSize < MIN_CHUNKSIZE)
      reject(new Error('切片尺寸太小，需调整参数'))
    const fileReader = new FileReader()
    // 使用buffer 缓存叠加读取
    const sparkBuffer = new SparkMD5.ArrayBuffer()
    // 分片的文件
    const fileParts = fileSlice(file, chunkSize)

    let partIndex = 0

    fileReader.onload = (e) => {
      sparkBuffer.append(e.target?.result as ArrayBuffer)
      partIndex++
      // 进度
      const precent = partIndex / fileParts.length
      progressChange(precent * 100)
      if (precent < 1) {
        fileReader.readAsArrayBuffer(fileParts[partIndex].part)
      }
      else {
        const md5 = sparkBuffer.end()
        resolve({
          md5,
          fileParts,
        })
      }
    }
    fileReader.onerror = () => reject(new Error('读取文件流失败'))
    fileReader.readAsArrayBuffer(fileParts[partIndex].part)
  })
}
