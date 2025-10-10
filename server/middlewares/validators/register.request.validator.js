import { body } from "express-validator";

export const registerRequestBodyValidator = [
  body()
    .custom((_, { req }) => {
      const requiredFields = ["username", "password", "isAnonymous"];
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
    .withMessage("username field needs a value")
    .matches(/^.{4,}$/)
    .withMessage("username needs at least 4 characters"),
  body("password")
    .notEmpty()
    .withMessage("password field needs a value")
    .matches(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*_]).{6,}$/)
    .withMessage(
      "Passwords needs at least 6 characters, one uppercase, one lowercase, one number, one special character among these: !@#$%^&*_"
    ),
];
