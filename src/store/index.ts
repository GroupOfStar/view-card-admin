import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import ModelingTree, { IModelingTreeState } from './modules/ModelingTree'

export interface RootIState {}

export default createStore<RootIState>({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    ModelingTree,
  },
})

interface AllStateType {
  ModelingTree: IModelingTreeState
}

// 定义 injection Key
export const Key: InjectionKey<Store<AllStateType>> = Symbol()

// 定义自己的 `useStore` 组合式函数
export function useStore<T = AllStateType>() {
  return baseUseStore<T>(Key)
}
