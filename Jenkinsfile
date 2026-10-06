pipeline {
    agent any

    environment {
        APP_NAME        = 'agile-basha'
        DOCKER_REGISTRY = 'docker.io'
        DOCKER_REPO     = 'jeeva-m-21/agile-basha'
        IMAGE_TAG       = "${env.BUILD_NUMBER ?: 'latest'}"
        DOCKER_BUILDKIT = '1'
    }

    options {
        buildDiscarder(logRotator(numToKeepStr: '15', artifactNumToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
        timestamps()
        disableConcurrentBuilds()
    }

    parameters {
        choice(name: 'DEPLOY_ENV', choices: ['staging', 'production'], description: 'Deployment target environment')
        booleanParam(name: 'FORCE_DEPLOY', defaultValue: false, description: 'Deploy even if on non-main branch')
        booleanParam(name: 'PUSH_IMAGE', defaultValue: true, description: 'Push built Docker image to Docker registry')
    }

    stages {
        stage('Checkout') {
            steps {
                echo '=== Checking out source code ==='
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '=== Installing Node.js dependencies with clean install ==='
                retry(3) {
                    sh 'npm ci --include=dev --prefer-offline'
                }
            }
        }

        stage('Code Quality & Type Check') {
            steps {
                echo '=== Running TypeScript strict type checking ==='
                sh 'npx tsc --noEmit'
            }
        }

        stage('Run Test Suite') {
            steps {
                echo '=== Executing Vitest unit & integration tests ==='
                sh 'npm test'
            }
        }

        stage('Build Next.js Standalone') {
            steps {
                echo '=== Creating Next.js optimized production build ==='
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "=== Building Docker image: ${DOCKER_REPO}:${IMAGE_TAG} ==="
                sh """
                    docker build \
                        -t ${DOCKER_REPO}:${IMAGE_TAG} \
                        -t ${DOCKER_REPO}:latest \
                        .
                """
            }
        }

        stage('Docker Image Scan') {
            steps {
                echo '=== Inspecting Docker Image ==='
                sh "docker image inspect ${DOCKER_REPO}:${IMAGE_TAG} --format='Size: {{.Size}} bytes, Created: {{.Created}}'"
            }
        }

        stage('Push Docker Image') {
            when {
                allOf {
                    expression { return params.PUSH_IMAGE }
                    anyOf {
                        branch 'main'
                        expression { return params.FORCE_DEPLOY }
                    }
                }
            }
            steps {
                echo "=== Pushing ${DOCKER_REPO}:${IMAGE_TAG} to Docker Registry ==="
                // Uses Jenkins credentials with ID 'docker-hub-credentials'
                // Ensure this credential (Username with password) is created in Jenkins Credentials Store
                withCredentials([usernamePassword(
                    credentialsId: 'docker-hub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh """
                        echo "\$DOCKER_PASS" | docker login -u "\$DOCKER_USER" --password-stdin ${DOCKER_REGISTRY}
                        docker push ${DOCKER_REPO}:${IMAGE_TAG}
                        docker push ${DOCKER_REPO}:latest
                        docker logout ${DOCKER_REGISTRY}
                    """
                }
            }
        }

        stage('Deploy to Environment') {
            when {
                anyOf {
                    branch 'main'
                    expression { return params.FORCE_DEPLOY }
                }
            }
            steps {
                echo "=== Deploying to ${params.DEPLOY_ENV} with Docker Compose ==="
                sh """
                    docker compose down --remove-orphans || true
                    docker compose up -d --build
                """
                echo '=== Verifying container health on port 3000 ==='
                sh """
                    sleep 5
                    curl -f -I http://localhost:3000/ || curl -I http://localhost:3000/home
                """
            }
        }
    }

    post {
        always {
            echo '=== Pipeline Execution Completed ==='
        }
        success {
            echo "SUCCESS: Build #${env.BUILD_NUMBER} of ${env.JOB_NAME} succeeded!"
        }
        failure {
            echo "FAILURE: Build #${env.BUILD_NUMBER} of ${env.JOB_NAME} failed. Check Jenkins console logs."
        }
        cleanup {
            cleanWs deleteDirs: true, notFailBuild: true
        }
    }
}
