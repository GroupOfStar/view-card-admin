import { defineComponent, reactive } from 'vue'
import { RouterView } from 'vue-router'
import { Button, Form, Input } from 'ant-design-vue'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import styles from './index.module.less'

export default defineComponent({
  name: 'Datasource',
  setup() {
    const loginForm = reactive({
      username: 'isoftstone',
      password: '',
    })

    const handleFinish = () => {
      const url = '/sys/doLogin'
    }

    return () => (
      <section class={styles.lc_main}>
        <RouterView></RouterView>
        <div class={styles.content_wapper}>
          也没啥三生三世
          <h3>标题3</h3>
          <p>内容p</p>
          <p>内容p</p>
          <p>内容p</p>
          <p>内容p</p>
          <Button type="primary">点 击</Button>
          <Form layout="horizontal" model={loginForm} onFinish={handleFinish}>
            <Form.Item
              name="username"
              rules={[{ required: true, message: '用户名不能为空' }]}
            >
              <Input
                prefix={<UserOutlined />}
                v-model={[loginForm.username, 'value']}
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
                v-model={[loginForm.password, 'value']}
                type="password"
                size="large"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item>
              <Button size="large" type="primary" html-type="submit">
                登录
              </Button>
            </Form.Item>
          </Form>
        </div>
        <div id="subapp-viewport"></div>
      </section>
    )
  },
})
