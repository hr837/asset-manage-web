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

/**
 * 下载资源文件
 * @param path 文件服务器路径
 * @param fileName 文件名称
 * @param preFix 文件前缀 /video、/fbx
 */
export function downloadFile(path: string, fileName: string, preFix?: '/video' | '/fbx') {
  const fixedPath = /^\//.test(path) ? path : `/${path}`
  const values = [fixedPath]
  if (preFix)
    values.unshift(preFix)
  values.unshift('/asset')
  const url = values.join('')
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
}
