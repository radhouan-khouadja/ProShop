import Product from "../models/productModel.js";
import mongoose from "mongoose";
import asyncHandler from "express-async-handler";

//  @desc      Fetch All Products
//  @route     /api/products
//  @access    public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

//  @desc      Fetch Single Product
//  @route     /api/products/:id
//  @access    public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(
    mongoose.Types.ObjectId(req.params.id)
  );
  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw Error("Product not found");
  }
});

export { getProducts, getProductById };
