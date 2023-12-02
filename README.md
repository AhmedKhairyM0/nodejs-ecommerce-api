# E-Shop API documentation

## Features

- [x] CRUD operations
- [x] More features at CRUD: Pagination, Search, Sort, Limit fields
- [x] Authentication
  - [x] Sign up
  - [x] Verify User's email
  - [x] Log in
  - [x] Forgot Password
  - [x] Send reset token (OTP)
  - [x] Reset Password
- [x] Authorization
  - [x] Restricted roles
  - [ ] Apply ACL architecture permissions
- [x] User Operations
  - [x] Admin
    - CRUD operations on user
    - Change user password
  - [x] User
    - Update User's data
    - Change User's password
    - Soft delete for user
- [x] Images Compression
- [x] Upload images with multer
- [ ] Upload images at AWS S3
- [ ] Apply common security measures
- [ ] Payment with Stripe
- [ ] Caching wiht Redis
- [x] Deployment at Render
- [ ] Deployment at AWS EC2
- [ ] API Documentation

## Tools

- Node.js Framework: express.js
- Validations layer: express-validator
- Database: mongodb & mongoose ODM
- Auth: jsonwebtoken
- Encryption: bcryptjs
- Upload files: multer & AWS S3
- Images Compression: sharp
- Send Emails: nodemailer
- Environment Variables: dotenv

<!-- ## E-Shop API Usage

```

BASE_URL: https://ecommerce-api-ku0x.onrender.com/api/v1/

```

## Resources

### Categories

#### Get a list of categories

##### Request

```
    GET BASE_URL/categories
```

##### Response

### Subcategories

### Brands

### Products

### Reviews

### Carts

### User

### Auth -->
