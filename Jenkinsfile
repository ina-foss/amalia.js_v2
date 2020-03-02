#!/usr/bin/env groovy
pipeline {

    agent { label 'composer' }

    options {
        gitLabConnection('GitLab INA')
        gitlabBuilds(builds: ['Dependency Check'])
    }

    stages {
        stage('SonarQube analysis') {
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
}
