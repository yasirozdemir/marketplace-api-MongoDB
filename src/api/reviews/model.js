import mongoose from "mongoose";
const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User" },
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

const populateOptions = {
  path: "user",
  select: "name surname",
};

// reviewS
reviewSchema.static("getReviewsWithUserDetails", async function (mongoQuery) {
  const reviews = await this.find(
    mongoQuery.criteria,
    mongoQuery.options.fields
  )
    .sort(mongoQuery.options.sort)
    .skip(mongoQuery.options.skip)
    .limit(mongoQuery.options.limit)
    .populate(populateOptions);
  const totalReviews = await this.countDocuments(mongoQuery.criteria);
  return { reviews, totalReviews };
});

// product
reviewSchema.static("getReviewWithUserDetails", async function (id) {
  const review = await this.findById(id).populate(populateOptions);
  return review;
});

export default model("Review", reviewSchema);
