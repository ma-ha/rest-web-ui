##About the API
You can find the [Docker API here](http://docs.docker.com/reference/api/docker_remote_api/). 
The sample shows only access to the container list.

##How to get it working
You need to enable the Docker remote API on your local docker host:

Edit `/etc/default/docker` config file:
    
`DOCKER_OPTS="-H tcp://127.0.0.1:4243 -H unix:///var/run/docker.sock --api-enable-cors"`