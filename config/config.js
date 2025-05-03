export default {
    JWT_SECRET: process.env.JWT_SECRET || "your_jwt_secret",
    MONGO_URI: process.env.MONGO_URI || "mongodb://localhost:27017/test",
    EMAIL: process.env.EMAIL || "your-email@example.com",
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || "your-email-password",
  };
  