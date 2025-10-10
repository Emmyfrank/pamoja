import { body } from "express-validator";

export const suggestionsRequestBodyValidator = [
  body()
    .custom((value, { req }) => {
      const requiredFields = ["type", "suggestion"];
      const receivedFields = Object.keys(req.body);
      const hasExtraFields = receivedFields.some(
        (el) => !requiredFields.includes(el)
      );
      if (hasExtraFields) throw new Error();
      return true;
    })
    .withMessage("Allowed fields are 'type' and 'suggestion'"),
  body("type").trim().notEmpty().withMessage("type field needs a value"),
  body("suggestion")
    .trim()
    .notEmpty()
    .withMessage("suggestion field needs a value"),
];
