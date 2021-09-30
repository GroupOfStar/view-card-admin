import { createApp } from 'vue'
import App from './App'
import router from './router'
import store, { Key } from './store'
import 'nprogress/nprogress.css'
import { message } from 'ant-design-vue'
import 'moment/dist/locale/zh-cn'

message.config({
  maxCount: 1,
})

createApp(App)
  .use(store, Key)
  .use(router)
  .mount('#root')
