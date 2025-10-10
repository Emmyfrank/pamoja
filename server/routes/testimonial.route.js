import express from "express";
import {
  addTestimonial,
  getAllTestimonials,
} from "../controllers/testimonial.controller.js";
import { addTestimonialRequestBodyValidator } from "../middlewares/validators/index.js";

const router = express.Router();

router
  .route("/")
  .post(addTestimonialRequestBodyValidator, addTestimonial)
  .get(getAllTestimonials);

export default router;
