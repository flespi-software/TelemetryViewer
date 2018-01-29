var
  config = require('../config'),
  theme = process.argv[2] || config.defaultTheme,
  isLocal = process.argv[3] || false

module.exports = {
  dev: process.env.NODE_ENV === 'development',
  prod: process.env.NODE_ENV === 'production',
  isLocal: isLocal,
  platform: {
    theme: theme,
    cordovaAssets: './cordova/platforms/' + (theme === 'mat' ? 'android' : 'ios') + '/platform_www'
  }
}
