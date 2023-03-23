# Intro to Docker

### Docker Defined

Available since 2013, Docker is an open-source platform / engine 
where programmers can develop, ship, and run containers.

Docker isolates applications from infrastructure including the
hardware, operating system, and container runtime

### Docker's Underlying Technology

- Written in Go programming language
- Uses Linux kernel features to deliver functionality
- Uses the namespaces technology to provide an isolated workspace called a "container"
- Creates a set of namespaces for every container and each aspect runs in a separate namespace with limited access to that namespace

### Docker Benefits

- Consistent and isolated environments
- Fast deployment
- Repeatability and automation
- Support Agile and CI/CD DevOps practices
- Versioning for each testing, rollbacks, and re-deployments
- Collaboration, modularity, and scaling
- Easy portability and flexibility


### Challenging Use Cases

Docker is not a good fit for applications:
- Requiring high performance or security
- Base on Monolith architecture
- Using rich GUI features
- Performing standard desktop or limited functions