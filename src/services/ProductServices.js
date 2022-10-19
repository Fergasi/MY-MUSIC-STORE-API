const ProductModel = require("../models/ProductModel");
const permissionServices = require("./PermissionServices");

const cleanProduct = (productDocument) => {
  return {
    id: productDocument._id,
    title: productDocument.title,
    description: productDocument.description,
    brand: productDocument.brand,
    price: productDocument.price,
    image: productDocument.image,
    favorites: productDocument.favorites,
  };
};

const createProduct = async (req, res, next) => {
  try {
    //Grab the product data from the body
    const { productData } = req.body;

    const userId = req.user.id;

    permissionServices.VerifyUserIsAdmin(req, res, next);

    const productDocument = await new ProductModel(productData);

    //store it in the DB
    productDocument.save();

    //return it to the frontend afterwards
    res.send({ product: cleanProduct(productDocument) });
  } catch (error) {
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    //Grab the product data from DB

    const products = await ProductModel.find();

    //return it to the frontend afterwards
    res.send({ products: products.map(cleanProduct) });
  } catch (error) {
    next(error);
  }
};

const productServices = { createProduct, getProducts };

module.exports = productServices;
