pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "pedrogv/basic-api-ktor:latest"
    }

    stages {

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }

        stage('Login to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                }
            }
        }

        stage('Push Image') {
            steps {
                sh 'docker push $DOCKER_IMAGE'
            }
        }

        stage('Deploy on Raspberry Pi') {
            steps {
                sshagent(['raspberry-pi-ssh']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no user@100.108.70.55 "
                        docker pull $DOCKER_IMAGE
                        docker stop mi_contenedor || true
                        docker rm mi_contenedor || true
                        docker run -d --name mi_contenedor -p 80:8080 $DOCKER_IMAGE
                    "
                    '''
                }
            }
        }
    }
}
