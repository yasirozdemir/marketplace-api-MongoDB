import Express from "express";
import reviewsModel from "./model.js";
import q2m from "query-to-mongo";

const reviwsRouter = Express.Router();

reviwsRouter.post("/", async (req, res, next) => {
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

reviwsRouter.get("/", async (req, res, next) => {
  try {
    const queryToMongo = q2m(req.query);
    const { reviews, totalReviews } =
      await reviewsModel.getReviewsWithUserDetails(queryToMongo);
    res.send({ totalReviews, reviews });
  } catch (error) {
    next(error);
  }
});

reviwsRouter.get("/:reviewId", async (req, res, next) => {
  try {
    const review = await reviewsModel.getReviewWithUserDetails(
      req.params.reviewId
    );
    res.send(review);
  } catch (error) {
    next(error);
  }
});

reviwsRouter.put("/:reviewId", async (req, res, next) => {
  try {
    res.send();
  } catch (error) {
    next(error);
  }
});

reviwsRouter.delete("/:reviewId", async (req, res, next) => {
  try {
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default reviwsRouter;
