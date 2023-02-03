job('generated-job-nodejs-example') {
    scm {
        git('https://github.com/tyeporter/jenkins-demo') {  node -> // is hudson.plugins.git.GitSCM
            node / gitConfigName('Tye Porter')
            node / gitConfigEmail('tyeporterapps@gmail.com')
        }
    }
    triggers {
        scm('H/5 * * * *')
    }
    wrappers {
        nodejs('nodejs') // this is the name of the NodeJS installation in
                         // Manage Jenkins -> Configure Tools -> NodeJS Installations -> Name
    }
    steps {
        shell("npm install")
    }
}
