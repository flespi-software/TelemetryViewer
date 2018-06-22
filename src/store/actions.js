import Vue from 'vue'

async function getDevices ({ state, commit }, server) {
  commit('reqStart')
  try {
    if (state.token) {
      const devicesResp = await Vue.connector.gw.getDevices('all', { fields: 'id,name,ident,phone,messages_ttl' })
      const devices = devicesResp.data.result
      commit('reqSuccessful', devices)
      if (!state.hasDevicesInit) {
        commit('setDevicesInit')
      }
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
