import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    rating: {
      type: Number,
      required: [true, "Rating is required"],
    },
    story: {
      type: String,
      required: [true, "Story is required"],
    },
    name: {
      type: String,
    },
    location: {
      type: String,
    },
  },
  { timestamps: true }
);

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
export default Testimonial;
