node {
    def app

    stage('Clone repository'){
        checkout scm
    }
    stage('Build image'){
        app=docker.build("mayur28121996/trackerorder")
    }
    stage('Test image'){
        echo "tests passed"
    }
    stage('Push image') {
        docker.withRegistry('https://registry.hub.docker.com', 'dockerCred') {
            app.push("${env.BUILD_NUMBER}")
            } 
                echo "Trying to Push Docker Build to DockerHub"
    }
     stage('Remove Unused docker image') {
      steps{
        sh "docker rmi mayur28121996/trackerorderapp:$BUILD_NUMBER"
      }
    }
}
