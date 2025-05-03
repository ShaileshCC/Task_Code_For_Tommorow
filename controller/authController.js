import { User } from "../model/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import config from "../config/config.js";

// export const signup = asyncHandler(async (req, res, next) => {
//   const { firstName, lastName, email, password } = req.body;

//   console.log("Received data for signup:", { firstName, lastName, email, password });

//   // Check if user exists
//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     console.log("User already exists:", existingUser);
//     return next(new ApiError(409, "User with this email already exists"));
//   }

//   // Create user
//   let user;
//   try {
//     user = await User.create({
//       firstName,
//       lastName,
//       email,
//       password,
//     });
//     console.log("User created successfully:", user);
//   } catch (err) {
//     console.error("Error creating user:", err);
//     return next(new ApiError(500, "Error creating user"));
//   }

//   // Create JWT token
//   let token;
//   try {
//     token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "1h" });
//     console.log("JWT Token generated:", token);
//   } catch (err) {
//     console.error("Error generating JWT token:", err);
//     return next(new ApiError(500, "Error generating JWT token"));
//   }

//   return res.status(201).send(new ApiResponse(201, { user, token }, "User registered successfully"));
// });

export const signup = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  if (![firstName, lastName, email, password].every(field => field?.trim())) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const user = await User.create({ firstName, lastName, email, password });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering user");
  }

  return res.status(201).json(
    new ApiResponse(201, createdUser, "User registered successfully")
  );
});


export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid credentials");
  }

  const token = jwt.sign({ id: user._id }, config.JWT_SECRET, { expiresIn: "1h" });

  res.status(200).json(new ApiResponse(200, { user, token }, "Login successful"));
});


export const getProfile = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.status(200).json(new ApiResponse(200, user, "User profile retrieved"));
});


export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; 
  await user.save();

  const resetUrl = `http://localhost:5000/api/v1/reset-password/${resetToken}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.EMAIL,
      pass: config.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: config.EMAIL,
    to: user.email,
    subject: "Password Reset Request",
    text: `You requested a password reset. Click the link below to reset your password:\n\n${resetUrl}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return next(new ApiError(500, "Error sending email"));
    }

    res.status(200).json(new ApiResponse(200, {}, "Password reset link sent to email"));
  });
});

// Reset Password: Update password after token validation
export const resetPassword = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const { newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).json(new ApiResponse(200, {}, "Password reset successfully"));
});
