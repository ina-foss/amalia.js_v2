#!/usr/bin/env groovy
pipeline {

  agent { label 'composer'}

  options {
    gitLabConnection('GitLab INA')
    gitlabBuilds(builds: ['Dependency Check'])
  }

  stages {
    stage("Dependency Check") {
      agent {
        docker {
          image 'hub.cr.ina/node:lts-alpine'
          registryUrl 'https://hub.cr.ina'
          registryCredentialsId '615401f4-404d-492c-988b-74a55a97ba19'
          args '-v /var/lib/jenkins/workspace/AMALIA/AMALIA_V2_SONAR:/src -w /src --entrypoint=\'\''
          reuseNode true
        }
      }
      steps{
          script {
            sh "npm set strict-ssl false; npm config set @ina:registry https://repo.sas.ina/repository/npm-snapshots;  npm install ; npm run build-test; "
          }
      }
    }
  }
}
