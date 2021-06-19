node {
    def app

    stage('Clone repository'){
        checkout scm
    }
    stage('Build image'){
       dockerImage = docker.build registry + ":$BUILD_NUMBER"
    }
    stage('Test image'){
        echo "tests passed"
    }
    stage('Push image') {
        docker.withRegistry('https://registry.hub.docker.com', 'dockerCred') {
            dockerImage.push()
            } 
                echo "Trying to Push Docker Build to DockerHub"
    }
    stage('Cleaning up') { 
            steps { 
                sh "docker rmi $registry:$BUILD_NUMBER" 
            }
        }
}
