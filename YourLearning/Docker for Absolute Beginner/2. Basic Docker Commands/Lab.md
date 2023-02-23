# Basic Docker Commands Lab

#### What is the version of Docker Server Engine?

```bash
docker version
```

#### How many conainers are running on host?

```bash
docker ps
```

#### How many images are available on the host?

```bash
docker images
```

#### Run a container using the `redis` image?

```bash
docker run redis
```

#### Stop attached container.

Use the command `Crtl+C`

#### How many containers are present on the host?

```bash
docker ps -a
```

#### Stop all running containers.

```bash
docker stop $(docker ps -a -q)
```

#### Remove all containers.

```bash
docker rm $(docker ps -a -q)
```

#### Delete the `ubuntu` image.

```bash
docker rmi ubuntu
```

#### Pull the image `nginx:1.14-alpine` without running a container.

```bash
docker pull nginx:1.14-alpine
```

#### Run a container with the `nginx:1.14-alpine` image and name it `webapp`.

```bash
docker run --name webapp nginx:1.14-alpine
```

#### Remove `webapp` container and `nginx:1.14-alpine` image.

```bash
$ docker rm webapp
webapp
$ docker rmi nginx:1.14-alpine
Untagged: nginx:1.14-alpine
Untagged: nginx@sha256:485b610fefec7ff6c463ced9623314a04ed67e3945b9c08d7e53a47f6d108dc7
Deleted: sha256:8a2fb25a19f5dc1528b7a3fabe8b3145ff57fe10e4f1edac6c718a3cf4aa4b73
Deleted: sha256:f68a8bcb9dbd06e0d2750eabf63c45f51734a72831ed650d2349775865d5fc20
Deleted: sha256:cbf2c7789332fe231e8defa490527a7b2c3ae8589997ceee00895f3263f0a8cf
Deleted: sha256:894f3fad7e6ecd7f24e88340a44b7b73663a85c0eb7740e7ade169e9d8491a4c
Deleted: sha256:a464c54f93a9e88fc1d33df1e0e39cca427d60145a360962e8f19a1dbf900da9
```