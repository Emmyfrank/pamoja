import { body } from "express-validator";

export const loginRequestBodyValidator = [
  body()
    .custom((value, { req }) => {
      const requiredFields = ["username", "password"];
      const receivedFields = Object.keys(req.body);
      const hasExtraFields = receivedFields.some(
        (el) => !requiredFields.includes(el)
      );
      if (hasExtraFields) throw new Error();
      return true;
    })
    .withMessage("Allowed fields are 'username' and 'password'"),
  body("username")
    .trim()
    .notEmpty()
    .withMessage("username field needs a value"),
  body("password").notEmpty().withMessage("password needs a value"),
];
