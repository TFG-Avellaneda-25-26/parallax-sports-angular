pipeline {
    agent any

    environment {
        REGISTRY        = 'localhost:5000'
        IMAGE_NAME      = 'parallax-angular'
        STACK_PATH      = '/opt/stack'
        DOCKERHUB_USER  = 'diegokoes'
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

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DH_USER',
                    passwordVariable: 'DH_PASS'
                )]) {
                    sh """
                        echo "\$DH_PASS" | docker login -u "\$DH_USER" --password-stdin
                        docker tag ${REGISTRY}/${IMAGE_NAME}:latest ${DOCKERHUB_USER}/parallax-angular:latest
                        docker push ${DOCKERHUB_USER}/parallax-angular:latest
                        docker logout
                    """
                }
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
            sh """
                docker images --format '{{.Repository}}:{{.Tag}}' \\
                  | grep '^${REGISTRY}/${IMAGE_NAME}:' \\
                  | grep -v ':latest\$' \\
                  | grep -v ':${BUILD_NUMBER}\$' \\
                  | xargs -r docker rmi 2>/dev/null || true
            """
        }
        failure {
            echo "Build #${BUILD_NUMBER} failed"
        }
    }
}
