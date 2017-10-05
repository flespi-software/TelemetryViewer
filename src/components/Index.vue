<template>
  <q-layout ref="layout" view="hHh LpR lFf" :left-class="{'bg-dark':true}" :left-style="{padding: '20px 16px 0'}" :left-breakpoint="576" :page-class="{'bg-dark': invertedTelemetry}" :page-style="{transition: 'all .5s ease-in-out'}">
    <q-toolbar slot="header" color="dark">
      <q-btn flat @click="$refs.layout.toggleLeft()">
        <q-icon name="menu" />
      </q-btn>
      <q-toolbar-title>
        Telemetry Viewer
      </q-toolbar-title>
      <q-search :style="{maxWidth: searchWidth}" @focus="searchFocusHandler" @blur="searchBlurHandler" v-if="Object.keys(devices).length && token" type="text" v-model="search" inverted color="none" />
    </q-toolbar>
    <div slot="left">
      <q-input type="text" float-label="Token" v-model="tokenModel" inverted color="none" :after="[{icon: 'arrow_forward', handler: logIn}]" v-if="!token" />
      <q-btn style="width: 100%" v-if="token" @click="LogoutHandler" inverted color="none">Logout</q-btn>
      <q-collapsible group="left" :opened="!!token" class="text-white" v-if="Object.keys(devices).length && token" icon="developer_board" label="Parameters">
        <q-select v-if="Object.keys(devices).length && token" inverted color="dark" :before="[{icon: 'devices'}]" v-model="selectModel" :options="selectDeviceOptions"></q-select>
      </q-collapsible>
      <q-collapsible group="left" class="text-white" icon="settings" label="Settings">
        <q-input type="text" float-label="Server" v-model="server" inverted color="none" />
        <q-input suffix="sec." float-label="Delay" type="text" v-model="delay" inverted color="none" />
        <q-checkbox v-model="propHistoryFlag" checked-icon="history" unchecked-icon="history" label="History" :color="propHistoryFlag ? 'white' : 'grey'" class="text-grey uppercase" style="padding: 15px 0 0"/>
        <div class="row">
          <div class="col-6 uppercase" style="padding: 26px 0 0;"><q-checkbox v-model="invertedTelemetry" checked-icon="filter_b_and_w" unchecked-icon="filter_b_and_w" label="Inverted" :color="invertedTelemetry ? 'white' : 'grey'" class="text-grey"/></div>
          <div class="col-6"><q-select inverted color="dark" :before="[{icon: 'color_lens'}]" v-model="telemetryColor" :options="telemetryColorOptions"></q-select></div>
        </div>
      </q-collapsible>
    </div>
    <q-telemetry
      v-if="Object.keys(devices).length && token"
      :device="activeDevice"
      :propHistoryFlag="propHistoryFlag"
      :delay="delay * 1000"
      :search="search"
      :server="server"
      @click:item="clickItemHandler"
      @diff="diffHandler"
      :inverted="invertedTelemetry"
      :color="telemetryColor"
    >
    </q-telemetry>
    <div v-if="!token" class="text-center text-uppercase text-grey-7" style="font-size: 3rem; padding-top: 30px">
      Please, enter valid token!
    </div>
  </q-layout>
</template>

<script>
import Vue from 'vue'
import { QLayout, QToolbar, QToolbarTitle, QSelect, QBtn, QIcon, QInput, QItem, QItemSide, QItemMain, QItemTile, QToggle, QCheckbox, QSearch, QCollapsible, Cookies, LocalStorage, Dialog } from 'quasar-framework'
import { QTelemetry, install as installTelemetryVuexModule } from 'qtelemetry'
import { mapActions, mapMutations, mapState } from 'vuex'

export default {
  name: 'index',
  components: {
    QTelemetry, QLayout, QToolbar, QToolbarTitle, QSelect, QBtn, QIcon, QInput, QItem, QItemSide, QItemMain, QItemTile, QToggle, QCheckbox, QSearch, QCollapsible
  },
  data () {
    return {
      activeDeviceId: null,
      tokenModel: '',
      server: 'https://flespi.io',
      delay: 3,
      propHistoryFlag: true,
      search: '',
      invertedTelemetry: false,
      telemetryColor: '',
      searchWidth: '40px',
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
      hasDevicesInit: state => state.hasDevicesInit
    }),
    selectDeviceOptions () {
      return Object.keys(this.devices).map(id => ({
        label: this.devices[id].name || `#${id}`,
        value: id
      }))
    },
    selectModel: {
      get () {
        let ids = Object.keys(this.devices)
        if (ids.length) {
          if (this.activeDeviceId) {
            return this.activeDeviceId
          }
          else {
            // init after get devices
            this.activeDeviceId = ids[0].toString()
            return ids[0].toString()
          }
        }
        return '-1'
      },
      set (id) {
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
      'unsetDevicesInit'
    ]),
    ...mapActions([
      'getDevices'
    ]),
    logIn () {
      this.$store.commit('setToken', this.tokenModel)
    },
    clickItemHandler ({deviceId}) {
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
      this.clearToken()
      this.unsetDevicesInit()
    },
    autoLogin () {
      this.$store.commit('setToken', this.$route.params.token)
      setTimeout(() => {
        this.$router.push('/')
      }, 1000)
    },
    checkHasToken () {
      let authCookie = Cookies.get('X-Flespi-Token'),
        localStorageToken = LocalStorage.get.item('X-Flespi-Token')
      if (this.$route.params && this.$route.params.token) {
        this.tokenModel = this.$route.params.token
        this.autoLogin()
      }
      else if (localStorageToken) {
        this.tokenModel = localStorageToken
        this.logIn()
      }
      else if (authCookie) {
        Dialog.create({
          title: 'Confirm',
          message: `Do you want log in by token ${authCookie}.`,
          buttons: [
            {
              label: 'Disagree',
              handler () {
                // Toast.create('Disagreed...')
              }
            },
            {
              label: 'Agree',
              handler: () => {
                this.tokenModel = authCookie
                this.logIn()
              }
            }
          ]
        })
      }
    }
  },
  watch: {
    token (token) {
      if (token && !this.hasDevicesInit) {
        this.getDevices(this.server)
        setInterval(() => { this.getDevices(this.server) }, 30000)
      }
    },
    $route (val) {
      if (val.params && val.params.token) {
        this.autoLogin()
      }
    }
  },
  created () {
    installTelemetryVuexModule(this.$store, Vue)
    this.checkHasToken()
  }
}
</script>

<style lang="stylus">
  .layout-aside-left
    .q-item-side
      color white
</style>
