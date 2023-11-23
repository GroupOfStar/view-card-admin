import { defineComponent, reactive } from 'vue'
import {
  Button,
  Table,
  Modal,
  Popconfirm,
  Form,
  Input,
  Col,
  Row,
  Radio,
  Space,
  message,
} from 'ant-design-vue'
import {
  PlusOutlined,
  SearchOutlined,
  UndoOutlined,
} from '@ant-design/icons-vue'
import { useForm } from '@ant-design-vue/use'
import { IAuthItem, IRoleType, IState } from './interface'
import moment from 'moment'
import request from '@/utils/request'
import { IUserItem } from '../User/interface'

/** 权限角色数据 */
const roleTypeEnum: IStatusEnum<IRoleType>[] = [
  { title: '管理员', value: '01' },
  { title: '运营', value: '02' },
]

/** 表格列配置 */
const Columns: ColumnProps[] = [
  { title: '姓名', dataIndex: 'name', width: 100 },
  { title: '手机号', dataIndex: 'loginId', width: 110 },
  { title: '租户', dataIndex: 'tenantName', ellipsis: true },
  { title: '邮箱', dataIndex: 'email', ellipsis: true },
  { title: '职位', dataIndex: 'position', ellipsis: true },
  { title: '权限', dataIndex: 'roleId', slots: { customRender: 'roleId' } },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 130,
    align: 'center',
    slots: { customRender: 'createTime' },
    sorter(record1: IAuthItem, record2: IAuthItem) {
      if (record1.createTime && record2.createTime)
        return moment(record1.createTime).isBefore(record2.createTime)
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

/** 表格列配置 */
const userColumns: ColumnProps[] = [
  { title: '姓名', dataIndex: 'fullName', ellipsis: true },
  { title: '手机号', dataIndex: 'phoneNumber', ellipsis: true },
  { title: '邮箱', dataIndex: 'email', ellipsis: true },
  { title: '职位', dataIndex: 'position', ellipsis: true },
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
    modalVisible: false,
    modalForm: {
      uniqueId: '',
      roleId: '02',
    },
    userSearch: {
      fullName: undefined,
      phoneNumber: undefined,
    },
    userList: [],
  })

  const { resetFields, validateInfos } = useForm(
    state.userSearch,
    reactive({
      fullName: [{ required: false, type: 'string' }],
      phoneNumber: [{ required: false, type: 'string' }],
    })
  )

  // 列表请求
  const getAuthList = (
    payload: IPageRequestParams = { page: 1, limit: 10 }
  ) => {
    const url = '/framework-wechart/manager/queryManager'
    state.loading = true
    request
      .post<IResponseDefine<PageDataDefine<IAuthItem>>>(url, payload)
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
  getAuthList()

  // 设置权限角色
  const onSetAuthRole = (item: IAuthItem) => {
    const url = '/framework-wechart/manager/updateManagerUser'
    const params = {
      loginId: item.loginId,
      roleId: item.roleId,
    }
    request.post<IResponseDefine>(url, params).then(res => {
      const { status, statusText } = res.data
      if (status === 0) {
        message.success('更新权限成功！')
        getAuthList({
          page: state.pageData.currPage,
          limit: state.pageData.pageSize,
        })
      } else {
        message.error(statusText)
      }
    })
  }

  // 请求批量删除接口
  const handleDelete = (loginId: string) => {
    const url = '/framework-wechart/manager/deleteManager'
    request
      .post<IResponseDefine>(url, { loginId })
      .then(res => {
        const { status, statusText } = res.data
        if (status === 0) {
          message.success('删除用户成功！')
          getAuthList({
            page: state.pageData.currPage,
            limit: state.pageData.pageSize,
          })
        } else {
          message.error(statusText)
        }
      })
  }

  // 查询员工列表
  const getUserList = () => {
    const url = '/framework-wechart/manager/selectUser'
    request
      .post<IResponseDefine<IUserItem[]>>(url, state.userSearch)
      .then(res => {
        const { status, statusText, data } = res.data
        if (status === 0) {
          state.userList = data
        } else {
          message.error(statusText)
        }
      })
  }

  // 提交弹窗
  const hanldeOK = () => {
    if (state.modalForm.uniqueId) {
      const url = '/framework-wechart/manager/setManagerUser'
      request.post<IResponseDefine>(url, state.modalForm).then(res => {
        const { status, statusText } = res.data
        if (status === 0) {
          message.success('新增成功！')
          state.modalVisible = false
          getAuthList({
            page: state.pageData.currPage,
            limit: state.pageData.pageSize,
          })
        } else {
          message.error(statusText)
        }
      })
    } else {
      message.warning('请先选择一名员工！')
    }
  }

  // 分页改变事件
  const onTableChange = (current: number, size: number) => {
    getAuthList({ page: current, limit: size })
  }

  return () => (
    <div>
      <Button type="primary" onClick={() => (state.modalVisible = true)}>
        <PlusOutlined />
        新增
      </Button>

      <Table
        bordered
        size="middle"
        rowKey="loginId"
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
        style={{ marginTop: '16px' }}
      >
        {{
          // 权限角色
          roleId: ({ record }: { record: IAuthItem }) => (
            <Radio.Group
              v-model={[record.roleId, 'value']}
              buttonStyle="solid"
              onChange={() => onSetAuthRole(record)}
            >
              {roleTypeEnum.map(item => (
                <Radio value={item.value}>{item.title}</Radio>
              ))}
            </Radio.Group>
          ),
          // 创建时间
          createTime: ({ text }: { text: IAuthItem['createTime'] }) =>
            text && moment(text).format('YYYY-MM-DD HH:mm'),
          // 操作
          operation: ({ record }: { record: IAuthItem }) => (
            <Popconfirm
              title="是否确认删除？"
              onConfirm={() => record.loginId && handleDelete(record.loginId)}
            >
              <a>删除</a>
            </Popconfirm>
          ),
        }}
      </Table>

      <Modal
        v-model={[state.modalVisible, 'visible']}
        title={'新增权限'}
        onOk={hanldeOK}
        width={900}
      >
        <Row gutter={[24, 48]}>
          <Col span="24">
            <Form wrapperCol={{ flex: 'auto' }}>
              <Row gutter={24}>
                <Col span={8}>
                  <Form.Item label="姓名" {...validateInfos.fullName}>
                    <Input
                      v-model={[state.userSearch.fullName, 'value', ['trim']]}
                      allowClear
                      placeholder="请输入"
                      onPressEnter={() => getUserList()}
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item label="手机号" {...validateInfos.phoneNumber}>
                    <Input
                      v-model={[
                        state.userSearch.phoneNumber,
                        'value',
                        ['trim'],
                      ]}
                      allowClear
                      placeholder="请输入"
                      onPressEnter={() => getUserList()}
                    />
                  </Form.Item>
                </Col>

                <Col span={8}>
                  <Form.Item>
                    <Space>
                      <Button type="primary" onClick={() => getUserList()}>
                        <SearchOutlined />
                        搜索
                      </Button>
                      <Button onClick={resetFields}>
                        <UndoOutlined />
                        重置
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>

            <Table
              bordered
              size="small"
              rowKey="uniqueId"
              loading={state.loading}
              columns={userColumns}
              dataSource={state.userList}
              pagination={false}
              scroll={{ y: 250 }}
              rowSelection={{
                type: 'radio',
                onChange: (selectedRowKeys: string) =>
                  (state.modalForm.uniqueId = selectedRowKeys[0]),
              }}
            />
          </Col>
        </Row>

        <Row gutter={[24, 48]}>
          <Col span="24">
            <Radio.Group v-model={[state.modalForm.roleId, 'value']}>
              {roleTypeEnum.map(item => (
                <Radio value={item.value}>{item.title}</Radio>
              ))}
            </Radio.Group>
          </Col>
        </Row>
      </Modal>
    </div>
  )
})
