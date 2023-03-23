# Intro to Containers w Docker

### What is a container?

A **container** is a standard unit of software that encapsulates everything that programers need to build, ship, and run applications.

### Why use containers?

Problems with traditional computing environments:
- No way to define resource boundaries for apps in a physical server
- Servers tend to be either over- or under-utilized 
- Requires long periods of provisioning resources and expensive maintenance costs
- Constrained during peak workloads
- Applications are nor portable across multiple environments and operating systems
- Complex, time-consuming and expensive
- Limited scalability and resiliency
- Difficult to implements for multiple platforms

### Container Characteristics

- The container engine virtualizes the operating system
- A container is light-weight, fast, isolated, portable and secure
- Require less memory space
- Binaries, libraries within container enable apps to run
- One machine can host multiple containers

### Container Benefits

- Quickly create applications using automation
- Lower deployment time and costs
- Improve resource utilization (CPU, memory)
- Port across different environments
- Support next-gen applications (microservices)

### Container Challenges

- Security impacted if system affected
- Difficult to manage thousands of containers
- Complex to migrate legacy projects to container technology
- Difficulty to right-size containers for specific scenarios

### Container Vendors

- [Docker]() - Robust and most popular container platform today
- [Podman]() - Daemon-less architecture providing more security than Docker containers
- [LXC]() - Preferred for data-intensive apps and ops
- [Vagrant]() - Offers highest levels of isolation on the running physical machine