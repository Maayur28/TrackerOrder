node {
    def app

    stage('Clone repository'){
        checkout scm
    }
    stage('Build image'){
        app=docker.build("mayur28121996/trackerorderapp")
    }
    stage('Test image'){
        echo "tests passed"
    }
    stage('Push image') {
        docker.withRegistry('https://registry.hub.docker.com', 'dockerCred') {
            app.push("${env.BUILD_NUMBER}")
            app.push("latest")
            } 
                echo "Trying to Push Docker Build to DockerHub"
    }
}