import Express from "express";
import createHttpError from "http-errors";
import ProductsModel from "../products/model.js";

const reviewsRouter = Express.Router();

reviewsRouter.post("/:productId/reviews", async (req, res, next) => {
  try {
    const review = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const product = await ProductsModel.findByIdAndUpdate(
      req.params.productId,
      { $push: { reviews: review } },
      { new: true, runValidators: true }
    );
    if (product) res.status(201).send(product);
    else
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/:productId/reviews", async (req, res, next) => {
  try {
    const product = await ProductsModel.getProductWithReviewDetails(
      req.params.productId
    );
    if (product)
      res.send({
        reviewCount: product.reviews.length,
        reviews: product.reviews,
      });
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const product = await ProductsModel.getProductWithReviewDetails(
      req.params.productId
    );
    if (product) {
      const review = product.reviews.find((r) => r.id === req.params.reviewId);
      if (review) res.send(review);
      else
        next(
          createHttpError(
            404,
            `Review with id ${req.params.reviewId} not found!`
          )
        );
    } else
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
  } catch (error) {
    next(error);
  }
});

reviewsRouter.put("/:productId/reviews/:reviewId", async (req, res, next) => {
  try {
    const product = await ProductsModel.findById(req.params.productId);
    if (product) {
      const index = product.reviews.findIndex(
        (r) => r._id.toString() === req.params.reviewId
      );
      if (index !== -1) {
        product.reviews[index] = {
          ...product.reviews[index].toObject(),
          ...req.body,
          updatedAt: new Date(),
        };
        await product.save();
        res.send(product.reviews[index]);
      } else {
        next(
          createHttpError(
            404,
            `Review with id ${req.params.reviewId} not found!`
          )
        );
      }
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

reviewsRouter.delete(
  "/:productId/reviews/:reviewId",
  async (req, res, next) => {
    try {
      const product = await ProductsModel.findByIdAndUpdate(
        req.params.productId,
        { $pull: { reviews: { _id: req.params.reviewId } } },
        { new: true, runValidators: true }
      );
      if (product) res.status(204).send();
      else
        next(
          createHttpError(
            404,
            `Product with id ${req.params.productId} not found!`
          )
        );
    } catch (error) {
      next(error);
    }
  }
);

export default reviewsRouter;
