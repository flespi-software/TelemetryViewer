import Vuex from 'vuex'
import Vue from 'vue'
import mutations from './mutations.js'
import actions from './actions.js'

Vue.use(Vuex)

let state = {
  token: '',
  devices: {},
  hasDevicesInit: false,
  offline: false
}

export default new Vuex.Store(
  {
    state,
    mutations,
    actions
  }
)
