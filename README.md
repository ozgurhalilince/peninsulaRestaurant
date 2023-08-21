# Peninsula Restaurant

### Introduction
"Peninsula Restaurant" project aims to provide a simple API solution for restaurant owners to streamline the process of managing restaurant tables, operating hours and reservations.

The project is built with KoaJS, JEST, MongoDB (with Mongoose), Docker (with docker-compose).

### Installation
Clone the project
```
git clone https://github.com/ozgurhalilince/peninsulaRestaurant
```
Create your .env file
```
cd peninsulaRestaurant && cp -r .env.example .env
```
Up
```
docker-compose up
```
Seed the database
```
docker exec -it api npm run db:seed
```

After seeding you will have
- a dummy user with email "john.doe@peninsula.com" and password "example"
- dummy daily working hours for a week
- dummy tables for the restaurant

### Architecture

The architecture of the "Peninsula Restaurant" API project has been carefully designed, incorporating a set of technologies that align with the project's requirements and objectives. The selected technologies offer a range of benefits that contribute to the project's efficiency, scalability, maintainability and the ability to handle evolving requirements.

##### KoaJS
KoaJS was chosen as the web framework for building the API due to its lightweight nature and asynchronous middleware architecture. This allows for better control over the request-response flow, making it ideal for building APIs with high concurrency and performance demands. Koa's use of async/await simplifies asynchronous code handling, promoting cleaner and more readable code.

##### JWT
JSON Web Tokens are an open, industry standard RFC 7519 method for representing claims securely between two parties.

##### Mongoose
Mongoose provides a straight-forward, schema-based solution to model your application data. It includes built-in type casting, validation, query building, business logic hooks and more, out of the box.

##### Nodemon
Nodemon is a utility depended on about 3 million projects, that will monitor for any changes in your source and automatically restart your server. Perfect for development.

##### Docker and Multi Stage Builds
Docker is a platform designed to help developers build, share, and run container applications. It handles the tedious setup.

Multi-stage builds are useful to anyone who has struggled to optimize Dockerfiles while keeping them easy to read and maintain.

##### Docker Compose
Compose is a tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application’s services. Then, with a single command, you create and start all the services from your configuration. Compose works in all environments; production, staging, development, testing, as well as CI workflows.

##### MongoDB
MongoDB, a NoSQL database, was chosen for its flexibility and scalability. In a dynamic environment like a restaurant, where requirements might evolve, MongoDB's schema-less structure allows for easy adaptation without requiring extensive schema changes.

**Benefits:**
-   **Flexible Schema:** MongoDB's schema-less nature accommodates changes in data structure without requiring database migrations, making it well-suited for evolving requirements.
-   **Scalability:** MongoDB's horizontal scaling capabilities support the potential growth of the restaurant's data, ensuring the system can handle increased demand.
-   **Document-Oriented:** Storing data in documents enhances data locality and reduces the need for complex joins, which can lead to improved query performance.
-   
##### Swagger [not yet]
Simplify API development for users, teams, and enterprises with the Swagger open source and professional toolset. Find out how Swagger can help you design and document your APIs at scale.

##### JEST [not yet]
Jest is a delightful JavaScript Testing Framework with a focus on simplicity.

##### Node-cron [not yet]
The node-cron module is tiny task scheduler in pure JavaScript for node.js based on GNU crontab. This module allows you to schedule task in node.js using full crontab syntax.
