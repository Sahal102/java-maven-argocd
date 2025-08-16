pipeline {
  agent any

  environment {
    APP_NAME     = "node-app"
    DOCKER_IMAGE = "node-app:latest"
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/Sahal102/node.git'
      }
    }

    stage('Build') {
      steps {
        sh 'docker build -t $DOCKER_IMAGE .'
      }
    }

    stage('Deploy') {
      steps {
        sh '''
          docker rm -f $APP_NAME || true
          # Pass DB connection envs from Jenkins credentials or node host
          docker run -d --name $APP_NAME \
            -e PORT=3000 \
            -e APP_NAME=\"Product Ordering App\" \
            -e DB_HOST=$DB_HOST \
            -e DB_PORT=$DB_PORT \
            -e DB_USER=$DB_USER \
            -e DB_PASSWORD=$DB_PASSWORD \
            -e DB_NAME=$DB_NAME \
            -e JWT_SECRET=$JWT_SECRET \
            -p 80:3000 $DOCKER_IMAGE
        '''
      }
    }
  }
}
