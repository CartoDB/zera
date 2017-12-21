module.exports = function(config) {
    config.set({
      autoWatch: false,
      browsers: ['ChromeHeadless'],
      colors: true,
      concurrency: Infinity,
      files: [
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.2.0/leaflet-src.js',
        'test/**/*.js'
      ],
      frameworks: ['mocha', 'chai'],
      logLevel: config.LOG_INFO,
      port: 9876,  // karma web server port
      preprocessors: { 'test/zera.test.js': ['webpack'] },
      reporters: ['progress'],
      singleRun: true,
    })
  }