# 2. Basic Docker Commands

## Running Images

`docker run <image_name>` - Runs image on Docker host (if it exists)
  - If the image doesn't exist, the image will be pulled from Dockerhub
  - The image will be reused in subsequent runs
  - **Example**: `docker run nginx`

## Listing Containers

`docker ps [-a]` - List running containers
  - When using the `-a` flag, it will list all containers (running and stopped)

## Stopping Container

`docker stop <container_id | container_name>` - Stops specified container using container id or name
  - We can use `docker ps` to get container info

## Removing a Container

`docker rm <container_id | container_name>` - Removes specified container permanently

## Listing Images

`docker images` - Lists images on host

## Removing Images

`docker rmi <image_name>` - Removes image
  - **WARNING**: In order to delete an image, we must delete all dependent containers

## Pulling Images

`docker pull <image_name>`- Pulls image from Dockerhub and stores it on our host
  - **Example**: `docker pull ubuntu`

## Appending Command to Base Image

**NOTE**: Base images aren't meant to be ran by themselves. If we try to, the container will exit immediately.

`docker run <base_image> <commands...>` - Runs command on base image
  - **Example**: `docker run ubuntu sleep 5`

## Executing Command on Running Container

`docker exec <container_id | container_name> <commands...>` - Executes command on specified container
  - **Example**: `docker exec silly_ram cat /etc/hosts`

## Running Container in Detached Mode

`docker run -d <image_name>` - Runs the container process in the background rather than in current terminal
  - **Example**: `docker run -d kodekloud/simple-webapp`

## Attatching to Detached Container

`docker attach <container_id_beginning>` - Attaches to a container running the background

----

## Practical Examples

- `docker run centos` - Download and runs centos image, immediately stops because it's a base image
- `docker run -it centos bash` - Run, login, and run bash in centos container 
- `exit` - Exit logged in container