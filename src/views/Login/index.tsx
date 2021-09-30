import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Form, Input, message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import styles from './index.module.less'
import Logo from '@/assets/logo.png'
import request from '@/utils/request'

/**
 * 登录反参
 */
interface ILoginResponse {
  status: number
  statusText: string
  Authorization?: string
  loginId?: string
  name?: string
  roleId?: string
  tenantId?: string
  tenantName?: string
}

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter()

    const state = reactive({
      loading: false,
      loginForm: {
        loginId: '',
        password: '',
      },
    })

    const handleFinish = () => {
      const url = '/framework-wechart/manager/doLogin'
      state.loading = true
      request
        .post<ILoginResponse>(url, state.loginForm)
        .then(res => {
          const {
            status,
            statusText,
            Authorization = '',
            loginId = '',
            name = '',
          } = res.data
          if (status === 0) {
            localStorage.setItem('token', Authorization)
            localStorage.setItem('loginId', loginId)
            // commit(types.CHANGE_USER_INFO, { loginId, name })
            router.push({ name: 'UserManage' }).then(() => {
              state.loading = false
            })
          } else {
            state.loading = false
            message.error(statusText)
          }
        })
        .catch(() => {
          state.loading = false
        })
    }

    return () => (
      <div
        id={styles.userLayout}
        class={[styles.userLayoutWrapper, styles.mobile]}
      >
        <div class={styles.container}>
          <div class={styles.userLayoutLang}>
            {/* <select-lang class={styles.selectlangTrigger} /> */}
          </div>
          <div class={styles.userLayoutContent}>
            <div class={styles.top}>
              <div class={styles.header}>
                <img src={Logo} class={styles.logo} />
                <span class={styles.title}>Data Management</span>
              </div>
              <div class={styles.desc}>
                Ant Design is the most influential web design specification in
                Xihu district
              </div>
            </div>
            <div class={styles.main}>
              <Form
                layout="horizontal"
                model={state.loginForm}
                onFinish={handleFinish}
              >
                <Form.Item
                  name="loginId"
                  rules={[{ required: true, message: '用户名不能为空' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    v-model={[state.loginForm.loginId, 'value']}
                    size="large"
                    placeholder="Username"
                  />
                </Form.Item>
                <Form.Item
                  name="password"
                  rules={[{ required: true, message: '密码不能为空' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    v-model={[state.loginForm.password, 'value']}
                    type="password"
                    size="large"
                    placeholder="Password"
                  />
                </Form.Item>
                <Form.Item>
                  <Button
                    size="large"
                    type="primary"
                    html-type="submit"
                    loading={state.loading}
                  >
                    登录
                  </Button>
                </Form.Item>
              </Form>
            </div>
            <div class={styles.footer}>
              <div class={styles.links}>
                <a href="_self">帮助</a>
                <a href="_self">隐私</a>
                <a href="_self">条款</a>
              </div>
              <div class={styles.copyright}>
                Copyright &copy; 2001-2021 版权所有
                软通动力信息技术（集团）股份有限公司
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
})
