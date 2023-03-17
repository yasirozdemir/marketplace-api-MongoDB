import Express from "express";
import createHttpError from "http-errors";
import q2m from "query-to-mongo";
import ProductsModel from "./model.js";

const productsRouter = Express.Router();

productsRouter.post("/", async (req, res, next) => {
  try {
    const newProduct = new ProductsModel(req.body);
    const { _id } = await newProduct.save();
    res.status(201).send({
      message: "New product successfully created!",
      id: _id,
    });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/", async (req, res, next) => {
  try {
    const queryToMongo = q2m(req.query);
    const { products, totalProducts } =
      await ProductsModel.getProductsWithReviewDetails(queryToMongo);
    res.send({ totalProducts, products });
  } catch (error) {
    next(error);
  }
});

productsRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductsModel.getProductWithReviewDetails(
      req.params.productId
    );
    if (product) res.send(product);
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

productsRouter.put("/:productId", async (req, res, next) => {
  try {
    const updatedProduct = await ProductsModel.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true, runValidators: true }
    );
    if (updatedProduct) res.send(updatedProduct);
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

productsRouter.delete("/:productId", async (req, res, next) => {
  try {
    const deletedProduct = await ProductsModel.findByIdAndDelete(
      req.params.productId
    );
    if (deletedProduct) res.status(204).send();
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

export default productsRouter;
