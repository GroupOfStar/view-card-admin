import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Button, Form, Input, message } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { useStore } from '@/store'
import request from '@/utils/request'
import Logo from '@/assets/logo.png'
import styles from './index.module.less'

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
  /** 是否首次登录 ('0'是 '1'否) */
  firstLoginFlag?: string
}

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter()

    const store = useStore()

    const state = reactive({
      loading: false,
      loginForm: {
        loginId: '',
        password: '',
      },
    })

    // 登录
    const handleFinish = () => {
      const url = '/framework-wechart/manager/doLogin'
      const params = {
        loginId: state.loginForm.loginId,
        password: btoa(state.loginForm.password),
      }
      state.loading = true
      request
        .post<ILoginResponse>(url, params)
        .then(res => {
          const {
            status,
            statusText,
            Authorization = '',
            loginId = '',
            name = '',
            firstLoginFlag,
          } = res.data
          if (status === 0) {
            const payload = { loginId, name, firstLoginFlag }
            store.commit('CHANGE_USER_INFO', payload)
            localStorage.setItem('ACCESS_TOKEN', Authorization)
            localStorage.setItem('userInfo', JSON.stringify(payload))
            router.push('/main/').then(() => {
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
      <div class={styles.page_warpper}>
        <div class={styles.warpper}>
          <div class={styles.header}>
            <img class={styles.logo_img} src={Logo} />
            <span class={styles.title_name}>i云名片</span>
          </div>

          <Form
            class={styles.login_form}
            layout="horizontal"
            model={state.loginForm}
            onFinish={handleFinish}
            wrapperCol={{ span: 24 }}
          >
            <Form.Item
              name="loginId"
              rules={[{ required: true, message: '用户名不能为空' }]}
            >
              <Input
                prefix={<UserOutlined />}
                v-model={[state.loginForm.loginId, 'value']}
                size="large"
                placeholder="用户名"
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
                placeholder="密码"
              />
            </Form.Item>
            <Form.Item>
              <Button
                size="large"
                block
                type="primary"
                htmlType="submit"
                loading={state.loading}
              >
                登录
              </Button>
            </Form.Item>
          </Form>

          <div class={styles.footer}>
            <div class={styles.links}>
              <a>帮助</a>
              <a>隐私</a>
              <a>条款</a>
            </div>
            <div class={styles.copyright}>
              Copyright &copy; 2001-2021 版权所有
              软通动力信息技术（集团）股份有限公司
            </div>
          </div>
        </div>
      </div>
    )
  },
})
