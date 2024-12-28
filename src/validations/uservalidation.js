const joi = require("joi");

const userValidationSchema = joi.object({
  username: joi
    .string()
    .min(3)
    .max(50)
    .pattern(new RegExp("^[A-Za-z]+(?: [A-Za-z]+)*$"))
    .required()
    .messages({
      "string.empty": "Username is required",
      "string.min": "Username must be at least 3 characters long",
      "string.max": "Username must be less than 30 characters",
      "string.pattern.base": "Username can only contain letters and spaces",
    }),
  email: joi
    .string()
    .trim()
    .email()
    .lowercase()
    .pattern(new RegExp("^[^s@]+@[^s@]+.[^s@]+$"))
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Please provide a valid email address",
      "string.pattern.base": "Please provide a valid email address",
    }),
  gender: joi.string().valid("male", "female", "other").required().messages({
    "any.only": "Gender must be 'Male', 'Female', or 'Other'",
    "string.empty": "Gender is required",
  }),
  phone: joi
    .string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.empty": "Phone number is required",
      "string.pattern.base": "Phone number must be 10 digits",
    }),
  password: joi
    .string()
    .min(8)
    .required()
    .pattern(
      new RegExp(
        '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$'
      )
    )
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters long",
      "string.pattern.base":
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character",
    }),
  confirmPassword: joi.string().valid(joi.ref("password")).required().messages({
    "any.only": "Confirm password must match the password",
    "string.empty": "Confirm password is required",
  }),
}).unknown(false);

const signInValidationSchema=joi.object({
  email: joi
  .string()
  .email()
  .required()
  .messages({
    "string.empty": "Email is required",
    "string.email": "Please provide a valid email address",
  }),
  password: joi
    .required()
    .messages({
      "string.empty": "Password is required",
    }),
})

module.exports = {userValidationSchema, signInValidationSchema};
