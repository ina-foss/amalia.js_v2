const sonarqubeScanner = require('sonarqube-scanner');
sonarqubeScanner({
    serverUrl: 'http://localhost:9001',
    options: {
        'sonar.login': 'admin',
        'sonar.password': 'admin',
        'sonar.typescript.lcov.reportPaths': './coverage/amalia/lcov.info',
        'sonar.sources': '.',
        'sonar.inclusions': 'src/**',
        'sonar.exclusions': '**.spec.ts,**.mock.ts, index.html'
    }
}, () => {
});
