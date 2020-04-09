#!/usr/bin/env groovy
pipeline {
    agent { label 'composer' }
    stages {
        stage('Dependency install') {
            agent {
                docker {
                    image 'trion/ng-cli-karma'
                    args '-v /var/lib/jenkins/workspace/AMALIA/AMALIA_V2_SONAR:/app'
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
                        sh "export SONAR_SCANNER_OPTS='-Xmx1024m -XX:MaxPermSize=512m'; ${scannerHome}/bin/sonar-scanner -Dsonar.projectKey='Amalia' -Dsonar.projectName='Amalia' -Dsonar.projectVersion='2.0' -Dsonar.sourceEncoding='UTF-8' -Dsonar.forceAnalysis='true' -Dsonar.projectBaseDir=. -Dsonar.sources=src/. -Dsonar.exclusions='**.spec.ts,**.mock.ts,index.html' -Dsonar.typescript.lcov.reportPaths=./coverage/amalia/lcov.info"
                    }
                }
            }
        }
    }
}
