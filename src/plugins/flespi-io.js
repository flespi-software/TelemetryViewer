import ConnectionPlugin from 'flespi-io-js/dist/vue-plugin'
import { version } from '../../package.json'

let connectionConfig = {socketConfig: { clientId: `telemetry-viewer-${version}-${Math.random().toString(16).substr(2, 8)}`, mqttSettings: { protocolVersion: 5 } }}

if (IS_LOCAL_BUILD) {
  connectionConfig = {
    httpConfig: { server: 'https://localhost', port: 9005 },
    socketConfig: { server: `ws://localhost:9016`, clientId: `telemetry-viewer-${version}-${Math.random().toString(16).substr(2, 8)}`, mqttSettings: { protocolVersion: 5 } }
  }
}

export default ({Vue, store}) => {
  Vue.prototype.$flespiServer = connectionConfig.httpConfig && connectionConfig.httpConfig.server ? `${connectionConfig.httpConfig.server}:${connectionConfig.httpConfig.port}` : 'https://flespi.io'
  Vue.use(ConnectionPlugin, connectionConfig)
  Vue.connector.socket.on('error', (error) => {
    store.commit('reqFailed', error)
  })
  if (window) {
    window.addEventListener('beforeunload', () => {
      Vue.connector.socket.close(true)
    })
  }
}
