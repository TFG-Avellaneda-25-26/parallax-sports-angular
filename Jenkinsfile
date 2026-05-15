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

        stage('Install') {
            steps {
                sh 'npm ci --no-audit --no-fund --prefer-offline'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Build') {
            steps {
                // angular.json's defaultConfiguration is "production" — optimization,
                // AOT, hashing, budget checks are all on. No flags needed.
                sh 'npx ng build'
            }
        }

        stage('Build Docker image') {
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
                    docker compose pull angular || true
                    docker compose up -d --no-deps angular
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
