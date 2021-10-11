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
        name: 'vcUser',
        component: () => import('../views/User'),
      },
      {
        path: '/main/temp',
        name: 'vcTemp',
        component: () => import('../views/Temp'),
      },
      {
        path: '/main/news',
        name: 'vcNews',
        component: () => import('../views/News'),
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
