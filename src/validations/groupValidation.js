const joi = require("joi");

const groupValidationSchema = joi.object({
  groupname: joi
    .string()
    .min(4)
    .max(30)
    .pattern(new RegExp("^[a-zA-Z0-9 ]+$"))
    .required().messages({
      "string.empty": "Group Name is Required.",
      "string.min": "Group name must be at least 4 characters long",
      "string.max": "Username must be less than 30 characters",
      "string.pattern.base":
        "Group Name can only contain alphanumeric characters, spaces, and hyphens.",
    }),
  groupdetail: joi.string().max(300).required().messages({
    "string.empty": "Group Name is Required.",
    "string.max": "Username must be less than 300 characters",
  }),
  member_email: joi
    .string()
    .optional()
    .allow('')
    .trim()
    .email()
    .lowercase()
    .pattern(new RegExp("^[^s@]+@[^s@]+.[^s@]+$"))
    .messages({
      "string.email": "Please provide a valid email address",
      "string.pattern.base": "Please provide a valid email address",
    }),
});

module.exports={groupValidationSchema}
