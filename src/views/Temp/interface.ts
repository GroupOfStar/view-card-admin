/** 公司模板item */
export interface ITempItem {
  /** id */
  id?: number
  /** 租户id */
  tenantId?: string
  /** 模板名称 */
  templateAlias?: string
  /** 模板内容 */
  companyProfile?: string
  /** 是否为默认模板 */
  isDefault?: '是' | '否'
  /** 创建时间 */
  creationTime?: string
  /** 创建人 */
  creationBy?: string
  /** 修改时间 */
  modifyTime?: string
  /** 修改人 */
  modifyBy?: string
}

/** 弹窗类型 save新增 update修改 */
export type IModalType = 'save' | 'update'

/** 模块数据 */
export interface ICompanyTempItem {
  uuid: string
  label: string
  contents: {
    uuid: string
    type: '图片链接' | '文本'
    value: string
  }[]
}

export interface IState {
  /** 表格loading */
  loading: boolean
  /** 表格数据 */
  pageData: PageDataDefine<ITempItem>
  /** 弹窗visible */
  modalVisible: boolean
  /** 弹窗form */
  modalForm: ITempItem
  /** 弹窗类型 */
  modalType: IModalType
}
