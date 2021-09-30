import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import './App.less'

export default defineComponent(() => () => (
  <ConfigProvider locale={zhCN}>
    <RouterView />
  </ConfigProvider>
))
