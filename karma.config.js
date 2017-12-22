module.exports = function(config) {
    config.set({
      autoWatch: false,
      browsers: ['ChromeHeadless'],
      // browsers: ['Chrome'], 
      colors: true,
      concurrency: Infinity,
      files: [
        'test/**/*.js'
      ],
      frameworks: ['mocha', 'chai'],
      logLevel: config.LOG_INFO,
      port: 9876,  // karma web server port
      preprocessors: { 'test/zera.test.js': ['webpack'] },
      reporters: ['progress'],
      singleRun: false,
    })
  }