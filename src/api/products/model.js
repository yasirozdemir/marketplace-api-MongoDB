import mongoose from "mongoose";
const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    brand: { type: String, required: true },
    imageUrl: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    reviews: [
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
        createdAt: { type: Date, reqired: true },
        updatedAt: { type: Date, reqired: true },
      },
    ],
  },
  { timestamps: true }
);

const populateOptions = {
  path: "reviews.user",
  select: "name surname",
};

// productS
productSchema.static(
  "getProductsWithReviewDetails",
  async function (mongoQuery) {
    const products = await this.find(
      mongoQuery.criteria,
      mongoQuery.options.fields
    )
      .sort(mongoQuery.options.sort)
      .skip(mongoQuery.options.skip)
      .limit(mongoQuery.options.limit)
      .populate(populateOptions);
    const totalProducts = await this.countDocuments(mongoQuery.criteria);
    return { products, totalProducts };
  }
);

// product
productSchema.static("getProductWithReviewDetails", async function (id) {
  const product = await this.findById(id).populate(populateOptions);
  return product;
});

export default model("Product", productSchema);
