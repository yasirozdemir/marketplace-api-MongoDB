import Express from "express";

const reviwsRouter = Express.Router();

reviwsRouter.post("/", async (req, res, next) => {
  try {
    res.status(201).send();
  } catch (error) {
    next(error);
  }
});

reviwsRouter.get("/", async (req, res, next) => {
  try {
    res.send();
  } catch (error) {
    next(error);
  }
});

reviwsRouter.get("/:reviewId", async (req, res, next) => {
  try {
    res.send();
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
