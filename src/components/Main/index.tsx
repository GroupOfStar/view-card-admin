import { defineComponent, reactive, watch } from 'vue'
import { RouterView, useRouter, useRoute } from 'vue-router'
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
import styles from './index.module.less'

interface IState {
  /** 左侧菜单收缩展开状态 */
  collapsed: boolean
  /** 当前选中的菜单 */
  currentMenu: string[]
  /** 修改密码弹窗visible */
  pwVisible: boolean
  /** 修改密码loading */
  pwLoading: boolean
  /** 修改密码弹窗form */
  pwForm: {
    /** 旧密码 */
    oldPassword: string
    /** 新密码 */
    newPassword: string
    /** 确认密码 */
    confirmPassword: string
  }
}

export default defineComponent(function Main() {
  const store = useStore()
  const router = useRouter()
  const route = useRoute()

  const state = reactive<IState>({
    collapsed: false,
    currentMenu: [],
    pwVisible: false,
    pwLoading: false,
    pwForm: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  /** 效验 */
  const rulesRef = reactive({
    oldPassword: [{ required: true, message: '不能为空！', trigger: 'blur' }],
    newPassword: [{ required: true, message: '不能为空！', trigger: 'blur' }],
    confirmPassword: [
      { required: true, message: '不能为空！', trigger: 'blur' },
      {
        validator: (_: object, value: string) => {
          if (value === state.pwForm.newPassword) {
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
    state.pwForm,
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

  // 切换菜单
  const onMenuChange = (item: { key: string }) => {
    router.push(`/main/${item.key}`)
  }

  // 退出登录
  const logout = () => {
    localStorage.clear()
    router.push('/')
  }

  watch(
    () => route.fullPath,
    newValue => {
      const currentRouteExp = (newValue || '').match(/\/main\/(\S[^\?]*)/)
      const currentPage = currentRouteExp ? currentRouteExp[1] : 'users'
      state.currentMenu = [currentPage]
    },
    {
      immediate: true,
    }
  )

  return () => (
    <Layout class={styles.layout_warpper}>
      <Layout.Sider
        v-model={[state.collapsed, 'collapsed']}
        theme="dark"
        breakpoint="xl"
      >
        <div class={styles.logo_warpper} onClick={() => router.push('/main/')}>
          <img class={styles.logo_img} src={Logo} />
          <div class={styles.logo_title}>云名片后台</div>
        </div>
        <Menu
          v-model={[state.currentMenu, 'selectedKeys']}
          theme="dark"
          mode="inline"
          onClick={onMenuChange}
        >
          <Menu.Item key="users">
            <UserOutlined />
            <span>员工信息</span>
          </Menu.Item>
          <Menu.Item key="temp">
            <MobileOutlined />
            <span>模板管理</span>
          </Menu.Item>
          <Menu.Item key="news">
            <NotificationOutlined />
            <span>信息管理</span>
          </Menu.Item>
          <Menu.Item key="auth">
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
                  v-model={[state.pwForm.oldPassword, 'value']}
                  placeholder="请输入..."
                  allowClear
                />
              </Form.Item>

              <Form.Item label="新密码" {...validateInfos.newPassword}>
                <Input.Password
                  v-model={[state.pwForm.newPassword, 'value']}
                  placeholder="请输入..."
                  allowClear
                />
              </Form.Item>

              <Form.Item label="确认密码" {...validateInfos.confirmPassword}>
                <Input.Password
                  v-model={[state.pwForm.confirmPassword, 'value']}
                  placeholder="请输入..."
                  allowClear
                />
              </Form.Item>
            </Form>
          </Modal>
        </Layout.Header>

        <Layout.Content class={styles.content_warpper}>
          <RouterView class={styles.content}></RouterView>
        </Layout.Content>

        <Layout.Footer class={styles.footer_warpper}>
          <div class={styles.left_dsc}>
            &copy; 2001-2021 版权所有 软通动力信息技术（集团）股份有限公司
            系统适用于Chrome浏览器
          </div>
          <div class={styles.right_dsc}>法律声明 | 隐私政策</div>
        </Layout.Footer>
      </Layout>
    </Layout>
  )
})
