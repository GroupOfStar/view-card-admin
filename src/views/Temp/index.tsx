import { defineComponent, reactive, ref, computed, nextTick } from 'vue'
import {
  Button,
  Table,
  Popconfirm,
  Switch,
  Divider,
  Modal,
  Card,
  Row,
  Col,
  Form,
  Input,
  Checkbox,
  Typography,
  Dropdown,
  Menu,
  message,
} from 'ant-design-vue'
import { PlusOutlined, DownOutlined } from '@ant-design/icons-vue'
import { useForm } from '@ant-design-vue/use'
import { ICompanyTempItem, ITempItem, IState } from './interface'
import { uniqueId } from 'lodash-es'
import moment from 'moment'
import request from '@/utils/request'

/** 表格列配置 */
const Columns: ColumnProps = [
  { title: '模板名称', dataIndex: 'templateAlias' },
  {
    title: '修改时间',
    dataIndex: 'modifyTime',
    slots: { customRender: 'dateForamt' },
  },
  {
    title: '创建时间',
    dataIndex: 'creationTime',
    slots: { customRender: 'dateForamt' },
  },
  {
    title: '是否默认模板',
    dataIndex: 'isDefault',
    slots: { customRender: 'isDefault' },
  },
  { title: '操作', slots: { customRender: 'operation' } },
]

/** 模板管理 */
export default defineComponent(function Temp() {
  const state = reactive<IState>({
    loading: false,
    pageData: {
      currPage: 1,
      pageSize: 10,
      totalCount: 0,
      list: [],
    },
    modalForm: {
      id: undefined,
      templateAlias: undefined,
      companyProfile: undefined,
    },
    modalVisible: false,
    modalType: 'save',
  })

  /** 弹窗内动态的模块信息 */
  const companyTemp = computed({
    get: () => {
      const companyProfile = state.modalForm.companyProfile
      return reactive<ICompanyTempItem[]>(
        companyProfile ? JSON.parse(companyProfile) : []
      )
    },
    set: val => {
      state.modalForm.companyProfile = JSON.stringify(val)
    },
  })

  const { resetFields, validateInfos, validate } = useForm(
    state.modalForm,
    reactive({
      id: [{ required: false, type: 'number' }],
      creationBy: [{ required: false, type: 'string' }],
      templateAlias: [{ required: true, message: '请输入模板名称！' }],
      companyProfile: [{ required: false, type: 'string' }],
    })
  )

  // 获取模板列表数据
  const getTemplateList = (
    payload: IPageRequestParams = { page: 1, limit: 10 }
  ) => {
    const url = '/framework-wechart/companyTemplate/queryPage'
    state.loading = true
    request
      .post<IResponseDefine<PageDataDefine<ITempItem>>>(url, payload)
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
  getTemplateList()

  // 新增
  const handleAdd = () => {
    state.modalType = 'save'
    state.modalVisible = true
  }

  // 编辑
  const handleUpdate = (record: ITempItem) => {
    state.modalForm.id = record.id
    state.modalForm.creationBy = record.creationBy
    state.modalForm.templateAlias = record.templateAlias
    state.modalForm.companyProfile = record.companyProfile

    state.modalType = 'update'
    state.modalVisible = true
  }

  // 请求批量删除接口
  const fetchBatchDeleteTemp = (ids: ColumnKey[]) => {
    const url = '/framework-wechart/companyTemplate/delete'
    request.post<IResponseDefine>(url, ids).then(res => {
      const { status, statusText } = res.data
      if (status === 0) {
        message.success('删除用户成功！')
        getTemplateList()
      } else {
        message.error(statusText)
      }
    })
  }

  // 设置默认模板
  const handleDefaultTemp = (record: ITempItem) => {
    const url = '/framework-wechart/companyTemplate/setDefault'
    const params = {
      id: record.id,
      isDefault: record.isDefault === '是' ? '否' : '是',
    }
    state.loading = true
    request
      .post<IResponseDefine>(url, params)
      .then(res => {
        const { status, statusText } = res.data
        if (status === 0) {
          message.success('设置成功！')
          getTemplateList()
        } else {
          message.error(statusText)
        }
      })
      .finally(() => (state.loading = false))
  }

  // 分页改变事件
  const onTableChange = (current: number, size: number) => {
    getTemplateList({ page: current, limit: size })
  }

  // 新增模块
  const handleAddPlate = () => {
    companyTemp.value.push({
      label: '',
      uuid: uniqueId('instruc_'),
      contents: [],
    })
  }

  // 增加内容
  const handleMenuClick = (key: string, item: ICompanyTempItem) => {
    item.contents.push({
      uuid: uniqueId('compInfo_'),
      type: key === 'picture' ? '图片链接' : '文本',
      value: '',
    })
  }

  // 取消弹窗
  const hanldeCancel = () => {
    companyTemp.value = []
    resetFields()
    state.modalVisible = false
  }

  // 提交弹窗
  const handleOK = () => {
    if (companyTemp.value.some(item => !!item.label)) {
      state.modalForm.companyProfile = JSON.stringify(companyTemp.value)
      nextTick(() => {
        validate().then(fields => {
          const url = `/framework-wechart/companyTemplate/${state.modalType}`
          request.post<IResponseDefine>(url, fields).then(res => {
            const { status, statusText } = res.data
            if (status === 0) {
              message.success(
                `${state.modalType === 'save' ? '新增' : '修改'}成功！`
              )
              hanldeCancel()
              getTemplateList()
            } else {
              message.error(statusText)
            }
          })
        })
      })
    } else {
      message.error('必须填写模块信息')
    }
  }

  return () => (
    <div>
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
          // 修改时间, 创建时间
          dateForamt: ({ text }: { text?: string }) =>
            text && moment(text).format('YYYY-MM-DD HH:mm'),
          // 是否为默认模板
          isDefault: ({ record }: { record: ITempItem }) => {
            const isDefault = ref(record.isDefault === '是')
            return (
              <Switch
                v-model={[isDefault.value, 'checked']}
                checkedChildren="是"
                unCheckedChildren="否"
                onChange={() => handleDefaultTemp(record)}
              />
            )
          },
          // 操作
          operation: ({ record }: { record: ITempItem }) => (
            <>
              <a onClick={() => handleUpdate(record)}>编辑</a>
              <Divider type="vertical" />
              <Popconfirm
                title="是否确认删除？"
                onConfirm={() => record.id && fetchBatchDeleteTemp([record.id])}
              >
                <a>删除</a>
              </Popconfirm>
            </>
          ),
        }}
      </Table>

      <Modal
        title={state.modalType === 'save' ? '新增' : '修改'}
        v-model={[state.modalVisible, 'visible']}
        onCancel={hanldeCancel}
        onOk={handleOK}
        width={1000}
      >
        <Card
          size="small"
          title={<Typography.Title level={5}>基本信息</Typography.Title>}
        >
          <Form wrapperCol={{ flex: 'auto' }}>
            <Row gutter={24}>
              <Col span="12">
                <Form.Item label="模板名称" {...validateInfos.templateAlias}>
                  <Input
                    v-model={[state.modalForm.templateAlias, 'value']}
                    placeholder="请输入..."
                  />
                </Form.Item>
              </Col>
              <Col span="12">
                <Form.Item
                  label="附加项"
                  name="extraContent"
                  extra="暂无接口提供！"
                >
                  <Checkbox.Group disabled>
                    <Checkbox value="A">新闻动态</Checkbox>
                    <Checkbox value="B">解决方案</Checkbox>
                  </Checkbox.Group>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>

        <Card
          size="small"
          title={<Typography.Title level={5}>模块信息</Typography.Title>}
          extra={
            <a onClick={handleAddPlate}>
              <PlusOutlined />
              新增
            </a>
          }
          style={{ marginTop: '16px' }}
        >
          {companyTemp.value.map((item, index, thisTemps) => (
            <Card
              size="small"
              hoverable
              key={item.uuid}
              title={<span style={{ fontWeight: 600 }}>模块 {index + 1}</span>}
              extra={
                <>
                  <a onClick={() => thisTemps.splice(index, 1)}>删除该模块</a>
                  <Divider type="vertical"></Divider>
                  <Dropdown>
                    {{
                      default: () => (
                        <a>
                          增加内容
                          <DownOutlined />
                        </a>
                      ),
                      overlay: () => (
                        <Menu onClick={({ key }) => handleMenuClick(key, item)}>
                          <Menu.Item key="text">文本内容</Menu.Item>
                          <Menu.Item key="picture">图片地址</Menu.Item>
                        </Menu>
                      ),
                    }}
                  </Dropdown>
                </>
              }
              style={{
                marginBottom: thisTemps.length - 1 === index ? '0px' : '8px',
              }}
            >
              <Form layout="vertical">
                <Form.Item label="标题" required>
                  <Input
                    v-model={[item.label, 'value']}
                    placeholder="请输入..."
                  />
                </Form.Item>
                {item.contents.map(ele => (
                  <Form.Item label={ele.type} key={ele.uuid}>
                    {ele.type === '文本' ? (
                      <Input.TextArea
                        v-model={[ele.value, 'value']}
                        placeholder="请输入文本..."
                      />
                    ) : (
                      <Input
                        v-model={[ele.value, 'value']}
                        placeholder="请输入图片链接..."
                      />
                    )}
                  </Form.Item>
                ))}
              </Form>
            </Card>
          ))}
        </Card>
      </Modal>
    </div>
  )
})
