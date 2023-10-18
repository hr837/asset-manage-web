import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

/**
 * 获取时间周期
 */
export function getDuration(times?: string) {
  if (!times)
    return ''
  const d = dayjs.duration(Number.parseInt(times), 'second')
  if (d.days() > 0)
    return d.format('D天H小时m分')
  else if (d.hours() > 0)
    return d.format('H小时m分s秒')
  else if (d.minutes() > 0)
    return d.format('m分s秒')
  else
    return d.format('s秒')
}
