/** 切片信息 */
import SparkMD5 from 'spark-md5'

export interface FilePart {
  /** 切片索引 */
  index: number
  /** 当前切片的大小 */
  size: number
  /** 切片二进制数据 */
  part: Blob
}

/**
 * 将文件切片
 * @param file 要切片的文件
 * @param chunkSize 切片大小，默认：1048576字节，1MB
 */
export function fileSlice(file: Blob, chunkSize = 1048576) {
  // 切片起始位置
  let start = 0
  let index = 0
  const result: FilePart[] = []
  while (start < file.size) {
    // 取最小的截断数值
    const end = Math.min(start + chunkSize, file.size)
    // 文件截断部分
    const part = file.slice(start, end)
    result.push({
      index,
      size: end - start,
      part,
    })
    start = end
    index++
  }
  return result
}

const AssetPrefix = '/asset/'
type FileType = 'video' | 'fbx' | 'image' | 'bvh'

/**
 * 下载资源文件
 * @param path 文件服务器路径
 * @param fileName 文件名称
 * @param type 文件类型 video、fbx
 */
export function downloadFile(path: string, fileName: string, type: FileType) {
  const url = getFilePath(path, type)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
}

/**
 * 获取资源文件在服务器的位置
 * @param relativePath 资源相对路径
 * @param type  资源类型
 * @returns
 */
export function getFilePath(relativePath: string, type: FileType) {
  if (relativePath.startsWith(AssetPrefix))
    return relativePath
  const arr = [AssetPrefix, type, relativePath]
  if (!/^\//.test(relativePath))
    arr.splice(2, 0, '/')
  return arr.join('')
}

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
