// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
// Le framework/plugin du builder Angular (@angular/build:karma) est enregistré par le
// builder lui-même : ne pas le déclarer ici.

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
            require('karma-junit-reporter')
        ],
        client: {
            clearContext: true // leave Jasmine Spec Runner output visible in browser
        },
        coverageReporter: {
            dir: require('path').join(__dirname, 'coverage'), reports: ['html', 'lcovonly'],
            subdir: '.',
            reporters: [
              { type: 'html' },
              { type: 'lcovonly' },
              { type: 'text-summary' }
            ],
          },
        reporters: ['progress', 'coverage','junit','kjhtml'],
        junitReporter: {
            outputDir: 'target/surefire-reports/'
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: [ 'Chrome', 'ChromeHeadlessCI'],
        // you can define custom flags
        customLaunchers: {
            ChromeHeadlessNoSandbox: {
                base: 'ChromeHeadless',
                flags: [
                    '--no-sandbox',
                    '--disable-gpu',
                    '--disable-web-security',
                    '--disable-setuid-sandbox'
                ]
            },
            ChromeHeadlessCI: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox','--autoplay-policy=no-user-gesture-required']
            }
        },
        singleRun: true,
        restartOnFileChange: true
    });
};
