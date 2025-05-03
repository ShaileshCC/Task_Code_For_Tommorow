# 🔐 Authentication API

A secure authentication system built with **Node.js**, **Express.js**, **MongoDB**, and **JWT**. It includes user signup, login, profile access, and password reset via email using time-limited tokens.

---

## 🔧 Features

- ✅ User Signup with unique email
- ✅ JWT-based User Login
- ✅ Fetch Authenticated User Profile
- ✅ Forgot Password via Email
- ✅ Reset Password using Token (valid for 5 minutes)
- ✅ Hashed Passwords using `bcryptjs`
- ✅ Middleware for authentication & error handling
- ✅ Industry-standard API response structure

---

## 📁 Project Structure

.
├── controller
│ └── authController.js
├── middleware
│ ├── authMiddleware.js
│ └── errorMiddleware.js
├── model
│ └── User.js
├── routes
│ └── auth.routes.js
├── utils
│ ├── ApiError.js
│ ├── ApiResponse.js
│ └── asyncHandler.js
├── server.js
├── .env
└── README.md

yaml
Copy
Edit

---

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/auth-api.git
cd auth-api
2. Install Dependencies
bash
Copy
Edit
npm install
3. Configure Environment Variables
Create a .env file in the root directory and add the following:

env
Copy
Edit
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d

RESET_PASSWORD_TOKEN_SECRET=your_reset_token_secret
RESET_PASSWORD_TOKEN_EXPIRES_IN=5m

CLIENT_URL=http://localhost:3000

SMTP_HOST=smtp.ethereal.email
SMTP_PORT=587
SMTP_USER=your_ethereal_email@example.com
SMTP_PASS=your_ethereal_email_password
Use Ethereal Email or any SMTP provider for testing email functionality.

4. Run the Server
bash
Copy
Edit
npm run dev
🧪 API Endpoints
✅ Signup
POST /api/v1/auth/signup

json
Copy
Edit
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "strongpassword"
}
🔐 Login
POST /api/v1/auth/login

json
Copy
Edit
{
  "email": "john@example.com",
  "password": "strongpassword"
}
👤 Get User Profile
GET /api/v1/auth/me

Headers: Authorization: Bearer <JWT_TOKEN>

🔁 Forgot Password
POST /api/v1/auth/forgot-password

json
Copy
Edit
{
  "email": "john@example.com"
}
🔄 Reset Password
POST /api/v1/auth/reset-password/:token

json
Copy
Edit
{
  "password": "newStrongPassword"
}
Token is valid for only 5 minutes. After successful reset, the token becomes invalid.
