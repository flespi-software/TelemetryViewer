import Vue from 'vue'
import { Cookies, LocalStorage, Notify } from 'quasar'

function reqStart (state) {
  if (DEV) {
    console.log('Start Request')
  }
}
function reqSuccessful (state, devices) {
  devices.forEach(device => {
    Vue.set(state.devices, device.id, device)
  })
}
function reqFailed (state, payload) {
  if (DEV) {
    console.log('Failed Request')
    console.log(payload)
  }
  /* http errors */
  if ((payload.response && payload.response.status)) {
    switch (payload.response.status) {
      case 0: {
        setOfflineFlag(state, true)
        unsetDevicesInit(state)
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
        if (payload.response.data && payload.response.data.errors && payload.response.data.errors.length) {
          payload.response.data.errors.forEach((e) => { addError(state, e.reason) })
        }
      }
    }
    /* mqtt errors */
  } else if (payload.code && payload.message) {
    switch (payload.code) {
      case 2: {
        if (state.token) {
          clearToken(state)
        }
        addError(state, payload.message)
        break
      }
    }
  } else {
    addError(state, payload.message)
  }
}
function setToken (state, val) {
  let token = val.replace('FlespiToken ', '')
  setSocketOffline(state, true)
  if (val && token.match(/^[a-z0-9]+$/i)) {
    Vue.connector.token = `FlespiToken ${token}`
    Vue.connector.socket.on('connect', () => { setSocketOffline(state, false) })
    LocalStorage.set('X-Flespi-Token', token)
  } else {
    token = ''
    Vue.connector.token = ''
    clearToken(state)
  }
  Vue.set(state, 'token', token)
  if (state.errors.length) {
    state.errors = []
    state.newNotificationCounter = 0
  }
}
function clearToken (state) {
  const cookieToken = Cookies.get('X-Flespi-Token'),
    localStorageToken = LocalStorage.get.item('X-Flespi-Token')
  if (cookieToken && localStorageToken && cookieToken === localStorageToken) {
    Cookies.remove('X-Flespi-Token')
  }
  LocalStorage.remove('X-Flespi-Token')
  Vue.connector.token = ''
  if (state.socketOffline) { setSocketOffline(state, false) }
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

function addError (state, message) {
  Notify.create({
    type: 'negative',
    icon: 'warning',
    message: `${message}`,
    timeout: 1000
  })
  state.newNotificationCounter++
  state.errors.push(message)
}

function clearErrors (state) {
  Vue.set(state, 'errors', [])
}

function setSocketOffline (state, flag) {
  Vue.set(state, 'socketOffline', flag)
}

function updateDevices (state, payload) {
  switch (payload.type) {
    case 'created': {
      state.devices[payload.device.id] = payload.device
      break
    }
    case 'updated': {
      Object.keys(state.devices).some((id) => {
        if (id === payload.device.id) {
          state.devices[id] = Object.assign(state.devices[id], payload.device)
          return true
        }
        return false
      })
      break
    }
    case 'deleted': {
      Object.keys(state.devices).some((id, index) => {
        if (id === payload.device.id) {
          delete state.devices[id]
          return true
        }
        return false
      })
      break
    }
  }
}
function clearNotificationCounter (state) { state.newNotificationCounter = 0 }
export default {
  reqStart,
  reqSuccessful,
  reqFailed,
  setToken,
  clearToken,
  setDevicesInit,
  unsetDevicesInit,
  setOfflineFlag,
  addError,
  clearErrors,
  setSocketOffline,
  updateDevices,
  clearNotificationCounter
}
