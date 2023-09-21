export interface PageResonse<T> {
  /** 当前页面 */
  pageNo: number
  /** 当前页行数 */
  pageSize: number
  rows: T[]
  /** 总页数 */
  totalPage: number
  /** 总行数 */
  totalRow: number
}
