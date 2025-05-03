import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import config from "../config/config.js";

// Middleware to check if the user is authenticated
const isAuthenticated = async (req, res, next) => {
  // Retrieve the token from the Authorization header
  const token = req.header("Authorization")?.split(" ")[1]; // "Bearer <token>"

  // If no token is provided, throw an error
  if (!token) {
    return next(new ApiError(401, "No token provided"));
  }

  try {
    // Verify the token using the secret key
    const decoded = jwt.verify(token, config.JWT_SECRET);

    // Attach the decoded token data to the request object (for later use)
    req.user = decoded;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    // If token is invalid or expired, throw an error
    return next(new ApiError(401, "Invalid or expired token"));
  }
};

export { isAuthenticated };
