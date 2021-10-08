import { defineComponent, ref, reactive } from 'vue'
import { RouterView, useRoute, useRouter } from 'vue-router'
import {
  Menu,
  Avatar,
  Layout,
  Dropdown,
  Modal,
  Form,
  Input,
  message,
} from 'ant-design-vue'
import { useForm } from '@ant-design-vue/use'
import {
  UserOutlined,
  LogoutOutlined,
  FormOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  MobileOutlined,
  NotificationOutlined,
  UnlockOutlined,
} from '@ant-design/icons-vue'
import Logo from '@/assets/logo.png'
import { useStore } from '@/store'
import request from '@/utils/request'
import styles from './Main.module.less'

export default defineComponent(function Main() {
  const store = useStore()
  const router = useRouter()
  const route = useRoute()
  const menuCollapsed = ref(true)

  const state = reactive({
    collapsed: false,
    pwVisible: false,
    pwLoading: false,
    formState: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  // 退出登录
  const logout = () => {
    localStorage.clear()
    router.push('/')
  }

  /** 效验 */
  const rulesRef = reactive({
    oldPassword: [{ required: true, message: '不能为空！', trigger: 'blur' }],
    newPassword: [{ required: true, message: '不能为空！', trigger: 'blur' }],
    confirmPassword: [
      { required: true, message: '不能为空！', trigger: 'blur' },
      {
        validator: (_: object, value: string) => {
          if (value === state.formState.newPassword) {
            return Promise.resolve()
          } else {
            return Promise.reject(new Error('两次输入的密码不一致'))
          }
        },
        trigger: 'blur',
      },
    ],
  })

  const { resetFields, validate, validateInfos } = useForm(
    state.formState,
    rulesRef
  )

  /** 隐藏修改密码弹窗 */
  const onCancelPass = () => {
    resetFields()
    state.pwVisible = false
  }

  /** 修改密码 */
  const onConfirmPass = () => {
    validate().then((feilds: any) => {
      const url = '/manager/updatePassword'
      state.pwLoading = true
      request
        .post(url, feilds)
        .then(res => {
          const { status, statusText } = res.data
          if (status === 0) {
            message.success('密码修改成功!')
            onCancelPass()
            localStorage.clear()
            router.push('/')
          } else {
            message.error(statusText)
          }
        })
        .finally(() => {
          state.pwLoading = false
        })
    })
  }

  return () => (
    <Layout class={styles.layout_warpper}>
      <Layout.Sider
        theme="dark"
        v-model={[state.collapsed, 'collapsed']}
        trigger={null}
        collapsible
      >
        <div class={styles.logo_warpper} onClick={() => router.push('/main/')}>
          <img class={styles.logo_img} src={Logo} />
          <div class={styles.logo_title}>后台管理</div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          onClick={({ key }: { key: string }) => router.push({ name: key })}
          inlineCollapsed={menuCollapsed.value}
        >
          <Menu.Item key="UserManage">
            <UserOutlined />
            <span>员工信息</span>
          </Menu.Item>

          <Menu.Item key="TemplateManage">
            <MobileOutlined />
            <span>模板管理</span>
          </Menu.Item>
          <Menu.Item key="News">
            <NotificationOutlined />
            <span>信息管理</span>
          </Menu.Item>
          <Menu.Item key="AuthorityManage">
            <UnlockOutlined />
            <span>权限管理</span>
          </Menu.Item>
        </Menu>
      </Layout.Sider>

      <Layout>
        <Layout.Header class={styles.header_warpper}>
          <div class={styles.left_header}>
            {state.collapsed ? (
              <MenuUnfoldOutlined
                onClick={() => (state.collapsed = !state.collapsed)}
              />
            ) : (
              <MenuFoldOutlined
                onClick={() => (state.collapsed = !state.collapsed)}
              />
            )}
          </div>
          <div class={styles.right_header}>
            <Dropdown placement="bottomRight">
              {{
                default: () => (
                  <span class={styles.account_avatar}>
                    <Avatar
                      size="small"
                      class={styles.right_header_avatar}
                      icon={<UserOutlined />}
                    />
                    <span>{store.state.userInfo.name}</span>
                  </span>
                ),
                overlay: () => (
                  <Menu mode="horizontal">
                    <Menu.Item
                      key="logout"
                      onClick={() => (state.pwVisible = true)}
                    >
                      <FormOutlined />
                      修改密码
                    </Menu.Item>
                    <Menu.Item key="logout" onClick={logout}>
                      <LogoutOutlined />
                      退出系统
                    </Menu.Item>
                  </Menu>
                ),
              }}
            </Dropdown>
          </div>

          {/* 修改密码 */}
          <Modal
            v-model={[state.pwVisible, 'visible']}
            title="修改密码"
            onOk={onConfirmPass}
            onCancel={onCancelPass}
            confirmLoading={state.pwLoading}
          >
            <Form labelCol={{ span: 4 }} wrapperCol={{ span: 20 }}>
              <Form.Item label="旧密码" {...validateInfos.oldPassword}>
                <Input.Password
                  type="password"
                  v-model={[state.formState.oldPassword, 'value']}
                  placeholder="请输入..."
                  allowClear
                />
              </Form.Item>

              <Form.Item label="新密码" {...validateInfos.newPassword}>
                <Input.Password
                  v-model={[state.formState.newPassword, 'value']}
                  placeholder="请输入..."
                  allowClear
                />
              </Form.Item>

              <Form.Item label="确认密码" {...validateInfos.confirmPassword}>
                <Input.Password
                  v-model={[state.formState.confirmPassword, 'value']}
                  placeholder="请输入..."
                  allowClear
                />
              </Form.Item>
            </Form>
          </Modal>
        </Layout.Header>

        <Layout.Content>
          <RouterView></RouterView>
        </Layout.Content>
      </Layout>
    </Layout>
  )
})
