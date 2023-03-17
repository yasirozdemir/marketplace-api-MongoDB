import mongoose from "mongoose";
const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    // user can be added as an extra
    comment: { type: String, reqired: true },
    rate: {
      type: Number,
      reqired: true,
      min: [0, "Do you think a review can be a negative number? :("],
      max: [
        5,
        "We're happy to see that you love this product, but unfortunately, the max value for a review is 5! :)",
      ],
    },
  },
  { timestamps: true }
);

export default model("Review", reviewSchema);
