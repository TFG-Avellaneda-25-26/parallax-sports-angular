pipeline {
    agent any

    environment {
        REGISTRY    = 'localhost:5000'
        IMAGE_NAME  = 'parallax-angular'
        STACK_PATH  = '/opt/stack'
    }

    options {
        timeout(time: 15, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker image') {
            // The multi-stage Dockerfile runs `npm ci` + `npx ng build` inside the
            // node:22-alpine builder stage, so Jenkins itself doesn't need Node
            // installed. Lint moved into the Dockerfile (or skip it for now).
            steps {
                sh """
                    docker build \
                        -t ${REGISTRY}/${IMAGE_NAME}:latest \
                        -t ${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER} \
                        .
                """
            }
        }

        stage('Push to registry') {
            steps {
                sh """
                    docker push ${REGISTRY}/${IMAGE_NAME}:latest
                    docker push ${REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}
                """
            }
        }

        stage('Deploy') {
            steps {
                sh """
                    cd ${STACK_PATH}
                    COMPOSE_PROFILES=apps docker compose pull angular
                    COMPOSE_PROFILES=apps docker compose up -d --no-deps --force-recreate --pull=always angular
                """
            }
        }
    }

    post {
        always {
            cleanWs()
        }
        success {
            echo "Deployed Angular build #${BUILD_NUMBER}"
        }
        failure {
            echo "Build #${BUILD_NUMBER} failed"
        }
    }
}
