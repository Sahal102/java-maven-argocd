pipeline {
    agent any
    stages {
        stage('Build') {
            steps {
                sh 'docker build -t product-ordering-app .'
            }
        }
        stage('Deploy') {
            steps {
                sh 'docker run -d -p 80:3000 product-ordering-app'
            }
        }
    }
}