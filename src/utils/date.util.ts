import dayjs from 'dayjs'

/** 格式化时间戳 */
export function formatTimeSpan(times?: string) {
  if (!times)
    return ''
  const d = dayjs(Number.parseInt(times))
  if (!d.isValid())
    return ''
  return d.format('mm分ss秒')
}
