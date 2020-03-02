#!/usr/bin/env groovy
pipeline {

    agent { label 'composer' }

    options {
        gitLabConnection('GitLab INA')
        gitlabBuilds(builds: ['Dependency install','SonarQube analysis'])
    }

    stages {
        stage('Dependency install') {
            agent {
                docker {
                    image 'node:lts-alpine'
                    args '-v /var/lib/jenkins/workspace/AMALIA/AMALIA_V2_SONAR:/src -w /src --entrypoint=\'\''
                    reuseNode true
                }
            }
            steps {
                script {
                    sh 'npm set strict-ssl false; npm config set @ina:registry https://repo.sas.ina/repository/npm-snapshots; npm install; '
                }
            }
        }
    }

    stages {
        stage('SonarQube analysis') {
            withSonarQubeEnv('sonar.priv.ina') {
                def scannerHome = tool 'sonar';
                sh "export SONAR_SCANNER_OPTS='-Xmx1024m -XX:MaxPermSize=512m'; ${scannerHome}/bin/sonar-scanner -Dsonar.projectKey='Amalia' -Dsonar.projectName='Amalia' -Dsonar.projectVersion='2.0' -Dsonar.sourceEncoding='UTF-8' -Dsonar.forceAnalysis='true' -Dsonar.projectBaseDir=. -Dsonar.sources=src/. -Dsonar.sonar.exclusions='**.spec.ts,**.mock.ts' -Dsonar.typescript.lcov.reportPaths=./coverage/amalia/lcov.info"
            }
        }
    }

}
