import express from "express";
import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import Product from "../models/productModel.js";

const router = express.Router();

//  @desc      Fetch All Products
//  @route     /api/products
//  @access    public
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const products = await Product.find();
    res.json(products);
  })
);

//  @desc      Fetch Single Product
//  @route     /api/products/:id
//  @access    public
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const product = await Product.findById(
      mongoose.Types.ObjectId(req.params.id)
    );
    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw Error("Product not found");
    }
  })
);

export default router;
