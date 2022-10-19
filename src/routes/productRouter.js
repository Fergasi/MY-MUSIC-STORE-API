const express = require("express");
const { createProduct, getProducts } = require("../services/ProductServices");

const productRouter = express.Router();

productRouter.post("/create-product", createProduct);

productRouter.get("/get-products", getProducts);

module.exports = productRouter;
