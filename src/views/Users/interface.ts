import { IDataItem as TemplateType } from '../Temp/interface'

/** 表格行数据 */
export interface IDataItem {
  /** 用户ID */
  id?: string
  /** 用户id(标识当前应用的用户id) */
  uniqueId?: string
  /** 姓名 */
  fullName: string
  /** 手机号 */
  phoneNumber: string
  /** 租户id */
  tenantId?: string
  /** 租户 */
  tenantName?: string
  /** 邮箱 */
  email?: string
  /** 公司 */
  company?: string
  /** 部门 */
  dept?: string
  /** 职位 */
  position?: string
  /** 企业官网 */
  website?: string
  /** 地址 */
  address?: string
  /** 名片模板 id */
  companyTemplateId?: number
  /** 创建时间 */
  creationTime?: string
  /** 修改时间 */
  modifyTime?: string
}

/** 弹窗类型 insertUser新增 updateUser修改 viewUser查看 */
export type IModalType = 'insertUser' | 'updateUser' | 'viewUser'

export interface IState {
  /** 表格loading */
  loading: boolean
  /** 表格数据 */
  pageData: PageDataDefine<IDataItem>
  /** 已选择的表格行key */
  selectedRowKeys: ColumnKey[]
  /** 搜索form */
  searchForm: Pick<IDataItem, 'fullName' | 'phoneNumber'>
  /** 弹窗visible */
  modalVisible: boolean
  /** 弹窗form */
  modalForm: IDataItem
  /** 弹窗类型 */
  modalType: IModalType
  /** 公司模板 */
  companyTemplateList: TemplateType[]
}
