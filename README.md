## Incident Management System

Microservice-based system for anonymous incident reporting and moderation.

The architecture consists of multiple backend services exposed exclusively through an **API Gateway**, preventing direct access to internal services. Services are registered via **Eureka** and centrally configured using a **Config Server**.

Incident reports containing **geolocation, incident type/subtype, description, and optional image attachments** are stored in a database. A **map service integration** enables location selection and visualization of approved incidents with filtering by type, location, and time range.

A **moderation service** allows moderators to review and approve or reject submitted reports before they become publicly visible. Authentication is implemented using **OAuth2 (Google domain authentication)**.

All services are **Dockerized**, each with its own `Dockerfile`, and the entire system can be started using **docker-compose**.

## CI/CD

CI/CD is implemented with **GitHub Actions**:
- Builds each microservice
- Pushes Docker images to **DockerHub**
- Deploys the system with **docker-compose**
- Runs basic **API integration tests**
