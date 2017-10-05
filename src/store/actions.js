import Vue from 'vue'

function getDevices ({ state, commit }, server) {
  commit('reqStart')
  return state.token ? Vue.http.get(`${server}/registry/devices/all`, {
    params: {
      fields: 'id,name,ident,phone,telemetry,messages_ttl'
    }
  }).then((resp) => resp.json())
    .then((json) => {
      commit('reqSuccessful', json)
      if (!state.hasDevicesInit) {
        commit('setDevicesInit')
      }
      return json.result
    })
    .catch((err) => { commit('reqFailed', err) }) : false
}

export default {
  getDevices
}
