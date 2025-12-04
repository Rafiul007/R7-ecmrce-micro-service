## 11/30/2025

- starting with IAM service.
- last time work with customer registration and employee registration.
- API working for both of them.
- Initial Idea was to build an universal auth-service that can be use in any project. Then dropped the idea to to merge auth
  customer service together.
- Now I have planned to make a user registration and authetication api. A register user can create profile for customer/eployee.
- For employee, only admin can create.

### 12:30

- customer registration perfect.
- But needs refactoring in customer controller, and routes.


## DEC 4 13:00

LIST of apis for employee for future work
POST    /api/employee
GET     /api/employee
GET     /api/employee/:id
PUT     /api/employee/:id
DELETE  /api/employee/:id

POST    /api/employee/:id/promotions
GET     /api/employee/:id/promotions

POST    /api/employee/:id/performance
GET     /api/employee/:id/performance

POST    /api/employee/:id/attendance
GET     /api/employee/:id/attendance

POST    /api/employee/:id/leave
GET     /api/employee/:id/leave
PUT     /api/employee/:id/leave/:leaveId/approve


## new controller for employee list and employe with ID

## change in JWT: role added