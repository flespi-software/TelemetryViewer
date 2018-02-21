import Vue from 'vue'

async function getDevices ({ state, commit }, server) {
  commit('reqStart')
  try {
    if (state.token) {
      let devicesResp = await Vue.connector.registry.getDevices('all', { fields: 'id,name,ident,phone,telemetry,messages_ttl' })
      let devices = devicesResp.data.result
      commit('reqSuccessful', devices)
      if (!state.hasDevicesInit) {
        commit('setDevicesInit')
      }
    }
  }
  catch (error) { commit('reqFailed', error) }
}

async function checkConnection ({ state, commit }) {
  try {
    let resp = await Vue.connector.http.get(`./statics/icons/favicon-16x16.png?_=${(new Date()).getTime()}`)
    if (resp.status === 200) {
      commit('setOfflineFlag', false)
    }
  }
  catch (e) {
    if (DEV) {
      console.log(e)
    }
  }
}

export default {
  getDevices,
  checkConnection
}
