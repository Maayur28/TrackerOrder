node {
    def app

    stage('Clone repository'){
        checkout scm
    }
    stage('Build image'){
       dockerImage = "mayur28121996/trackerorderapp" + ":$BUILD_NUMBER"
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
                sh "docker rmi "mayur28121996/trackerorderapp":$BUILD_NUMBER" 
            }
        }
}
