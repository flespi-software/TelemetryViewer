// Configuration for your app
const webpack = require('webpack')

module.exports = function (ctx) {
  return {
    plugins: [
      'i18n',
      'flespi-io'
    ],
    css: [
      'app.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons',
      // 'ionicons',
      'mdi'
      // 'fontawesome'
    ],
    supportIE: true,
    vendor: {
      add: [],
      remove: []
    },
    build: {
      scopeHoisting: true,
      vueRouterMode: 'hash',
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      // useNotifier: false,
      extendWebpack (cfg) {
        cfg.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules|quasar)/
        })
        cfg.plugins.push(
          new webpack.DefinePlugin({
            'IS_LOCAL_BUILD': process.env.FLESPI_MODE === 'local',
            'DEV': process.env.NODE_ENV === 'development',
            'PROD': process.env.NODE_ENV === 'production'
          })
        )
      }
    },
    devServer: {
      // https: true,
      // port: 8080,
      open: true // opens browser window automatically
    },
    // framework: 'all' --- includes everything; for dev only!
    framework: {
      components: [
        'QLayout',
        'QPageContainer',
        'QLayoutHeader',
        'QLayoutDrawer',
        'QSpinnerGears',
        'QToolbar',
        'QToolbarTitle',
        'QBtn',
        'QIcon',
        'QItem',
        'QItemMain',
        'QItemSide',
        'QItemTile',
        'QSelect',
        'QInput',
        'QToggle',
        'QCheckbox',
        'QSearch',
        'QCollapsible',
        'QList',
        'QListHeader',
        'QTooltip',
        'QPopover',
        'QChip'
      ],
      plugins: [
        'Loading',
        'Cookies',
        'LocalStorage',
        'Dialog',
        'Notify'
      ]
    },
    // animations: 'all' --- includes all animations
    animations: [
    ],
    pwa: {
      workboxOptions: {
        skipWaiting: true,
        clientsClaim: true
      },
      manifest: {
        name: 'TelemetryViewer',
        short_name: 'Telemetry-Viewer',
        // description: 'Best PWA App in town!',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#333333',
        theme_color: '#333333',
        icons: [
          {
            'src': 'statics/icons/icon-128x128.png',
            'sizes': '128x128',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-256x256.png',
            'sizes': '256x256',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-384x384.png',
            'sizes': '384x384',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ]
      }
    },
    // leave this here for Quasar CLI
    starterKit: '1.0.0'
  }
}
