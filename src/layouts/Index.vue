<template>
  <q-layout ref="layout" view="hHh LpR lFf">
    <q-layout-header>
      <q-toolbar color="dark">
        <q-btn flat @click="layout.left = !layout.left">
          <q-icon name="menu" />
        </q-btn>
        <q-toolbar-title>
          Telemetry Viewer
        </q-toolbar-title>
        <q-search :style="{maxWidth: searchWidth}" @focus="searchFocusHandler" @blur="searchBlurHandler" v-if="Object.keys(devices).length && token && !offline" type="text" v-model="search" inverted color="none" />
        <q-btn v-if="errors.length && token" @click="clearNotificationCounter" small flat round size="md" icon="notifications" class="floated notifications">
          <q-chip v-if="newNotificationCounter" floating color="red">{{newNotificationCounter}}</q-chip>
          <q-popover fit ref="popoverError">
            <q-list no-border style="max-height: 200px" link separator class="scroll">
              <q-item
                v-for="(error, index) in errors"
                :key="index"
                style="cursor: default"
              >
                <q-item-main>
                  <q-item-tile label>{{error}}</q-item-tile>
                </q-item-main>
              </q-item>
            </q-list>
          </q-popover>
        </q-btn>
      </q-toolbar>
    </q-layout-header>
    <q-layout-drawer side="left" v-model="layout.left" :content-class="{'bg-dark':true}" :content-style="{padding: '20px 16px 0'}" :breakpoint="576">
      <q-btn style="width: 100%" v-if="token" @click="LogoutHandler" inverted color="none">Logout</q-btn>
      <q-collapsible group="left" :opened="!!token" class="text-white" v-if="Object.keys(devices).length && token" icon="developer_board" label="Parameters">
        <q-select v-if="Object.keys(devices).length && token" inverted color="dark" :before="[{icon: 'devices'}]" v-model="selectModel" :options="selectDeviceOptions"></q-select>
      </q-collapsible>
      <q-collapsible group="left" class="text-white" icon="settings" label="Settings">
        <q-input type="text" float-label="Server" v-model="server" inverted color="none" />
        <q-checkbox v-model="propHistoryFlag" checked-icon="history" unchecked-icon="history" label="History" :color="propHistoryFlag ? 'white' : 'grey'" class="text-grey uppercase" style="padding: 15px 0 0"/>
        <div class="row">
          <div class="col-6 uppercase" style="padding: 26px 0 0;"><q-checkbox v-model="invertedTelemetry" checked-icon="filter_b_and_w" unchecked-icon="filter_b_and_w" label="Inverted" :color="invertedTelemetry ? 'white' : 'grey'" class="text-grey"/></div>
          <div class="col-6"><q-select inverted color="dark" :before="[{icon: 'color_lens'}]" v-model="telemetryColor" :options="telemetryColorOptions"></q-select></div>
        </div>
      </q-collapsible>
    </q-layout-drawer>
    <q-page-container :content-class="{'bg-dark': invertedTelemetry}" :content-style="{transition: 'all .5s ease-in-out'}">
      <q-telemetry
        v-if="Object.keys(devices).length && token && !socketOffline"
        :device="activeDevice"
        :propHistoryFlag="propHistoryFlag"
        :moduleName="moduleName"
        :search="search"
        :server="server"
        @click:item="clickItemHandler"
        @diff="diffHandler"
        :inverted="invertedTelemetry"
        :color="telemetryColor"
      >
      </q-telemetry>
      <div v-else class="text-center text-uppercase text-grey-7" style="font-size: 3rem; padding-top: 30px">
        <div>Please, log in!</div>
        <iframe v-if="!token"  style="width: 100%; height: 160px" :src="`${$flespiServer}/frame/index.html#fff;424242;70`" frameborder="0"></iframe>
      </div>
      <div v-if="!token && (offline || socketOffline)" class="text-center text-uppercase text-grey-7" style="font-size: 3rem; padding-top: 30px">
        <span v-if="!token && (!offline && !socketOffline)">Please, log in!</span>
        <span v-if="offline || socketOffline">Offline</span>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { QSpinnerGears } from 'quasar'
import QTelemetry from 'qtelemetry'
import Vue from 'vue'
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'index',
  components: {
    QTelemetry
  },
  data () {
    return {
      layout: {
        left: true
      },
      activeDeviceId: null,
      tokenModel: '',
      offlineIntervalId: 0,
      server: 'https://flespi.io',
      delay: 3,
      propHistoryFlag: true,
      search: '',
      invertedTelemetry: false,
      telemetryColor: '',
      searchWidth: '40px',
      stopHandler: () => {},
      moduleName: 'telemetry_container',
      telemetryColorOptions: [
        {
          label: 'Default',
          value: ''
        },
        {
          label: 'Dark',
          value: 'dark'
        },
        {
          label: 'White',
          value: 'white'
        },
        {
          label: 'Red',
          value: 'red'
        }
      ]
    }
  },
  computed: {
    ...mapState({
      token: (state) => state.token,
      devices: (state) => state.devices,
      hasDevicesInit: state => state.hasDevicesInit,
      offline (state) {
        if (state.offline) {
          this.$q.loading.show({
            spinner: QSpinnerGears,
            message: 'Waiting for connection',
            messageColor: 'white',
            spinnerSize: 250,
            spinnerColor: 'white'
          })
        } else {
          this.checkHasToken()
          this.$q.loading.hide()
        }
        return state.offline
      },
      errors: state => state.errors,
      socketOffline: state => state.socketOffline,
      newNotificationCounter: state => state.newNotificationCounter
    }),
    selectDeviceOptions () {
      return Object.keys(this.devices).map(id => ({
        label: this.devices[id].name || `#${id}`,
        value: id
      }))
    },
    selectModel: {
      get () {
        const ids = Object.keys(this.devices)
        if (ids.length) {
          if (this.activeDeviceId) {
            return this.activeDeviceId
          } else {
            this.init()
          }
        }
        return '-1'
      },
      set (id) {
        this.$q.localStorage.set('activeDeviceId', id)
        this.activeDeviceId = id
      }
    },
    activeDevice () {
      return this.devices[parseInt(this.activeDeviceId)]
    }
  },
  methods: {
    ...mapMutations([
      'setToken',
      'clearToken',
      'setDevicesInit',
      'unsetDevicesInit',
      'reqFailed',
      'addError',
      'clearNotificationCounter',
      'clearErrors'
    ]),
    ...mapActions([
      'getDevices',
      'checkConnection'
    ]),
    logIn () {
      this.$store.commit('setToken', this.tokenModel)
    },
    init () {
      const activeIdFroLocalStorage = this.$q.localStorage.get.item('activeDeviceId')
      const ids = Object.keys(this.devices)
      if (activeIdFroLocalStorage && Object.keys(this.devices).includes(activeIdFroLocalStorage)) {
        this.activeDeviceId = activeIdFroLocalStorage
        return activeIdFroLocalStorage
      } else {
        this.activeDeviceId = ids[0].toString()
        return ids[0].toString()
      }
    },
    clickItemHandler ({ deviceId }) {
      // id of active device
    },
    diffHandler (diff) {
      // difference in telemetry
    },
    searchFocusHandler () {
      this.searchWidth = '80%'
    },
    searchBlurHandler () {
      this.searchWidth = '40px'
    },
    LogoutHandler () {
      this.stopHandler()
      this.clearToken()
      this.unsetDevicesInit()
      this.getTokenListen()
    },
    autoLogin () {
      this.$store.commit('setToken', this.$route.params.token)
      setTimeout(() => {
        this.$router.push('/')
      }, 1000)
    },
    checkHasToken () {
      const authCookie = this.$q.cookies.get('X-Flespi-Token'),
        localStorageToken = this.$q.localStorage.get.item('X-Flespi-Token')
      if (this.$route.params && this.$route.params.token) {
        this.tokenModel = this.$route.params.token
        this.autoLogin()
      } else if (localStorageToken) {
        this.tokenModel = localStorageToken
        this.logIn()
      } else if (authCookie) {
        this.$q.dialog({
          title: 'Confirm',
          message: `Do you want log in by token ${authCookie}.`,
          ok: true,
          cancel: true
        }).then(() => {
          this.tokenModel = authCookie
          this.logIn()
        })
          .catch(() => {})
      } else { this.getTokenListen() }
    },
    getTokenListen () {
      if (!this.token) {
        let tokenHandler = (event) => {
          if (typeof event.data === 'string' && ~event.data.indexOf('FlespiToken')) {
            this.tokenModel = event.data
            this.logIn()
            window.removeEventListener('message', tokenHandler)
          }
        }
        window.addEventListener('message', tokenHandler)
      }
    }
  },
  watch: {
    token (token, prevToken) {
      let connectHandler = () => {
        this.getDevices(this.server)
          .then(stopHandler => { this.stopHandler = stopHandler })
        Vue.connector.socket.off('connect', connectHandler)
      }
      if (token && !this.hasDevicesInit) {
        Vue.connector.socket.on('connect', connectHandler)
      }
    },
    $route (val) {
      if (val.params && val.params.token) {
        this.autoLogin()
      }
    }
  },
  created () {
    this.checkHasToken()
    this.offlineIntervalId = setInterval(this.checkConnection, 5000)
    Vue.connector.socket.on('offline', () => {
      this.$store.commit('setSocketOffline', true)
    })
    Vue.connector.socket.on('connect', () => {
      this.$store.commit('setSocketOffline', false)
    })
  }
}
</script>

<style lang="stylus">
  .layout-aside-left
    .q-item-side
      color white
</style>
