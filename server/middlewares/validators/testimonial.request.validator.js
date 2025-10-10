import { body } from "express-validator";

export const addTestimonialRequestBodyValidator = [
  body()
    .custom((value, { req }) => {
      const requiredFields = ["rating", "story", "name", "location"];
      const receivedFields = Object.keys(req.body);
      const hasExtraFields = receivedFields.some(
        (el) => !requiredFields.includes(el)
      );
      if (hasExtraFields) throw new Error();
      return true;
    })
    .withMessage(`Allowed fields are "rating", "story", "name", "location"`),
  body("rating")
    .trim()
    .notEmpty()
    .isNumeric()
    .withMessage("rating field needs a number value"),
  body("story").trim().notEmpty().withMessage("story field needs a value"),
];
