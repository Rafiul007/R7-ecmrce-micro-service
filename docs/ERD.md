# ER Diagram

This diagram reflects the current MongoDB models across services (IAM, Product Catalog, Shift).

```mermaid
erDiagram
  USER {
    string _id PK
    string email
    string roles
  }

  EMPLOYEE_PROFILE {
    string _id PK
    string userId FK
    string employeeType
    string employeeCode
  }

  CUSTOMER_PROFILE {
    string _id PK
    string userId FK
    string customerType
  }

  CATEGORY {
    string _id PK
    string name
    string parent FK
  }

  PRODUCT {
    string _id PK
    string name
    string category FK
    string createdBy FK
    string updatedBy FK
  }

  SHIFT {
    string _id PK
    string branchId
    string employeeId FK
    string openedBy FK
    string closedBy FK
  }

  CASH_MOVEMENT {
    string _id PK
    string shift FK
    string createdBy FK
  }

  USER ||--o| EMPLOYEE_PROFILE : has
  USER ||--o| CUSTOMER_PROFILE : has
  USER ||--o{ SHIFT : opens
  USER ||--o{ SHIFT : closes
  USER ||--o{ CASH_MOVEMENT : creates

  EMPLOYEE_PROFILE ||--o{ SHIFT : assigned

  CATEGORY ||--o{ PRODUCT : contains
  CATEGORY ||--o| CATEGORY : parent

  SHIFT ||--o{ CASH_MOVEMENT : has
```

Notes:
- `EMPLOYEE_PROFILE.userId` and `CUSTOMER_PROFILE.userId` reference `USER._id`.
- `SHIFT.employeeId` is populated from the IAM JWT `employeeId` field.
- `CATEGORY.parent` is a self-reference for nested categories.
