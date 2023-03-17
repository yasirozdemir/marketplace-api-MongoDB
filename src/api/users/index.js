import Express from "express";
import createHttpError from "http-errors";
import q2m from "query-to-mongo";
import UsersModel from "./model.js";

const usersRouter = Express.Router();

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UsersModel(req.body);
    const { _id } = await newUser.save();
    res.status(201).send({
      message: "New user successfully created!",
      id: _id,
    });
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/", async (req, res, next) => {
  try {
    const queryToMongo = q2m(req.query);
    const users = await UsersModel.find(
      queryToMongo.criteria,
      queryToMongo.options.fields
    )
      .sort(queryToMongo.options.sort)
      .skip(queryToMongo.options.skip)
      .limit(queryToMongo.options.limit);
    const totalUsers = await UsersModel.countDocuments(queryToMongo.criteria);
    res.send({
      totalUsers,
      users,
    });
  } catch (error) {
    next(error);
  }
});

// usersRouter.get("/:userId", async (req, res, next) => {
//   try {
//     res.send();
//   } catch (error) {
//     next(error);
//   }
// });

// usersRouter.put("/:userId", async (req, res, next) => {
//   try {
//     res.send();
//   } catch (error) {
//     next(error);
//   }
// });

// usersRouter.delete("/:userId", async (req, res, next) => {
//   try {
//     res.status(204).send();
//   } catch (error) {
//     next(error);
//   }
// });

export default usersRouter;
