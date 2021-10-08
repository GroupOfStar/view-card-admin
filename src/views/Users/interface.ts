// 公司模板item
export interface TemplateType {
  id: number
  /** 模板名称 */
  templateAlias: string
  /** 租户id */
  tenantId?: string
  /** 模板内容 */
  companyProfile?: string
  /** 是否为默认模板 */
  isDefault?: '是' | '否'
}

export interface baseUserType {
  /**姓名 */
  fullName: string
  /**手机号 */
  phoneNumber: string
  /**邮箱 */
  email?: string
  /**公司 */
  company?: string
  /**部门 */
  dept?: string
  /**职位 */
  position?: string
  /**企业官网 */
  website?: string
  /**地址 */
  address?: string
}

export interface IDataItem extends baseUserType {
  /** 用户ID */
  id?: string
  /** 用户id(标识当前应用的用户id) */
  uniqueId?: string
  /** appId（应用） */
  appId?: string
  /** 类型（数据来源） */
  type?: '1'
  /** 公司模板ID */
  companyTemplateId?: number
  /** 名片样式 */
  cardFormat?: string
  /** 名片背景 */
  cardBackdrop?: string
  /** 字体颜色 */
  fontColor?: string
  /** 用户权限 */
  userRight?: string
  /** 用户头像路径 */
  profileUrl?: string
  /** 传间时间 */
  creationTime?: string
  /** 修改时间 */
  modifyTime?: string
  /** 公司信息 */
  companyProfile?: string
  cardType?: string
}

/** 弹窗类型 */
export type IModalType = 'insertUser' | 'updateUser'

export interface IState {
  loading: boolean
  pageData: PageDataDefine<IDataItem>
  selectedRowKeys: ColumnKey[]
  searchForm: Pick<IDataItem, 'fullName' | 'phoneNumber'>
  modalVisible: boolean
  modalForm: IDataItem
  /** 弹窗类型 */
  modalType: IModalType
  /** 公司模板 */
  companyTemplateList: TemplateType[]
}
