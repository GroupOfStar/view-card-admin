import { defineComponent, reactive, createVNode } from 'vue'
import {
  Space,
  Button,
  Table,
  Upload,
  message,
  Modal,
  Popconfirm,
  Form,
  Input,
  Select,
  Col,
  Row,
  Divider,
} from 'ant-design-vue'
import {
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
  DownloadOutlined,
  SearchOutlined,
  UndoOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons-vue'
import { useForm } from '@ant-design-vue/use'
import { IDataItem, IState } from './interface'
import { IDataItem as TemplateType } from '../Temp/interface'
import moment from 'moment'
import request, { baseURL } from '@/utils/request'

/** 表管理列 */
const Columns: ColumnProps = [
  {
    title: '姓名',
    dataIndex: 'fullName',
    width: 100,
    slots: { customRender: 'fullName' },
  },
  { title: '手机号', dataIndex: 'phoneNumber', width: 110 },
  { title: '租户', dataIndex: 'tenantName', ellipsis: true },
  { title: '邮箱', dataIndex: 'email', ellipsis: true },
  { title: '职位', dataIndex: 'position', ellipsis: true },
  {
    title: '修改时间',
    dataIndex: 'modifyTime',
    width: 130,
    slots: { customRender: 'modifyTime' },
  },
  {
    title: '创建时间',
    dataIndex: 'creationTime',
    width: 130,
    align: 'center',
    slots: { customRender: 'creationTime' },
    sorter(record1: IDataItem, record2: IDataItem) {
      if (record1.creationTime && record2.creationTime)
        return moment(record1.creationTime).isBefore(record2.creationTime)
      else return true
    },
  },
  {
    title: '操作',
    width: 110,
    align: 'center',
    slots: { customRender: 'operation' },
  },
]

/** 用户管理 */
export default defineComponent(function Users() {
  const state = reactive<IState>({
    loading: false,
    pageData: {
      currPage: 1,
      pageSize: 10,
      totalCount: 0,
      list: [],
    },
    selectedRowKeys: [],
    searchForm: {
      fullName: '',
      phoneNumber: '',
    },
    modalVisible: false,
    modalForm: {
      uniqueId: undefined,
      fullName: '',
      phoneNumber: '',
      email: undefined,
      company: undefined,
      dept: undefined,
      position: undefined,
      website: undefined,
      address: undefined,
      companyTemplateId: undefined,
    },
    modalType: 'insertUser',
    companyTemplateList: [],
  })

  const {
    resetFields: searchFormReset,
    validateInfos: searchFormValidateInfos,
  } = useForm(
    state.searchForm,
    reactive({
      fullName: [{ required: false, type: 'string' }],
      phoneNumber: [{ required: false, type: 'string' }],
    })
  )

  const rulesRef = reactive({
    uniqueId: [{ required: false, type: 'string' }],
    fullName: [{ required: true, message: '不能为空！' }],
    phoneNumber: [
      { required: true, message: '不能为空!' },
      {
        pattern: /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/,
        message: '请输入正确的手机号！',
        trigger: 'change',
      },
    ],
    email: [
      { required: false, message: '请输入正确的邮箱格式!', type: 'email' },
    ],
    company: [{ required: false, type: 'string' }],
    dept: [{ required: false, type: 'string' }],
    position: [{ required: false, type: 'string' }],
    website: [{ required: false, type: 'string' }],
    address: [{ required: false, type: 'string' }],
    companyTemplateId: [{ required: false, type: 'number' }],
  })

  const { resetFields, validate, validateInfos } = useForm(
    state.modalForm,
    rulesRef
  )

  // 列表请求
  const getUserList = (
    payload: IPageRequestParams = { page: 1, limit: 10 }
  ) => {
    const url = '/framework-wechart/manager/queryUserList'
    const params = { ...state.searchForm, ...payload }
    request
      .post<IResponseDefine<PageDataDefine<IDataItem>>>(url, params)
      .then(res => {
        const { status, statusText, data } = res.data
        if (status === 0) {
          state.pageData = data
        } else {
          message.error(statusText)
        }
      })
      .finally(() => {
        state.loading = false
      })
  }
  getUserList()

  // 重置搜索
  const hanldeResetSearch = () => {
    searchFormReset()
    getUserList()
  }

  // 批量导入
  const onUpload = ({ file }: { file: { status: string } }) => {
    if (file.status !== 'uploading') {
      message.loading('正在上传...')
    }
    if (file.status === 'done') {
      message.success('导入成功！')
      getUserList()
    } else if (file.status === 'error') {
      message.error('导入失败！')
    }
  }

  // 请求公司模板数据
  const getCompanyTemplateList = () => {
    if (state.companyTemplateList.length === 0) {
      const url = '/framework-wechart/manager/selectTemplate'
      request.post<IResponseDefine<TemplateType[]>>(url).then(res => {
        const { status, statusText, data } = res.data
        if (status === 0) {
          state.companyTemplateList = data
        } else {
          message.error(statusText)
        }
      })
    }
  }

  // 查看
  const handleView = (record: IDataItem) => {
    getCompanyTemplateList()
    state.modalForm.uniqueId = record.uniqueId
    state.modalForm.fullName = record.fullName
    state.modalForm.phoneNumber = record.phoneNumber
    state.modalForm.email = record.email
    state.modalForm.company = record.company
    state.modalForm.dept = record.dept
    state.modalForm.position = record.position
    state.modalForm.website = record.website
    state.modalForm.address = record.address
    state.modalForm.companyTemplateId = record.companyTemplateId

    state.modalType = 'viewUser'
    state.modalVisible = true
  }

  // 新增
  const handleAdd = () => {
    getCompanyTemplateList()
    state.modalType = 'insertUser'
    state.modalVisible = true
  }

  // 编辑
  const handleUpdate = (record: IDataItem) => {
    getCompanyTemplateList()
    state.modalForm.uniqueId = record.uniqueId
    state.modalForm.fullName = record.fullName
    state.modalForm.phoneNumber = record.phoneNumber
    state.modalForm.email = record.email
    state.modalForm.company = record.company
    state.modalForm.dept = record.dept
    state.modalForm.position = record.position
    state.modalForm.website = record.website
    state.modalForm.address = record.address
    state.modalForm.companyTemplateId = record.companyTemplateId

    state.modalType = 'updateUser'
    state.modalVisible = true
  }

  // 请求批量删除接口
  const fetchBatchDeleteUser = (ids: ColumnKey[]) => {
    const url = '/framework-wechart/manager/batchDeleteUser'
    const params = { uniqueIds: ids }
    request.post<IResponseDefine<TemplateType[]>>(url, params).then(res => {
      const { status, statusText } = res.data
      if (status === 0) {
        message.success('删除用户成功！')
        hanldeResetSearch()
      } else {
        message.error(statusText)
      }
    })
  }

  // 批量删除
  const onBatchDelete = () => {
    Modal.confirm({
      title: '确认删除',
      icon: createVNode(ExclamationCircleOutlined),
      content: '是否确认删除所选数据？',
      onOk: () => fetchBatchDeleteUser(state.selectedRowKeys),
    })
  }

  // 取消弹窗
  const hanldeCancel = () => {
    resetFields()
    state.modalVisible = false
  }

  // 提交弹窗
  const hanldeOK = () => {
    validate().then(fields => {
      const url = `/framework-wechart/manager/${state.modalType}`
      request.post<IResponseDefine<TemplateType[]>>(url, fields).then(res => {
        const { status, statusText } = res.data
        if (status === 0) {
          message.success(
            `${
              state.modalType === 'insertUser' ? '新增' : '修改'
            }员工信息成功！`
          )
          hanldeResetSearch()
          hanldeCancel()
        } else {
          message.error(statusText)
        }
      })
    })
  }

  // 分页改变事件
  const onTableChange = (current: number, size: number) => {
    getUserList({ page: current, limit: size })
  }

  return () => (
    <div>
      <Form wrapperCol={{ flex: 'auto' }}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="姓名" {...searchFormValidateInfos.fullName}>
              <Input
                v-model={[state.searchForm.fullName, 'value', ['trim']]}
                allowClear
                placeholder="请输入"
                onPressEnter={getUserList}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item label="手机号" {...searchFormValidateInfos.phoneNumber}>
              <Input
                v-model={[state.searchForm.phoneNumber, 'value', ['trim']]}
                allowClear
                placeholder="请输入"
                onPressEnter={getUserList}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item>
              <Space>
                <Button type="primary" onClick={getUserList}>
                  <SearchOutlined />
                  搜索
                </Button>
                <Button onClick={hanldeResetSearch}>
                  <UndoOutlined />
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Col>
        </Row>
      </Form>

      <Space>
        <Button type="primary" onClick={handleAdd}>
          <PlusOutlined />
          新增
        </Button>

        <Upload
          action={baseURL + '/framework-wechart/manager/batchImport'}
          name="file"
          showUploadList={false}
          accept=".xlsx"
          headers={{
            Authorization: localStorage.getItem('ACCESS_TOKEN'),
          }}
          onChange={onUpload}
        >
          <Button>
            <UploadOutlined />
            批量导入
          </Button>
        </Upload>

        <Button
          onClick={() => {
            location.href = '/assets/员工信息模板.xlsx'
          }}
        >
          <DownloadOutlined />
          下载模板
        </Button>

        <Button
          disabled={state.selectedRowKeys.length === 0}
          onClick={onBatchDelete}
        >
          <DeleteOutlined />
          批量删除
        </Button>
      </Space>

      <Table
        bordered
        size="middle"
        rowKey="uniqueId"
        loading={state.loading}
        columns={Columns}
        dataSource={state.pageData.list}
        pagination={{
          current: state.pageData.currPage,
          pageSize: state.pageData.pageSize,
          total: state.pageData.totalCount,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '15', '30'],
          onChange: onTableChange,
          onShowSizeChange: onTableChange,
          showTotal: (total: number) => `共 ${total} 条`,
        }}
        rowSelection={{
          selectedRowKeys: state.selectedRowKeys,
          onChange: (selectedRowKeys: ColumnKey[]) => {
            state.selectedRowKeys = selectedRowKeys
          },
        }}
        style={{ marginTop: '16px' }}
      >
        {{
          // 姓名
          fullName: ({ record }: { record: IDataItem }) => (
            <a onClick={() => handleView(record)}>{record.fullName}</a>
          ),
          // 修改时间
          modifyTime: ({ text }: { text: IDataItem['modifyTime'] }) =>
            text && moment(text).format('YYYY-MM-DD HH:mm'),
          // 创建时间
          creationTime: ({ text }: { text: IDataItem['creationTime'] }) =>
            text && moment(text).format('YYYY-MM-DD HH:mm'),
          // 操作
          operation: ({ record }: { record: IDataItem }) => (
            <>
              <a onClick={() => handleUpdate(record)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm
                title="是否确认删除？"
                onConfirm={() =>
                  record.uniqueId && fetchBatchDeleteUser([record.uniqueId])
                }
              >
                <a>删除</a>
              </Popconfirm>
            </>
          ),
        }}
      </Table>

      <Modal
        v-model={[state.modalVisible, 'visible']}
        title={`${state.modalType === 'insertUser' ? '新增' : '修改'}员工信息`}
        onCancel={hanldeCancel}
        footer={
          state.modalType === 'viewUser' ? (
            <Button onClick={hanldeCancel}>关 闭</Button>
          ) : (
            <>
              <Button onClick={hanldeCancel}>取 消</Button>
              <Button type="primary" onClick={hanldeOK}>
                确 定
              </Button>
            </>
          )
        }
        width={900}
      >
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Row>
            <Col span="12">
              <Form.Item label="员工姓名" {...validateInfos.fullName}>
                <Input
                  v-model={[state.modalForm.fullName, 'value', ['trim']]}
                  disabled={state.modalType === 'viewUser'}
                  placeholder="请输入..."
                />
              </Form.Item>
            </Col>
            <Col span="12">
              <Form.Item label="手机号" {...validateInfos.phoneNumber}>
                <Input
                  v-model={[state.modalForm.phoneNumber, 'value', ['trim']]}
                  disabled={state.modalType === 'viewUser'}
                  placeholder="请输入..."
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span="12">
              <Form.Item label="邮箱" {...validateInfos.email}>
                <Input
                  v-model={[state.modalForm.email, 'value', ['trim']]}
                  disabled={state.modalType === 'viewUser'}
                  placeholder="请输入..."
                />
              </Form.Item>
            </Col>
            <Col span="12">
              <Form.Item label="公司" {...validateInfos.company}>
                <Input
                  v-model={[state.modalForm.company, 'value', ['trim']]}
                  disabled={state.modalType === 'viewUser'}
                  placeholder="请输入..."
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span="12">
              <Form.Item label="部门" {...validateInfos.dept}>
                <Input
                  v-model={[state.modalForm.dept, 'value', ['trim']]}
                  disabled={state.modalType === 'viewUser'}
                  placeholder="请输入..."
                />
              </Form.Item>
            </Col>
            <Col span="12">
              <Form.Item label="职位" {...validateInfos.position}>
                <Input
                  v-model={[state.modalForm.position, 'value', ['trim']]}
                  disabled={state.modalType === 'viewUser'}
                  placeholder="请输入..."
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span="12">
              <Form.Item label="企业官网" {...validateInfos.website}>
                <Input
                  v-model={[state.modalForm.website, 'value', ['trim']]}
                  disabled={state.modalType === 'viewUser'}
                  placeholder="请输入..."
                />
              </Form.Item>
            </Col>
            <Col span="12">
              <Form.Item label="地址" {...validateInfos.address}>
                <Input
                  v-model={[state.modalForm.address, 'value', ['trim']]}
                  disabled={state.modalType === 'viewUser'}
                  placeholder="请输入..."
                />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <Col span="12">
              <Form.Item label="名片模板" {...validateInfos.companyTemplateId}>
                <Select
                  v-model={[state.modalForm.companyTemplateId, 'value']}
                  disabled={state.modalType === 'viewUser'}
                  placeholder="请选择..."
                  defaultActiveFirstOption={true}
                >
                  {state.companyTemplateList.map(item => (
                    <Select.Option value={item.id}>
                      {item.templateAlias}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
})
