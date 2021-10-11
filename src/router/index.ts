import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import nProgress from 'nprogress'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login',
    name: 'vcLogin', // 登录页
    component: () => import('../views/Login'),
  },
  {
    path: '/main',
    component: () => import('../components/Main'),
    children: [
      {
        path: '',
        redirect: '/main/user',
      },
      {
        path: '/main/user',
        name: 'vcUser', // 员工信息
        component: () => import('../views/User'),
      },
      {
        path: '/main/temp',
        name: 'vcTemp', // 模板管理
        component: () => import('../views/Temp'),
      },
      {
        path: '/main/news',
        name: 'vcNews', // 信息管理
        component: () => import('../views/News'),
      },
      {
        path: '/main/auth',
        name: 'vcAuth', // 权限管理
        component: () => import('../views/Auth'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(to => {
  if (to.meta.loaded) return true
  nProgress.start()
  return true
})

router.afterEach(() => {
  nProgress.done()
  return true
})

export default router
