import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import config from "../config/config.js";

const isAuthenticated = async (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    throw new ApiError(401, "No token provided");
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    throw new ApiError(401, "Invalid token");
  }
};

export { isAuthenticated };
