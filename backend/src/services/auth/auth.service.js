import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import STATUS_CODES from "../../constants/http/statusCodes.js";

export const registerUser = async ({ name, email, password }) => {
  const normalizedEmail = email ? email.toLowerCase().trim() : email;
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    const error = new Error("Email already exists");
    error.statusCode = STATUS_CODES.CONFLICT;
    throw error;
  }

  const user = await User.create({
    name: name?.trim(),
    email: normalizedEmail,
    password,
  });

  return user;
};

export const loginUser = async ({ email, password }) => {
  const normalizedEmail = email ? email.toLowerCase().trim() : email;
  const user = await User.findOne({ email: normalizedEmail });

  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = STATUS_CODES.UNAUTHORIZED;
    throw error;
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = STATUS_CODES.UNAUTHORIZED;
    throw error;
  }

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );

  return {
    token,
    user,
  };
};
