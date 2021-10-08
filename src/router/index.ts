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
    component: () => import('../views/Main'),
    children: [
      {
        path: '',
        redirect: '/main/datasource',
      },
      {
        path: '/main/datasource/:pathMatch(.*)*',
        name: 'mDatasource',
        component: () => import('../views/Datasource'),
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
