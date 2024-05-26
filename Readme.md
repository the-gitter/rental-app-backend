# RENTAL APP Backend

This repository contains the backend code for a microservices-based application. The backend is built using Node.js, Express, and MongoDB, and includes features for user authentication, business management, notifications, billing, and social media posts.

## Table of Contents

- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Middlewares](#middlewares)
- [Services](#services)
- [Repositories](#repositories)
- [Utils](#utils)
- [Running the Application](#running-the-application)

## Getting Started

To get started with this project, you need to have Node.js and MongoDB installed on your machine.

### Prerequisites

- Node.js
- MongoDB
- Redis (optional, for caching)
- RabbitMQ (optional, for message brokering)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables. Create a `.env` file in the root directory and add the following variables:
   ```env
   PORT=50001
   MONGODB_URI=mongodb://127.0.0.1:27017
   REDIS_CLIENT_URI=redis://127.0.0.1:6379
   MSG_BROKER=amqp://localhost:5672
   DB_NAME=microServices
   ACCESS_TOKEN_SECRET=8ed7c31f17aae378ff9cb32d1274ed0408f4dc5ff5adee6b2ab109add0b139ca
   REFRESH_TOKEN_SECRET=71f5e973be54c4412f26e53a0b857937ce0540b765151c059ac522042381a9bf
   NODE_ENV='development'
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   CLOUDINARY_CLOUDINARY_URL=
   ```

### Running the Application

To start the application, use the following command:

```bash
npm start
```

The server will start on the port specified in the `.env` file.

## Configuration

Configuration files and environment variables are used to manage different settings for the application.

- `.env`: Environment variables for the application.
- `src/config`: Configuration files for Firebase and other services.

## Project Structure

```plaintext
src/
│   expressApp.ts
│   server.ts
│
├───config
│       firebaseSdkConfig.ts
│       servicesAccountKey.json
│
├───middlewares
│       firebaseMiddleware.ts
│       multer.ts
│
├───models
│   │   addressModel.ts
│   │   billModel.ts
│   │   billTemplateModel.ts
│   │   businessModel.ts
│   │   notificationModel.ts
│   │   reviewModel.ts
│   │   tokenManagementModels.ts
│   │   userModel.ts
│   │
│   └───socialMedia
│           commentsModel.ts
│           postModel.ts
│
├───repositories
│   │   authRepository.ts
│   │   billsRepository.ts
│   │   billTempletRepository.ts
│   │   businessRepository.ts
│   │   cloudinary-repository.ts
│   │   notificationRepository.ts
│   │   userRepository.ts
│   │
│   └───socialMedia
│           postsRepository.ts
│
├───routes
│       authRoutes.ts
│       billsRoutes.ts
│       businessRoutes.ts
│       notificationsRoutes.ts
│       postsRoutes.ts
│       userRoutes.ts
│
├───services
│   │   authService.ts
│   │   BillServices.ts
│   │   businessServices.ts
│   │   notificationServices.ts
│   │   userServices.ts
│   │
│   └───socialMedia
│           PostServices.ts
│
└───utils
    │   convertDateToInvoiceNumber.ts
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

## API Routes

### Authentication Routes

- `POST /auth/firebase-singup`: Sign up with Firebase
- `POST /auth/firebase-login`: Log in with Firebase
- `POST /auth/refresh-tokens`: Refresh tokens
- `POST /auth/logout`: Log out

### User Routes

- `GET /users/me`: Get current user
- `GET /users/:userId`: Get user by ID
- `PUT /users`: Update user
- `DELETE /users`: Delete user
- `POST /users/address`: Create address
- `PUT /users/address`: Update address
- `DELETE /users/address`: Delete address
- `GET /users/bills`: Get bill history

### Business Routes

- `POST /businesses`: Create new business profile
- `GET /businesses/me`: Get my businesses
- `GET /businesses`: Get all businesses
- `GET /businesses/:businessId`: Get business by ID
- `PUT /businesses`: Update business
- `DELETE /businesses`: Delete business

### Bill Routes

- `POST /bills`: Create bill
- `GET /bills/me`: Get bills for customer
- `GET /bills/business/:businessId`: Get bills for business
- `GET /bills/:billId`: Get bill by ID
- `PUT /bills/:billId`: Update bill
- `POST /bills/:customerId/send/:billId`: Send bill as notification

### Notification Routes

- `GET /notifications`: Get notifications
- `PATCH /notifications/:notificationId/read`: Mark as read
- `DELETE /notifications/:notificationId`: Delete notification

### Post Routes

- `POST /posts`: Create post
- `PATCH /posts/:postId/like`: Like post
- `PATCH /posts/:postId/unlike`: Unlike post
- `GET /posts`: Get all posts
- `GET /posts/me`: Get my posts

## Middlewares

- **Firebase Middleware**: Middleware for Firebase authentication and validation.
- **Multer Middleware**: Middleware for handling file uploads.

## Services

Services are used to handle business logic and interact with repositories.

- **AuthServices**: Handles authentication-related operations.
- **UserServices**: Handles user-related operations.
- **BusinessServices**: Handles business-related operations.
- **BillServices**: Handles bill-related operations.
- **NotificationServices**: Handles notification-related operations.
- **PostsService**: Handles social media posts-related operations.

## Repositories

Repositories are used to interact with the database.

- **AuthRepository**: Handles authentication-related database operations.
- **UserRepository**: Handles user-related database operations.
- **BusinessRepository**: Handles business-related database operations.
- **BillsRepository**: Handles bill-related database operations.
- **NotificationRepository**: Handles notification-related database operations.
- **PostsRepository**: Handles social media posts-related database operations.

## Utils

Utility functions and helpers used across the application.

- **convertDateToInvoiceNumber.ts**: Utility to convert date to invoice number format.
- **generate_keys.ts**: Utility to generate keys.
- **init_mongodb.ts**: MongoDB initialization.
- **init_redis.ts**: Redis initialization.
- **jwt_helper.ts**: JWT helper functions.
- **SendApiResponse.ts**: Utility to send API responses.

## License

This project is licensed under the MIT License. See the LICENSE file for details.


`POSTMAN COLLECTION : https://www.postman.com/pavankumarmeesala/workspace/rental`
