import Vue from 'vue'
import { Cookies, LocalStorage } from 'quasar-framework'

function reqStart (state) {
  if (DEV) {
    console.log('Start Request')
  }
}
function reqSuccessful (state, { result }) {
  result.forEach(device => {
    Vue.set(state.devices, device.id, device)
  })
}
function reqFailed (state, payload) {
  if (DEV) {
    console.log('Failed Request')
    console.log(payload)
  }
  switch (payload.status) {
    case 0: {
      setOfflineFlag(state, true)
      Vue.set(state, 'token', '')
      break
    }
    case 401: {
      clearToken(state)
      break
    }
    default: {
      if (DEV) {
        console.log(`${payload.status} - ${payload.statusText}`)
      }
    }
  }
}
function setToken (state, val) {
  let token = val.replace('FlespiToken ', '')
  if (val && token.match(/^[a-z0-9]+$/i)) {
    Vue.http.headers.common['Authorization'] = `FlespiToken ${token}`
    LocalStorage.set('X-Flespi-Token', token)
  }
  else {
    token = ''
    clearToken(state)
  }
  Vue.set(state, 'token', token)
}
function clearToken (state) {
  let cookieToken = Cookies.get('X-Flespi-Token'),
    localStorageToken = LocalStorage.get.item('X-Flespi-Token')
  if (cookieToken && localStorageToken && cookieToken === localStorageToken) {
    Cookies.remove('X-Flespi-Token')
  }
  LocalStorage.remove('X-Flespi-Token')
  Vue.http.headers.common['Authorization'] = ''
  Vue.set(state, 'token', '')
}
function setDevicesInit (state) {
  state.hasDevicesInit = true
}
function unsetDevicesInit (state) {
  state.hasDevicesInit = false
  Vue.set(state, 'devices', [])
}
function setOfflineFlag (state, flag) {
  Vue.set(state, 'offline', flag)
}

export default {
  reqStart,
  reqSuccessful,
  reqFailed,
  setToken,
  clearToken,
  setDevicesInit,
  unsetDevicesInit,
  setOfflineFlag
}
