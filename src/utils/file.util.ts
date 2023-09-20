import SparkMD5 from 'spark-md5'

/**
 * 获取video文件的时长
 * @param file video文件
 * @returns 返回视频文件的长度近似整数值
 */
export function getVideoDuration(file: Blob) {
  const url = URL.createObjectURL(file)
  // 内存创建视频对象
  const video = document.createElement('video')
  return new Promise<number>((resolve, reject) => {
    video.src = url
    video.oncanplay = () => resolve(Math.round(video.duration))
    video.onerror = () => reject(new Error('文件时长不可读取'))
  }).finally(() => URL.revokeObjectURL(url)) // 始终释放资源
}

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
export function fileSlice(file: File, chunkSize = 1048576) {
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

    console.log('slice:', index)

    start = end
    index++
  }
  return result
}

/**
 * 对文档数据进行MD5计算
 * @param fileParts 对文件切片的Blob数组,也可以是单个文件
 * @param partCalculated 某一部分计算完毕
 * @returns 计算完成的md5
 */
export function calculateMD5(fileParts: Blob[], partCalculated: (partIndex: number) => void) {
  const bufferMD5 = new SparkMD5.ArrayBuffer()
  // 生成计算任务
  const task = fileParts.map((part, index) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader()
      fileReader.onload = (e) => {
        console.log('read:', index)
        bufferMD5.append(e.target?.result as ArrayBuffer)
        // 向外部传递，第几部分计算完毕
        partCalculated(index)
        resolve(true)
      }
      fileReader.onerror = () => {
        fileReader.abort()
        reject(new Error('读取文件流失败'))
      }
      fileReader.readAsArrayBuffer(part)
    })
  })
  // 异步返回最终的md5
  return Promise.all(task).then(() => bufferMD5.end()).finally(() => bufferMD5.destroy())
}
