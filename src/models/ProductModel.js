const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true, trim: true },
});

const ProductModel = mongoose.model("product", productSchema);

module.exports = ProductModel;
