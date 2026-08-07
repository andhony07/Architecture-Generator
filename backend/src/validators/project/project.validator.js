import { body } from "express-validator";

export const generateProjectValidator = [
  body("title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Project name cannot be empty or whitespace only"),

  body("projectName")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Project name cannot be empty or whitespace only"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Project requirements description is required")
    .isLength({ min: 15 })
    .withMessage("Description must be at least 15 characters long"),
];
