import { body, validationResult } from "express-validator";

const validateResult = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const registerUserValidation = [
  body("name")
    .isString()
    .withMessage("User name must be string")
    .isLength({ min: 3 })
    .withMessage("min 3 char are required."),

  body("email").isEmail().withMessage("Please provide a valid email address"),
  body("password")
    .isLength({ min: 3 })
    .withMessage("Password must be at least 3 characters long"),
  validateResult,
];
