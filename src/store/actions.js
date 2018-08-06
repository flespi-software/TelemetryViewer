import Vue from 'vue'

async function getDevices ({ state, commit }, server) {
  commit('reqStart')
  try {
    if (state.token) {
      let ids = await Vue.connector.poolDevices((resp) => { commit('reqSuccessful', resp.data.result) }, (type, device) => { commit('updateDevices', { type, device }) })
      if (!state.hasDevicesInit) {
        commit('setDevicesInit')
      }
      return async () => { await Vue.connector.poolDevicesStop(ids) }
    }
  } catch (error) { commit('reqFailed', error) }
}

async function checkConnection ({ state, commit }) {
  try {
    let resp = await Vue.connector.http.external.get(`./statics/icons/favicon-16x16.png?_=${(new Date()).getTime()}`)
    if (resp.status === 200 && state.offline) {
      commit('setOfflineFlag', false)
    }
  } catch (e) {
    if (DEV) {
      console.log(e)
    }
    if (!state.offline) {
      commit('setOfflineFlag', true)
    }
  }
}

export default {
  getDevices,
  checkConnection
}
