import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

/**
 * 获取时间周期
 */
export function getDuration(milliseconds?: string) {
  if (!milliseconds)
    return ''
  const d = dayjs.duration(Number.parseInt(milliseconds), 'ms')
  if (d.days() > 0)
    return d.format('D天H小时m分')
  else if (d.hours() > 0)
    return d.format('H小时m分s秒')
  else if (d.minutes() > 0)
    return d.format('m分s秒')
  else
    return d.format('s秒')
}

/**
 * 获取视频的时常
 * @param inputSeconds 视频的时长 单位秒
 * @returns 格式化后的时长字符串
 */
export function getVideoDuration(inputSeconds: number) {
  if (!inputSeconds)
    return ''
  let val = typeof inputSeconds === 'string' ? Number.parseInt(inputSeconds) : inputSeconds
  val = Math.floor(val)
  const d = dayjs.duration(val, 's')
  const minutes = d.minutes()
  const seconds = d.seconds()
  if (minutes > 0 && seconds === 0)
    return `${minutes}min`
  else if (minutes > 0 && seconds > 0)
    return `${minutes}min ${seconds}s`
  else
    return `${seconds}s`
}
