# 🛍️ R7 E-Commerce Microservices Platform

> A modular, scalable backend built with **Node.js, TypeScript, Express, Redis, MongoDB, and Docker** using a microservices architecture.

---

## 📌 Overview

This project implements a real-world e-commerce backend using the microservices architecture.  
Each service handles its own domain (authentication, catalog, etc.) and communicates through an API Gateway.

This project focuses on:

- 🔹 Domain separation
- 🔹 RBAC authorization
- 🔹 JWT authentication
- 🔹 Swagger API documentation
- 🔹 Docker support
- 🔹 Scalable service boundaries
- 🔹 Unit Test using Jest
- 🔹 Github workflow

---

## ⚙️ Tech Stack

| Category           | Technology                               |
| ------------------ | ---------------------------------------- |
| Language           | TypeScript                               |
| Framework          | Express.js                               |
| Auth               | JWT + Refresh Tokens (HTTP-only cookies) |
| Database           | MongoDB + Redis                          |
| API Gateway        | Custom Node-based router                 |
| Documentation      | Swagger (OpenAPI 3.0)                    |
| Package Management | Yarn Workspaces                          |
| Containerization   | Docker                                   |
| Test               | Jest                                     |
| ------------------ | ---------------------------------------- |


## 🚀 Running the Project

### Install dependencies

```sh
yarn install
```

Start all services (development)
```sh
yarn dev:all
```

## 🧭 Roadmap

⏳ Inventory microservice

⏳ Order workflow

⏳ Kafka/RabbitMQ event bus

⏳ Full audit logging

⏳ Role editor panel

⏳ Redis

# 👨‍💻 Author

Created by Rafi — continuously evolving and improving. Test
