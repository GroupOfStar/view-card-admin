declare module '*.vue'
declare module '*.css'
declare module '*.scss'
declare module '*.less'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.webp'
declare module '*.gif'
declare module '*.svg'

interface IPageRequestParams {
  page: number
  limit: number
}

interface IPagePropType {
  currPage?: number
  pageSize?: number
  totalCount?: number
}

interface IResponseDefine<T = undefined> {
  data: T
  status: number
  statusText: string
}

type PageDataDefine<T> = Required<IPagePropType> & { list: T[] }

/**
 * 下拉项、lookUp、状态的枚举接口
 * @interface IStatusEnum
 * @template T
 */
interface IStatusEnum<T = string> {
  title: string
  value: T
  color?: string
  icon?: import('vue').VNode
}

/** 表格列配置 */
type ColumnProps = import('ant-design-vue/lib/table/interface').ColumnProps

/** 表格的key类型 */
type ColumnKey = ColumnProps['key']
