import SparkMD5 from 'spark-md5'

const MIN_CHUNKSIZE = 1024 * 1024

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

/**
 * 获取文件MD5
 * @param file
 * @returns
 */
export function getFileMd5(file: Blob) {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = (e) => {
      const md5 = SparkMD5.hashBinary(e.target?.result as string)
      resolve(md5)
    }
    fileReader.onerror = () => reject(new Error('读取文件流失败'))
    fileReader.readAsBinaryString(file)
  })
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

const KB = 1024
const MB = KB * 1024

/** 获取文件尺寸大小 */
export function getFileSizeStr(file: File) {
  const size = file.size
  const kb = Math.round(size / KB)
  const mb = Math.round(size / MB)
  return kb > 1024 ? `${mb}MB` : `${kb}KB`
}
