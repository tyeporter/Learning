# 3. Docker Run Commands

## Specify Image Version

`docker run <image_name>:<tag>` - Specifying an image version by giving it a tag separated by colon
  - **Example**: `docker run maven:3.6.9`
  - By default, `docker run` assume tag is `lastest`

## Run in Interactive / Input  Mode

`docker run -i <image_name>` - Allows us to provide input to our interactive dockerized applications
  - **Example**: `docker run -i hello`
  - Normally docker would let us run the program, but no let us provide input

`docker run -it <image_name>` - Allows us to provide input and attaches to current console/terminal
  - **Example**: `docker run -it hello`
  - This will not only let us provide input, but also see the program output

## Port Mapping

`docker run -i <ext_port>:<int_port> <image_name>` - Allows us to access our application by mapping internal IP port to Docker Host (external) IP port
  - **Example**: `docker run -p 80:5000 webapp` - Maps an application runnning on port `5000` to external port `80`
  - We can map as many applications as we'd like

## Volumn Mapping

`docker run -v <ext_dir>:<int_dir> <image_name>` - Map an internal volume to the external host
  - **Example**: `docker run -v /opt/datadir:/var/lib/mysql mysql` - Maps internal `/var/lib/mysql` volume to the external `/opt/datadir` directory
  - This allows us to persist data even when the container is destroyed

## Inpecting Container

`docker inspect <conainter_id | container_name>` - Displays all details of a container

## Viewing Container Logs

`docker logs <container_id | container_name>` - Shows logs of a (detached) container

