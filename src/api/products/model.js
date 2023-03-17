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
    // reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  { timestamps: true }
);

const populateOptions = {
  path: "reviews",
  // select will be added later
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
      .limit(mongoQuery.options.limit);
    // .populate(populateOptions);
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
