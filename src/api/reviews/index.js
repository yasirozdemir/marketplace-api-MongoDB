import Express from "express";
import reviewsModel from "./model.js";
import q2m from "query-to-mongo";
import createHttpError from "http-errors";

const reviewsRouter = Express.Router();

reviewsRouter.post("/", async (req, res, next) => {
  try {
    const newReview = new reviewsModel(req.body);
    const { _id } = await newReview.save();
    res.status(201).send({
      message: "Review successfully sent!",
      id: _id,
    });
    res.status(201).send();
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/", async (req, res, next) => {
  try {
    const queryToMongo = q2m(req.query);
    const { reviews, totalReviews } =
      await reviewsModel.getReviewsWithUserDetails(queryToMongo);
    res.send({ totalReviews, reviews });
  } catch (error) {
    next(error);
  }
});

reviewsRouter.get("/:reviewId", async (req, res, next) => {
  try {
    const review = await reviewsModel.getReviewWithUserDetails(
      req.params.reviewId
    );
    if (review) res.send(review);
    else
      next(
        createHttpError(404, `Review with id ${req.params.reviewId} not found!`)
      );
  } catch (error) {
    next(error);
  }
});

reviewsRouter.put("/:reviewId", async (req, res, next) => {
  try {
    const updatedReview = await reviewsModel.findByIdAndUpdate(
      req.params.reviewId,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (updatedReview) res.send(updatedReview);
    else
      next(
        createHttpError(404, `Review with id ${req.params.reviewId} not found!`)
      );
  } catch (error) {
    next(error);
  }
});

reviewsRouter.delete("/:reviewId", async (req, res, next) => {
  try {
    const deletedReview = await reviewsModel.findByIdAndDelete(
      req.params.reviewId
    );
    if (deletedReview) res.status(204).send();
    else
      next(
        createHttpError(404, `Review with id ${req.params.reviewId} not found!`)
      );
  } catch (error) {
    next(error);
  }
});

export default reviewsRouter;
