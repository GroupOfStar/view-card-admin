/** 资源类型 */
export type IResourceType = '01' | '02'

/** 分类标签 */
export interface ICategoryTagItem {
  /** 分类id */
  secondaryCategoryId: string
  /** 分类 */
  secondaryCategory?: string
}

/** 表格行数据 */
export interface INewsItem {
  /** 用户ID */
  id?: string
  /** 标题名称 */
  titleName?: string
  /** 资源类型 */
  resourceType?: IResourceType
  /** 分类id */
  secondaryCategoryId?: ICategoryTagItem['secondaryCategoryId']
  /** 分类 */
  secondaryCategory?: ICategoryTagItem['secondaryCategory']
  /** 新闻链接 */
  resourceUrl?: string
  /** 图片链接 */
  summaryUrl?: string
  /** 租户 */
  tenantName?: string
  /** 排序权重 */
  reorder: number
  /** 内容 */
  remark?: number
  /** 发布时间 */
  getTime?: string
  /** 创建时间 */
  createTime?: string
}

/** 弹窗类型 insert新增 update修改 view查看 */
export type IModalType = 'insert' | 'update' | 'view'

export interface IState {
  /** 表格loading */
  loading: boolean
  /** 表格数据 */
  pageData: PageDataDefine<INewsItem>
  /** 分类标签 */
  categoryTags: ICategoryTagItem[]
  /** 搜索form */
  searchForm: Pick<INewsItem, 'resourceType' | 'titleName'>
  /** 弹窗visible */
  modalVisible: boolean
  /** 弹窗form */
  modalForm: INewsItem
  /** 弹窗类型 */
  modalType: IModalType
}
