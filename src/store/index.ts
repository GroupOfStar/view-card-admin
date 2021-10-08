import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import ModelingTree, { IModelingTreeState } from './modules/ModelingTree'

export interface RootIState {
  /** 用户信息 */
  userInfo: {
    /** 登录ID（用户手机号）*/
    loginId: string
    /** 用户姓名 */
    name: string
  }
}

const userInfo = localStorage.getItem('userInfo')

export default createStore<RootIState>({
  state: {
    userInfo: userInfo ? JSON.parse(userInfo) : {},
  },
  mutations: {
    // 修改用户信息
    CHANGE_USER_INFO(state, payload) {
      state.userInfo = payload
    },
  },
  actions: {},
  modules: {
    ModelingTree,
  },
})

interface AllStateType extends RootIState {
  ModelingTree: IModelingTreeState
}

// 定义 injection Key
export const Key: InjectionKey<Store<AllStateType>> = Symbol('view card key')

// 定义自己的 `useStore` 组合式函数
export function useStore<T = AllStateType>() {
  return baseUseStore<T>(Key)
}
