
module.exports = function (config) {
  // If someone runs `npx karma start` directly the Angular CLI build-angular plugin
  // will emit a confusing error. Detect the common mistaken invocation and provide
  // a clear, actionable message to run the tests via the Angular CLI instead.
  // Any npm lifecycle event indicates the runner is invoked via npm (e.g. `npm test`, `npm run ci:test`).
  const invokedViaNpm = !!process.env.npm_lifecycle_event;
  if (!invokedViaNpm && process.argv.some(a => /karma(\.cmd)?/.test(a) || a === 'start')) {
    console.error('\nERROR: Karma was invoked directly. This project uses the Angular CLI test runner.');
    console.error('Please run the tests using the Angular CLI so the build pipeline and plugin are initialized.');
    console.error('Examples:');
    console.error('  npm test');
    console.error('  npx ng test --watch=false --browsers ChromeHeadlessNoSandbox --single-run\n');
    // exit with non-zero code so CI fails clearly
    process.exit(1);
  }

  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ]
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadlessNoSandbox'],   // use custom headless browser
    customLaunchers: {
      ChromeHeadlessNoSandbox: {
        base: 'ChromeHeadless',
        flags: [
          '--no-sandbox',          // 👈 critical for root in Docker
          '--disable-gpu',
          '--disable-extensions',
          '--disable-dev-shm-usage'
        ]
      }
    },
    singleRun: true,
    restartOnFileChange: false
  });
};
