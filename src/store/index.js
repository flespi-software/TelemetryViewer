import Vuex from 'vuex'
import Vue from 'vue'
import VueResource from 'vue-resource'
import mutations from './mutations.js'
import actions from './actions.js'

Vue.use(VueResource)

Vue.use(Vuex)

let state = {
  token: '',
  devices: {},
  hasDevicesInit: false
}

export default new Vuex.Store(
  {
    state,
    mutations,
    actions
  }
)
