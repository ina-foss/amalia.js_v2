const sonarqubeScanner = require('sonarqube-scanner');
sonarqubeScanner({
  serverUrl: 'http://10.3.1.116:9001',
  options: {
    'sonar.login': 'admin',
    'sonar.password': 'admin',
    'sonar.sources': '.',
    'sonar.inclusions': 'src/**',
    'sonar.exclusions': '**.spec.ts,**.mock.ts',
    'sonar.coverage.exclusions': '**/**'
  }
}, () => {
});
