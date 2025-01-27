# API Backend for User and Business Card Management

This API allows the creation of regular users and business users who can manage their business cards. It includes functionality for creating, editing, and deleting business cards, as well as managing user roles.

## Features
- **User Registration & Authentication**
  - Regular users can sign up and authenticate via a login system.
  - Business users have the same registration process but gain extra permissions for business card management.
- **Business Card Management**
  - Business users can create, edit, and delete business cards associated with their account.
  - Each business card can contain information such as name, job title, contact info, and more.
  
## Getting Started

To run this project locally, follow the steps below:

### Prerequisites
- Node.js
- MongoDB 
- Postman or any API testing tool (for testing endpoints)

### Installation
1. npm install

3. Set up environment variables (e.g., database URI, JWT secret) in a `.env` file:
   DATABASE_URI=mongodb://localhost:27017/yourdb
   JWT_SECRET=your-secret-key

4. Run the application:
   npm start


Now, the API should be running on `http://localhost:3000` (or your configured port).

## API Endpoints
### all endpoints must start with /api/

### Users Endpoints

| No. | URL          | Method | Authorization             | Action                        | Notice                  | Return            |
|-----|--------------|--------|---------------------------|-------------------------------|------------------------ |-------------------|
| 1.  | /users       | POST   | all                       | Register user                 | Unique email            | the user created  |
| 2.  | /auth        | POST   | all                       | Login                         | credentials             |  Encrypted token  |
| 3.  | /users       | GET    | admin                     | Get all users                 |                         | Array of users    |
| 4.  | /users/:id   | GET    | The registered user/admin | Get user                      |                         | User              |
| 5.  | /users/:id   | PUT    | The registered user/admin | Edit user                     | name,phone,address,image| User              |
| 6.  | /users/:id   | PATCH  | The registered user/admin | Change `isBusiness` status    | reverse current status  | User              |
| 7.  | /users/:id   | DELETE | The registered user/admin | Delete user                   |                         | Deleted user      |

---

### Cards Endpoints
| No. | URL                        | Method | Authorization                | Action           | Return           |
|-----|----------------------------|--------|------------------------------|------------------|------------------|
| 1.  | /cards                     | GET    | all                          | All cards        | Array of cards   |
| 2.  | /cards/my-cards            | GET    | The registered user          | Get user cards   | Array of cards   |
| 3.  | /cards/:id                 | GET    | all                          | Get card         | Card             |
| 4.  | /cards                     | POST   | Business user                | Create new card  | Card             |
| 5.  | /cards/:id                 | PUT    | The original user/admin      | Edit card        | updated Card     |
| 6.  | /cards/:id                 | PATCH  | A registered user            | Like card        | Card             |
| 7.  | /cards/:id                 | DELETE | The original user/admin      | Delete card      | Deleted card     |

***bonus

| 8.    | /cards/biznumberchange/:id   | PATCH    | admin                        | change biz number   | updated card       |
***request body example: {"newBizNumber":"111111111"}
---


## Authentication
This API uses JWT (JSON Web Token) for authentication. After logging in with valid credentials, a token is issued which should be passed in the `Authorization` header for all requests that require authentication.


## Technologies Used
- Node.js
- Express js
- MongoDB
- JWT for authentication

