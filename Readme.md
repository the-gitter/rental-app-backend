# User Microservices Repository

This repository contains the source code for a user management microservice. The microservice provides endpoints for user authentication and management using Firebase, MongoDB, Redis, and RabbitMQ for message brokering.
 
 
 `You can find postman file in assets folder`

## Table of Contents

- [Folder Structure](#folder-structure)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)

## Folder Structure

```plaintext
src/
│   expressApp.ts
│   server.ts
│
├───config
│       firebaseSdkConfig.ts
│       servicesAccountKey.json
│
├───interfaces
├───middlewares
│       firebaseMiddleware.ts
│       multer.js
│
├───models
│       addressModel.ts
│       userModel.ts
│
├───repositories
│       authRepository.ts
│       cloudinary-repository.ts
│       userRepository.ts
│
├───routes
│       authRoutes.ts
│
├───services
│       authService.ts
│
├───types
└───utils
    │   generate_keys.ts
    │   init_mongodb.ts
    │   init_redis.ts
    │   jwt_helper.ts
    │   SendApiResponse.ts
    │
    ├───errors
    │       app-errors.ts
    │
    ├───message_broker
    │       message_broker.ts
    │
    └───validators
            handlers.ts
            validators.ts
```

## Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file:

```plaintext
PORT=50000
MONGODB_URI=mongodb://127.0.0.1:27017
REDIS_CLIENT_URI=redis://127.0.0.1:6379
MSG_BROKER=amqp://localhost:5672
DB_NAME=microServices
ACCESS_TOKEN_SECRET=8ed7c31f17aae378ff9cb32d1274ed0408f4dc5ff5adee6b2ab109add0b139ca
REFRESH_TOKEN_SECRET=71f5e973be54c4412f26e53a0b857937ce0540b765151c059ac522042381a9bf
NODE_ENV='development'
```

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/user-microservice.git
    cd user-microservice
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

## Running the Application

1. Start the application in development mode:

    ```bash
    npm run dev
    ```

2. To build the application:

    ```bash
    npm run build
    ```

3. To run the built application:

    ```bash
    npm run run
    ```

## Available Scripts

- `dev`: Starts the server with `nodemon` for development.
- `build`: Compiles TypeScript files into JavaScript.
- `run`: Runs the compiled JavaScript files.

## API Endpoints

### Auth Routes

- **POST** `/api/firebase-singup`
  - Middleware: `bearerTokenValidator`, `firebaseMiddleware`, `checkIfUserAlearyExists`
  - Service: `authServices.firebaseSignup`

- **POST** `/api/firebase-login`
  - Middleware: `bearerTokenValidator`, `firebaseMiddleware`
  - Service: `authServices.firebaseLogin`

- **POST** `/api/refresh-tokens`
  - Middleware: `refreshTokenValidator`, `verifyRefreshToken`
  - Service: `authServices.refreshTokens`

- **POST** `/api/logout`
  - Middleware: `bearerTokenValidator`, `verifyAccessToken`
  - Service: `authServices.logout`

- **GET** `/api/profile`
  - Middleware: `bearerTokenValidator`, `verifyAccessToken`
  - Returns the user's profile payload

## server.ts

The entry point for the server, it initializes the Express application, connects to MongoDB and the message broker, and sets up the middleware for error handling.

## Contributing

Contributions are welcome! Please create a pull request or submit an issue if you find any bugs or have suggestions for improvements.

## License

This project is licensed under the ISC License. See the `LICENSE` file for more details.

