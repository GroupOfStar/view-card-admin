import { Module } from 'vuex'
import request from '@/utils/request'
import { message } from 'ant-design-vue'
import { RootIState } from '../index'

export interface ITreeItem {
  key: number
  /** 目录标题 */
  title: string
  /** 目录类型，包括包和类 */
  type: 'model' | 'category'
  children: ITreeItem[]
  [keyProps: string]: any
}

export interface IModelingTreeState {
  treeData: ITreeItem[]
}

const ModelingTree: Module<IModelingTreeState, RootIState> = {
  namespaced: true,
  state() {
    return {
      /** 责任人列表*/
      treeData: [],
    }
  },
  mutations: {
    /** 修改责任人列表 */
    setTreeData(state, payload: ITreeItem[]) {
      state.treeData = payload
    },
  },
  actions: {
    /** 登录页面，获取责任人列表并进行缓存 */
    fetchTreeData({ commit }, payload: string = '') {
      const url = '/metadataDataModel/queryModelTree'
      const config = {
        params: {
          categoryName: payload,
        },
      }
      // 请求逻辑实体
      request.get<any[]>(url, config).then(res => {
        const { status, statusText, data } = res
        if (status === 0) {
          commit(
            'setTreeData',
            data.map<ITreeItem>((item: any) => ({
              ...item,
              key: `0-${item.id}`,
              title: item.modelName,
              type: 'model',
              children: item.categories.map((ele: any) => ({
                ...ele,
                key: `${item.id}-${ele.id}`,
                title: ele.categoryName,
                type: 'category',
                children: [],
              })),
            }))
          )
        } else {
          message.error(statusText)
        }
      })
    },
  },
}

export default ModelingTree
