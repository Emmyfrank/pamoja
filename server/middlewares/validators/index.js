import { validationResult } from "express-validator";
import { loginRequestBodyValidator } from "./login.request.validator.js";
import { registerRequestBodyValidator } from "./register.request.validator.js";
import { addTestimonialRequestBodyValidator } from "./testimonial.request.validator.js";

const validateRequestBody = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: errors.array()[0]?.msg || "Bad request",
    });
  }
};
export {
  loginRequestBodyValidator,
  validateRequestBody,
  registerRequestBodyValidator,
  addTestimonialRequestBodyValidator,
};
