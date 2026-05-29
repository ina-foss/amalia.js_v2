const sonarqubeScanner = require('sonarqube-scanner');
sonarqubeScanner({
    serverUrl: 'http://localhost:9001',
    options: {
        'sonar.login': 'admin',
        'sonar.password': 'admin',
        // Angular/Karma writes LCOV to coverage/lcov.info in this project.
        // Keep both keys for compatibility across Sonar versions.
        'sonar.typescript.lcov.reportPaths': './coverage/lcov.info',
        'sonar.javascript.lcov.reportPaths': './coverage/lcov.info',
        'sonar.sources': '.',
        'sonar.inclusions': 'src/**',
        'sonar.exclusions': '**.spec.ts,**.mock.ts,index.html'
    }
}, () => {
});
