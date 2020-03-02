#!/usr/bin/env groovy
pipeline {
    agent { label 'composer' }
    stages {
        stage('Dependency install') {
            agent {
                docker {
                    image 'dev.cr.ina/node:lts-alpine'
                    registryUrl 'https://dev.cr.ina'
                    registryCredentialsId '615401f4-404d-492c-988b-74a55a97ba19'
                    args '-v /var/lib/jenkins/workspace/AMALIA/AMALIA_V2_SONAR:/src -w /src -e CHROME_BIN=/usr/bin/google-chrome --entrypoint=\'\''
                    reuseNode true
                }
            }
            steps {
                script {
                    sh 'npm set strict-ssl false; npm config set @ina:registry https://repo.sas.ina/repository/npm-snapshots; npm install; npm run build-test;'
                }
            }
        }
        stage('SonarQube analysis') {
            steps {
                script {
                    withSonarQubeEnv('sonar.priv.ina') {
                        def scannerHome = tool 'sonar';
                        sh "export SONAR_SCANNER_OPTS='-Xmx1024m -XX:MaxPermSize=512m'; ${scannerHome}/bin/sonar-scanner -Dsonar.projectKey='Amalia' -Dsonar.projectName='Amalia' -Dsonar.projectVersion='2.0' -Dsonar.sourceEncoding='UTF-8' -Dsonar.forceAnalysis='true' -Dsonar.projectBaseDir=. -Dsonar.sources=src/. -Dsonar.exclusions='**.spec.ts,**.mock.ts' -Dsonar.typescript.lcov.reportPaths=./coverage/amalia/lcov.info"
                    }
                }
            }
        }
    }
}
