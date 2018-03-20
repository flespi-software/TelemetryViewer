import ConnectionPlugin from 'flespi-io-js/dist/vue-plugin'

let connectionConfig = {}

if (IS_LOCAL_BUILD) {
  connectionConfig = {
    httpConfig: { server: 'https://localhost', port: 9005 },
    socketConfig: { server: `ws://localhost:9016` }
  }
}

export default ({Vue}) => {
  Vue.use(ConnectionPlugin, connectionConfig)
}
