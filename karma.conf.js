// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-chrome-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage'),
            require('karma-junit-reporter'),
            require('karma-htmlfile-reporter'),
            require('karma-coverage-istanbul-reporter'),
            require('@angular-devkit/build-angular/plugins/karma')
        ],
        client: {
            clearContext: true // leave Jasmine Spec Runner output visible in browser
        },
        coverageIstanbulReporter: {
            dir: require('path').join(__dirname, './coverage/amalia'),
            reports: ['html', 'lcovonly', 'text-summary'],
            fixWebpackSourcePaths: true
        },
        reporters: ['progress', 'junit', 'html', 'kjhtml'],
        junitReporter: {
            outputDir: '.tests/surefire-reports/'
        },
        htmlReporter: {
            outputFile: '.tests/units.html',
            // Optional
            pageTitle: 'Unit Tests Amalia',
            groupSuites: true,
            useCompactStyle: true,
            useLegacyStyle: true,
            showOnlyFailed: false
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['ChromeHeadlessNoSandbox'],
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
            }
        },
        singleRun: false,
        restartOnFileChange: true
    });
};
