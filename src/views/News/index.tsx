import { computed, defineComponent, reactive } from 'vue'
import {
  Space,
  Button,
  Table,
  Modal,
  Popconfirm,
  Form,
  Col,
  Row,
  Input,
  Radio,
  Select,
  DatePicker,
  InputNumber,
  Divider,
  message,
} from 'ant-design-vue'
import {
  PlusOutlined,
  SearchOutlined,
  UndoOutlined,
} from '@ant-design/icons-vue'
import { useForm } from '@ant-design-vue/use'
import {
  IResourceType,
  INewsItem,
  IState,
  ICategoryTagItem,
  IModalType,
} from './interface'
import moment from 'moment'
import request from '@/utils/request'
import { getLookupNameByKey } from '@/utils/utils'

/** 资源类型数据 */
const resourceTypeEnum: IStatusEnum<IResourceType>[] = [
  { title: '动态新闻', value: '01' },
  { title: '解决方案', value: '02' },
]

/** 表格列配置 */
const Columns: ColumnProps = [
  {
    title: '标题名称',
    dataIndex: 'titleName',
    width: 250,
    slots: { customRender: 'titleName' },
  },
  {
    title: '资源类型',
    dataIndex: 'resourceType',
    width: 90,
    slots: { customRender: 'resourceType' },
  },
  { title: '分类', width: 90, dataIndex: 'secondaryCategory' },
  {
    title: '新闻链接',
    dataIndex: 'resourceUrl',
  },
  { title: '租户', dataIndex: 'tenantName', width: 185, ellipsis: true },
  {
    title: '获取时间',
    dataIndex: 'getTime',
    width: 130,
    slots: { customRender: 'getTime' },
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
    categoryTags: [],
    searchForm: {
      titleName: undefined,
      resourceType: undefined,
    },
    modalVisible: false,
    modalForm: {
      id: undefined,
      titleName: '',
      resourceType: undefined,
      secondaryCategoryId: undefined,
      resourceUrl: '',
      summaryUrl: '',
      getTime: undefined,
      reorder: 1,
    },
    modalType: 'view',
  })

  // 弹窗标题
  const modalTitle = computed(() => {
    switch (state.modalType) {
      case 'insert':
        return '新增'
      case 'update':
        return '修改'
      case 'view':
        return '查看'
    }
  })

  const {
    resetFields: searchFormReset,
    validateInfos: searchFormValidateInfos,
  } = useForm(
    state.searchForm,
    reactive({
      titleName: [{ required: false, type: 'string' }],
      resourceType: [{ required: false, type: 'string' }],
    })
  )

  const rulesRef = reactive({
    id: [{ required: false, type: 'string' }],
    titleName: [{ required: true, message: '不能为空！' }],
    resourceType: [{ required: true, message: '不能为空！' }],
    secondaryCategoryId: [{ required: false, type: 'string' }],
    resourceUrl: [{ required: true, message: '不能为空！' }],
    summaryUrl: [{ required: false, type: 'string' }],
    getTime: [{ required: false, type: 'string' }],
    reorder: [{ required: false, type: 'number' }],
  })

  const { resetFields, validate, validateInfos } = useForm(
    state.modalForm,
    rulesRef
  )

  // 列表请求
  const getUserList = (
    payload: IPageRequestParams = { page: 1, limit: 10 }
  ) => {
    const url = '/framework-wechart/manager/resourceQueryPage'
    const params = { ...state.searchForm, ...payload }
    request
      .post<IResponseDefine<PageDataDefine<INewsItem>>>(url, params)
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

  // 分类标签数据
  const getCategoryTags = () => {
    const url = '/framework-wechart/resourceInfo/getSecondaryCategoryList'
    request.post<IResponseDefine<ICategoryTagItem[]>>(url, {}).then(res => {
      const { status, statusText, data } = res.data
      if (status === 0) {
        state.categoryTags = data
      } else {
        message.error(statusText)
      }
    })
  }
  getCategoryTags()

  // 重置搜索
  const hanldeResetSearch = () => {
    searchFormReset()
    getUserList()
  }

  // 查看
  const handleAction = (record: INewsItem, type: IModalType) => {
    state.modalForm.id = record.id
    state.modalForm.titleName = record.titleName
    state.modalForm.resourceType = record.resourceType
    state.modalForm.secondaryCategoryId = record.secondaryCategoryId
    state.modalForm.resourceUrl = record.resourceUrl
    state.modalForm.summaryUrl = record.summaryUrl
    state.modalForm.getTime = record.getTime
    state.modalForm.reorder = record.reorder

    state.modalType = type
    state.modalVisible = true
  }

  // 新增
  const handleAdd = () => {
    state.modalType = 'insert'
    state.modalVisible = true
  }

  // 请求批量删除接口
  const handleDelete = (id: string) => {
    const url = '/framework-wechart/resourceInfo/delete'
    request
      .post<IResponseDefine>(url, { id })
      .then(res => {
        const { status, statusText } = res.data
        if (status === 0) {
          message.success('删除用户成功！')
          getUserList({
            page: state.pageData.currPage,
            limit: state.pageData.pageSize,
          })
        } else {
          message.error(statusText)
        }
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
      const url = `/framework-wechart/resourceInfo/${state.modalType}`
      request.post<IResponseDefine>(url, fields).then(res => {
        const { status, statusText } = res.data
        if (status === 0) {
          message.success(`${modalTitle.value}员工信息成功！`)
          getUserList({
            page: state.pageData.currPage,
            limit: state.pageData.pageSize,
          })
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
            <Form.Item label="标题名称" {...searchFormValidateInfos.titleName}>
              <Input
                v-model={[state.searchForm.titleName, 'value', ['trim']]}
                allowClear
                onPressEnter={() => getUserList()}
                placeholder="请输入..."
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="资源类型"
              {...searchFormValidateInfos.resourceType}
            >
              <Select
                v-model={[state.searchForm.resourceType, 'value']}
                allowClear
                placeholder="请选择..."
              >
                {resourceTypeEnum.map(item => (
                  <Select.Option value={item.value}>{item.title}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item>
              <Space>
                <Button type="primary" onClick={() => getUserList()}>
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

      <Button type="primary" onClick={handleAdd}>
        <PlusOutlined />
        新增
      </Button>

      <Table
        bordered
        size="middle"
        rowKey="id"
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
          // 标题名称
          titleName: ({ record }: { record: INewsItem }) => (
            <a onClick={() => handleAction(record, 'view')}>
              {record.titleName}
            </a>
          ),
          // 新闻类型
          resourceType: ({ text }: { text: INewsItem['resourceType'] }) =>
            getLookupNameByKey(text, resourceTypeEnum),
          // 获取时间
          getTime: ({ text }: { text: INewsItem['getTime'] }) =>
            text && moment(text).format('YYYY-MM-DD HH:mm'),
          // 操作
          operation: ({ record }: { record: INewsItem }) => (
            <>
              <a onClick={() => handleAction(record, 'update')}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm
                title="是否确认删除？"
                onConfirm={() => record.id && handleDelete(record.id)}
              >
                <a>删除</a>
              </Popconfirm>
            </>
          ),
        }}
      </Table>

      <Modal
        v-model={[state.modalVisible, 'visible']}
        title={modalTitle.value}
        onCancel={hanldeCancel}
        footer={
          state.modalType === 'view' ? (
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
        width={800}
      >
        <Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }}>
          <Form.Item label="标题名称" {...validateInfos.titleName}>
            <Input
              v-model={[state.modalForm.titleName, 'value', ['trim']]}
              disabled={state.modalType === 'view'}
              placeholder="请输入..."
            />
          </Form.Item>
          <Form.Item label="资源类型" {...validateInfos.resourceType}>
            <Radio.Group
              v-model={[state.modalForm.resourceType, 'value']}
              disabled={state.modalType === 'view'}
            >
              {resourceTypeEnum.map(item => (
                <Radio value={item.value}>{item.title}</Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item label="分类" {...validateInfos.secondaryCategoryId}>
            <Select
              v-model={[state.modalForm.secondaryCategoryId, 'value']}
              disabled={state.modalType === 'view'}
              placeholder="请选择..."
            >
              {state.categoryTags.map(item => (
                <Select.Option value={item.secondaryCategoryId}>
                  {item.secondaryCategory}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="新闻链接" {...validateInfos.resourceUrl}>
            <Input
              v-model={[state.modalForm.resourceUrl, 'value', ['trim']]}
              disabled={state.modalType === 'view'}
              placeholder="请输入..."
            />
          </Form.Item>
          <Form.Item label="图片链接" {...validateInfos.summaryUrl}>
            <Input
              v-model={[state.modalForm.summaryUrl, 'value', ['trim']]}
              disabled={state.modalType === 'view'}
              placeholder="请输入..."
            />
          </Form.Item>
          <Form.Item label="发布时间" {...validateInfos.getTime}>
            <DatePicker
              v-model={[state.modalForm.getTime, 'value']}
              format="yyyy-MM-DD HH:mm"
              valueFormat="yyyy-MM-DD HH:mm"
              disabled={state.modalType === 'view'}
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item
            label="排序权重"
            {...validateInfos.reorder}
            extra="权重值越大展示时越靠前"
          >
            <InputNumber
              v-model={[state.modalForm.reorder, 'value', ['trim']]}
              disabled={state.modalType === 'view'}
              placeholder="请输入..."
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
})
