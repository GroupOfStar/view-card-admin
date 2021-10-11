import { IUserItem } from '../User/interface'

/** 权限角色 */
export type IRoleType = '01' | '02'

/** 表格行数据 */
export interface IAuthItem
  extends Pick<IUserItem, 'email' | 'tenantId' | 'tenantName' | 'position'> {
  /** 用户ID */
  id?: string
  /** 姓名 */
  name: string
  /** 手机号 */
  loginId: string
  /** 权限角色 */
  roleId: IRoleType
  /** 创建时间 */
  createTime?: string
}

export interface IState {
  /** 表格loading */
  loading: boolean
  /** 表格数据 */
  pageData: PageDataDefine<IAuthItem>
  /** 弹窗visible */
  modalVisible: boolean
  /** 弹窗form */
  modalForm: {
    uniqueId?: string
    roleId: IRoleType
  }
  /** 弹窗中员工搜索form */
  userSearch: Partial<Pick<IUserItem, 'fullName' | 'phoneNumber'>>
  /** 弹窗中员工列表 */
  userList: IUserItem[]
}
